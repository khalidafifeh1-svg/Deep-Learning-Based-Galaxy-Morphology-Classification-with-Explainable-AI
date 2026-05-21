// Import useState hook to store login state 
import { useState } from "react";

// Import routing tools from react-router-dom
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import main pages/components
import Main_page from "./pages/Main_page";
import SigninandLogin from "./pages/SigninandLogin";

// Import protected route component 
import ProtectedRoute from "./components/ProtectedRoute"; // your file

// Main App component
function App() {

  // State to track whether user is logged in or not
  const [loggedIn, setLoggedIn] = useState(false);

  // Return UI 
  return (

    // BrowserRouter enables routing in the app
    <BrowserRouter>

      {/* Define all routes */}
      <Routes>

        {/* Route for login page */}
        <Route
          path="/"
          element={<SigninandLogin setLoggedIn={setLoggedIn} />} 
          // Pass setLoggedIn so login page can update login state
        />

        {/* Route for main page */}
        <Route
          path="/Main_page"
          element={
            // Protect this route
            // Only allow access if loggedIn is true
            <ProtectedRoute loggedIn={loggedIn}>
              <Main_page />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

// Export App so it can be used in index.js
export default App;