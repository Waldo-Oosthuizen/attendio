import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth } from "./firebase-config";
import Navbar from "./Navbar";

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Persist the auth state in localStorage as a backup
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      }
      setIsLoading(false);
    });

    // Check localStorage while waiting for Firebase
    const persistedAuth = localStorage.getItem("isAuthenticated");
    if (persistedAuth === "true") {
      setIsAuthenticated(true);
    }

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Only show loading if we don't have a persisted auth state
    if (localStorage.getItem("isAuthenticated") === "true") {
      return (
        <div>
          <Navbar />
          <main>{children}</main>
        </div>
      );
    }
    return (
      <div>
        <Navbar />
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default PrivateRoute;
