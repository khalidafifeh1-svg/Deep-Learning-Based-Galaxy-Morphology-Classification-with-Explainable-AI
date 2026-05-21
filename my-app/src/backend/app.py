from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms, models
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import io
import base64
from torchvision.models import efficientnet_b3

# Create Flask app
app = Flask(__name__)

# Enable CORS for the app
CORS(app)

#  use GPU if available otherwise CPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Class labels 
class_names = ["Barred_Spiral", "Elliptical", "Spiral"]

# Load EfficientNet-B3 model  
model = models.efficientnet_b3(weights=None)

# Replace final classification layer with 3 output classes
model.classifier[1] = nn.Linear(model.classifier[1].in_features, 3)

# Load trained weights from file
state_dict = torch.load("galaxy_modelEB3.pth", map_location=device)

# Apply weights to model
model.load_state_dict(state_dict)

# Move model to selected device 
model.to(device)

# Set model to evaluation mode 
model.eval()

# Define image preprocessing 
transform = transforms.Compose([
    transforms.Resize((300, 300)),  # Resize image to 300x300
    transforms.ToTensor(),          # Convert image to tensor
    transforms.Normalize(           # Normalize using ImageNet values
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Function to generate Grad-CAM heatmap
def generate_gradcam(model, image_tensor, target_class=None):
    activations = []  # Store feature maps
    gradients = []    # Store gradients

    # Select last convolution layer of EfficientNet
    target_layer = model.features[-1]

    # Hook to capture forward activations
    def forward_hook(module, input, output):
        activations.append(output)

    # Hook to capture gradients during backward pass
    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])

    # Register hooks
    forward_handle = target_layer.register_forward_hook(forward_hook)
    backward_handle = target_layer.register_full_backward_hook(backward_hook)

    # Forward pass  
    output = model(image_tensor)

    # If no target class provided use predicted class
    if target_class is None:
        target_class = output.argmax(dim=1).item()

    # Clear previous gradients
    model.zero_grad()

    # Get score for target class
    class_score = output[:, target_class]

    # Backpropagate to get gradients
    class_score.backward()

    # Get stored activations and gradients
    activation = activations[0]
    gradient = gradients[0]

    # Average gradients over width and height
    weights = gradient.mean(dim=(2, 3), keepdim=True)

    # Multiply weights with activations and sum
    cam = (weights * activation).sum(dim=1, keepdim=True)

    # Apply ReLU 
    cam = F.relu(cam)

    # Convert to numpy array
    cam = cam.squeeze().detach().cpu().numpy()

    # Normalize values between 0 and 1
    cam = cam / (cam.max() + 1e-8)

    # Remove hooks to avoid memory issues
    forward_handle.remove()
    backward_handle.remove()

    # Return heatmap and class index
    return cam, target_class


# Function to overlay heatmap on original image
def create_gradcam_overlay(original_pil, heatmap):
    # Convert original image to numpy array
    original_np = np.array(original_pil).astype(np.float32) / 255.0

    # Convert heatmap to tensor and add dimensions
    heatmap_tensor = torch.tensor(heatmap).unsqueeze(0).unsqueeze(0)

    # Resize heatmap to match original image size
    heatmap_resized = F.interpolate(
        heatmap_tensor,
        size=(original_np.shape[0], original_np.shape[1]),
        mode='bilinear',
        align_corners=False
    ).squeeze().numpy()

    # Create plot
    fig, ax = plt.subplots(figsize=(4, 4), dpi=100)

    # Show original image
    ax.imshow(original_np)

    # Overlay heatmap with transparency
    ax.imshow(heatmap_resized, cmap='jet', alpha=0.35)

    # Remove axis
    ax.axis('off')

    # Adjust layout
    plt.tight_layout(pad=0)

    # Save image to buffer (memory)
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', pad_inches=0)

    # Close plot to free memory
    plt.close(fig)

    # Reset buffer pointer
    buffer.seek(0)

    # Convert image to base64 string
    encoded = base64.b64encode(buffer.read()).decode('utf-8')

    return encoded


# Define API route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    # Check if file is uploaded
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    # Get uploaded file
    file = request.files['file']

    try:
        # Open image and convert to RGB
        original_image = Image.open(file.stream).convert("RGB")

        # Apply preprocessing and add batch dimension
        image = transform(original_image).unsqueeze(0).to(device)

        # Enable gradients 
        with torch.enable_grad():

            # Run model
            outputs = model(image)

            # Convert outputs to probabilities
            probs = torch.softmax(outputs, dim=1)[0]

            # Get predicted class index
            predicted_idx = torch.argmax(probs).item()

            # Get class label
            prediction = class_names[predicted_idx]

            # Get confidence percentage
            confidence = round(probs[predicted_idx].item() * 100, 2)

            # Get all class probabilities
            all_probabilities = {
                class_names[i]: round(probs[i].item() * 100, 2)
                for i in range(len(class_names))
            }

            # Generate Grad-CAM heatmap
            heatmap, _ = generate_gradcam(model, image, predicted_idx)

            # Overlay heatmap on image
            gradcam_base64 = create_gradcam_overlay(original_image, heatmap)

        # Return JSON response
        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "all_probabilities": all_probabilities,
            "gradcam_image": gradcam_base64
        })

    except Exception as e:
        # Handle errors
        return jsonify({"error": str(e)}), 500


# Run the app
if __name__ == '__main__':
    app.run(debug=True)  # debug=True auto-reloads on changes