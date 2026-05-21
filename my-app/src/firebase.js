// Import function to initialize Firebase app
import { initializeApp } from "firebase/app";

// Import Google Analytics 
import { getAnalytics } from "firebase/analytics";

// Import Authentication module 
import { getAuth } from "firebase/auth";

/* Firebase configuration object
   This contains all your project details from Firebase console */
const firebaseConfig = {
  apiKey: "AIzaSyCLrrjCr0qkveyYD-fde94ArFPg1ibrEiA", // unique key for your project
  authDomain: "my-auth-app-a5d21.firebaseapp.com",     // authentication domain
  projectId: "my-auth-app-a5d21",                      // Firebase project ID
  storageBucket: "my-auth-app-a5d21.firebasestorage.app", // file storage location
  messagingSenderId: "221506349826",                   // messaging service ID
  appId: "1:221506349826:web:92eed2ef2908dcd335b01b",  // unique app ID
  measurementId: "G-K5B6D1Z50N"                        // analytics ID
};

// Initialize Firebase app using the config
const app = initializeApp(firebaseConfig);

// Enable Google Analytics for this app
const analytics = getAnalytics(app);

// Initialize Firebase Authentication system
const auth = getAuth(app);

// Export these so other files can use them
export { app, analytics, auth }; 