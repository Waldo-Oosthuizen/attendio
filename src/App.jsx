import React, { useState } from "react"; // Importing React for creating the component
import {
  HashRouter as Router,
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
import Attendance from "./Attendance";
import Schedule from "./Schedule";
import PrivateRoute from "./PrivateRoute"; // Importing a custom `PrivateRoute` component to restrict access to protected routes

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import { useEffect } from "react";

import Landing from "./Landing";

const App = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return null; // or a loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Landing />}
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : showSignUp ? (
              <SignUp setShowSignUp={setShowSignUp} />
            ) : (
              <Login setShowSignUp={setShowSignUp} />
            )
          }
        />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/students"
          element={
            <PrivateRoute>
              <Students />
            </PrivateRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }></Route>

        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <Schedule />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
