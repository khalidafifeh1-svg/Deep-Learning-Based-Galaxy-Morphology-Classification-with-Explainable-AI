// Import useState hook to store data like email, password, etc
import { useState } from "react";

// Import navigation hook to move between pages
import { useNavigate } from "react-router-dom";

// Import Firebase authentication instance
import { auth } from "../firebase"; // make sure the path is correct

// Import Firebase functions for signup and login
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Import CSS styles
import './Main_page.css';

// Create component for Login and Signup
function SigninandLogin({ setLoggedIn }) {

  // State to toggle between login and signup
  const [isSignup, setIsSignup] = useState(false);

  // Store email input
  const [email, setEmail] = useState("");

  // Store password input
  const [password, setPassword] = useState("");

  // Hook to navigate to another page
  const navigate = useNavigate();

  // 🔐 LOGIN FUNCTION
  const handleLogin = async (e) => {

    // Prevent page reload when form is submitted
    e.preventDefault();

    try {
      // Firebase login with email & password
      await signInWithEmailAndPassword(auth, email, password);

      // Set user as logged in
      setLoggedIn(true);

      // Navigate to main page after login
      navigate("/Main_page");

    } catch (error) {
      // Show error if login fails
      alert(error.message);
    }
  };

  // 🆕 SIGNUP FUNCTION
  const handleSignup = async (e) => {

    // Prevent page reload
    e.preventDefault();

    try {
      // Create new user in Firebase
      await createUserWithEmailAndPassword(auth, email, password);

      // Show success message
      alert("Account created! Please login.");

      // Switch back to login mode
      setIsSignup(false);

    } catch (error) {
      // Show error if signup fails
      alert(error.message);
    }
  };

  // UI rendering
  return (
    <div className="Main_page-page">
      <header className="Main_page-header">

        {/* Show title based on mode */}
        <h1>{isSignup ? "Sign Up" : "Login"}</h1>

        {/* Form: calls signup or login function */}
        <form onSubmit={isSignup ? handleSignup : handleLogin}>

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            value={email} // bind state
            onChange={(e) => setEmail(e.target.value)} // update state
            required
          />

          <br /><br />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br /><br />

          {/* Submit button */}
          <button type="submit">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <br />

        {/* 🔄 Toggle between Login and Signup */}
        {isSignup ? (
          <p>
            Already have an account?{" "}

            {/* Switch to login */}
            <button onClick={() => setIsSignup(false)}>
              Login
            </button>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}

            {/* Switch to signup */}
            <button onClick={() => setIsSignup(true)}>
              Sign Up
            </button>
          </p>
        )}
      </header>
    </div>
  );
}

// Export component
export default SigninandLogin;