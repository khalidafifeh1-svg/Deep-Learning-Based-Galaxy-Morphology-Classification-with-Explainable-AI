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

## Explainable AI
Grad-CAM is used to highlight image regions influencing predictions, improving transparency and trust in model decisions.

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
