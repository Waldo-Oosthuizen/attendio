import React, { useState } from "react"; // Importing React for creating the component
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Importing React Router components:
// - `Router` is the main wrapper for enabling routing in the app.
// - `Routes` groups all route definitions.
// - `Route` defines individual routes.

import SignUp from "./signUp"; // Importing the `SignUp` component for the signup page
import Login from "./login"; // Importing the `Login` component for the login page
import Home from "./Home"; // Importing the `Home` component for the home page
import Students from "./Students";
import PrivateRoute from "./PrivateRoute"; // Importing a custom `PrivateRoute` component to restrict access to protected routes

const App = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <Router basename="/presentio">
      {/* Wrapping the entire app with the `Router` to enable routing functionality */}
      <Routes>
        {/* Define a default route */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            showSignUp ? (
              <SignUp setShowSignUp={setShowSignUp} />
            ) : (
              <Login setShowSignUp={setShowSignUp} />
            )
          }
        />

        {/* Signup route: Renders the `SignUp` component when the user visits "/signup" */}

        {/* Protected Routes */}
        <Route
          path="/home"
          // Defines the route for the home page. This route is protected.
          element={
            <PrivateRoute>
              {/* `PrivateRoute` ensures this route is only accessible to authenticated users */}
              <Home />
              {/* Renders the `Home` component (main content of the home page) */}
            </PrivateRoute>
          }
        />
        {/* Students route only accessible from Home or Navbar */}
        <Route
          path="/students"
          element={
            <PrivateRoute>
              <Students />
            </PrivateRoute>
          }
        />
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
// Exporting the `App` component to make it available for use in other parts of the application
