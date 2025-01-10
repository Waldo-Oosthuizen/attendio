// TO DO
// Create a better page loader

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase-config"; // Import the firebase authentication module
import Navbar from "./Navbar";

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up the auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        setIsAuthenticated(false); // User is not logged in
      }
      setIsLoading(false); // Stop loading once we have the auth status
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Show a loading state while checking authentication
    return (
      <div>
        <Navbar />
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the children (protected route)
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default PrivateRoute;
