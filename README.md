# Deep Learning-Based Galaxy Morphology Classification with Explainable AI

## Overview
This project is a deep learning system that classifies galaxy images into morphological categories (Spiral, Elliptical, Barred Spiral) using EfficientNet-B3 and provides explainable AI outputs using Grad-CAM.

## Key Features
- Galaxy image classification using CNN (EfficientNet-B3)
- Transfer learning with ImageNet weights
- Explainable AI using Grad-CAM heatmaps
- application (React + Flask)
- Secure authentication using Firebase

## Dataset
- Galaxy Zoo 2 (Kaggle / Sloan Digital Sky Survey)
- 3-class classification: Spiral, Elliptical, Barred Spiral

## Tech Stack
- Python, PyTorch
- TensorFlow (XAI support if used)
- Flask (Backend API)
- React (Frontend)
- Firebase Authentication
- Scikit-learn, OpenCV, Pandas

## Model Performance
- Test Accuracy: ~73.07%
- Balanced performance across 3 classes
- Best performance: Elliptical galaxies

<img width="833" height="393" alt="4c9a2062-9bf6-477a-b47a-34be50e090e1" src="https://github.com/user-attachments/assets/e3011561-3209-4eeb-94f7-73d73af132f7" />

<img width="842" height="393" alt="d8cf8dbe-010d-4ccb-9ab3-a25e91e06529" src="https://github.com/user-attachments/assets/7d64fdfa-6ce8-4756-b695-d3fae3ab27f3" />

## Explainable AI
Grad-CAM is used to highlight image regions influencing predictions, improving transparency and trust in model decisions.

<img width="481" height="504" alt="d848a237-3f13-4de3-9190-2eb7f5878622" src="https://github.com/user-attachments/assets/d7027ce2-378f-481f-87a7-1c1cfc08c2e3" />

<img width="481" height="504" alt="e4a012bf-b263-47e0-ad49-9418b86cbcff" src="https://github.com/user-attachments/assets/4401a2d8-4e4e-4ebf-88af-55413bf08f9d" />

<img width="481" height="504" alt="2db93f3c-3034-4788-a374-e8e6613d577d" src="https://github.com/user-attachments/assets/e93477a5-05b4-49d7-b79e-c89e89b10108" />


## System Architecture
Image Upload → Preprocessing → EfficientNet-B3 → Prediction → Grad-CAM → UI Display

## Limitations
- Class overlap between spiral and barred spiral galaxies
- Dataset label noise (Galaxy Zoo voting system)
- Hardware limitations during training

## Future Work
- Vision Transformer models
- Larger datasets (more galaxy types)
- SHAP/LIME explainability integration
- Cloud deployment for large-scale inference

## Author
Khalid Abu-Afifeh
