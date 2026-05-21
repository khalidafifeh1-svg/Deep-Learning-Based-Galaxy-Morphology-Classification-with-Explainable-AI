// Import React hooks useState for storing data and useRef for accessing DOM elements
import { useRef, useState } from 'react';

// Import CSS file for styling
import './Main_page.css';

// Create main component
function Main_page() {

  // Store selected file
  const [selectedFile, setSelectedFile] = useState(null);

  // Store preview image URL
  const [preview, setPreview] = useState(null);

  // Store predicted class 
  const [prediction, setPrediction] = useState('');

  // Store confidence percentage
  const [confidence, setConfidence] = useState(null);

  // Store all class probabilities
  const [allProbabilities, setAllProbabilities] = useState({});

  // Store Grad-CAM image 
  const [gradcamImage, setGradcamImage] = useState('');

  // Track loading state 
  const [loading, setLoading] = useState(false);

  // Track drag state
  const [dragActive, setDragActive] = useState(false);

  // Track progress bar value
  const [progress, setProgress] = useState(0);

  // Reference to hidden file input
  const fileInputRef = useRef(null);

  // Reset all prediction-related results
  const resetResults = () => {
    setPrediction('');
    setConfidence(null);
    setAllProbabilities({});
    setGradcamImage('');
    setProgress(0);
  };

  // Handle when a file is selected or dropped
  const handleSelectedFile = (file) => {

    // If no file, do nothing
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    // Save file
    setSelectedFile(file);

    // Create preview URL
    setPreview(URL.createObjectURL(file));

    // Clear old results
    resetResults();
  };

  // When user selects file using file picker
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // get first file
    handleSelectedFile(file); // process it
  };

  // Clear everything
  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    resetResults();

    // Reset file input field
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag enter event
  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  // Drag over event
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  // Drag leave event
  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  // When file is dropped
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const file = event.dataTransfer.files[0]; // get dropped file
    handleSelectedFile(file);
  };

  // Upload file to backend
  const handleUpload = async () => {

    // If no file selected
    if (!selectedFile) {
      alert('Please select or drag an image first.');
      return;
    }

    // Create form data to send file
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setLoading(true);   // show loading state
      setProgress(15);    // start progress bar

      // Fake progress animation (for better UI feel)
      const progressSteps = [30, 45, 60, 75, 90];
      let stepIndex = 0;

      const fakeProgress = setInterval(() => {
        if (stepIndex < progressSteps.length) {
          setProgress(progressSteps[stepIndex]);
          stepIndex += 1;
        }
      }, 300);

      // Send request to Flask backend
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      // Convert response to JSON
      const data = await response.json();

      // Stop fake progress
      clearInterval(fakeProgress);

      if (response.ok) {
        setProgress(100);

        // Save prediction results
        setPrediction(data.prediction);
        setConfidence(data.confidence);
        setAllProbabilities(data.all_probabilities || {});
        setGradcamImage(data.gradcam_image || '');

      } else {
        // Handle API error
        setProgress(0);
        setPrediction(data.error || 'Prediction failed.');
        setConfidence(null);
        setAllProbabilities({});
        setGradcamImage('');
      }

    } catch (error) {
      // Handle network error
      setProgress(0);
      setPrediction('Error connecting to server.');
      setConfidence(null);
      setAllProbabilities({});
      setGradcamImage('');

    } finally {
      setLoading(false); // stop loading
    }
  };

  // UI rendering
  return (
    <div className="Main_page-page">
      <header className="Main_page-header">

        {/* Title */}
        <h1>Galaxy Morphology Classifier</h1>

        {/* Description */}
        <p>Upload or drag a galaxy image and let the AI model predict its morphology.</p>

        <div className="upload-card">

          {/* Drag & Drop Area */}
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="file-input"
            />

            {/* Show upload message or preview */}
            {!preview ? (
              <div className="drop-zone-content">
                <h3>Drag & Drop Image Here</h3>
                <p>or click to browse</p>
              </div>
            ) : (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="preview-image" />
                <p className="file-name">{selectedFile?.name}</p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="button-row">
            <button onClick={handleUpload} disabled={loading || !selectedFile}>
              {loading ? 'Predicting...' : 'Upload & Predict'}
            </button>

            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={!selectedFile && !preview}
            >
              Remove Image
            </button>
          </div>

          {/* Progress bar while loading */}
          {loading && (
            <div className="progress-wrapper">
              <div className="progress-label">
                <span>Prediction Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Show completed progress */}
          {!loading && progress === 100 && (
            <div className="progress-wrapper">
              <div className="progress-label">
                <span>Prediction Complete</span>
                <span>100%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '100%' }} />
              </div>
            </div>
          )}

          {/* Show prediction results */}
          {prediction && (
            <div className="result-box">
              <h2>Prediction:</h2>

              <p className="main-prediction">
                {prediction}
                {confidence !== null ? ` (${confidence}%)` : ''}
              </p>

              {/* Show all probabilities */}
              {Object.keys(allProbabilities).length > 0 && (
                <div className="probabilities-box">
                  <h3>All Class Probabilities</h3>

                  {Object.entries(allProbabilities).map(([label, value]) => (
                    <div key={label} className="probability-row">
                      <span className="probability-name">{label}</span>
                      <span className="probability-value">{value}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Show Grad-CAM image */}
              {gradcamImage && (
                <div className="gradcam-box">
                  <h3>Grad-CAM Heatmap</h3>

                  <img
                    src={`data:image/png;base64,${gradcamImage}`}
                    alt="Grad-CAM Heatmap"
                    className="gradcam-image"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

// Export component
export default Main_page;