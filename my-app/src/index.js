// Import React library 
import React from 'react';

// Import ReactDOM 
import ReactDOM from 'react-dom/client';

// Import  CSS styles
import './index.css';

// Import main App component
import App from './App';

// Find the HTML element with id="root" in public/index.html
// and create a React root inside it
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render React app into the root element
root.render(

  // StrictMode is a helper tool in React
  // It checks for potential problems in  code 
  <React.StrictMode>

    {/* Render the main App component */}
    <App />

  </React.StrictMode>
);