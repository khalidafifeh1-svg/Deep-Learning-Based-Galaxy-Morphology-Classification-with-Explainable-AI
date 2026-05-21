// Import Navigate component from react-router-dom
import { Navigate } from "react-router-dom";

// It takes two props: loggedIn (true/false) and children (the page content)
function ProtectedRoute({ loggedIn, children }) {

  // If user is NOT logged in
  if (!loggedIn) {

    // Redirect user to home page ("/")
   
    return <Navigate to="/" replace />;
  }

  
  // Show the protected content 
  return children;
}

// Export this component so it can be used in other files
export default ProtectedRoute;