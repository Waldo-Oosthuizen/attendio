import React, { useState } from 'react'; // Importing React for creating the component
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// Importing React Router components:
// - `Router` is the main wrapper for enabling routing in the app.
// - `Routes` groups all route definitions.
// - `Route` defines individual routes.

import SignUp from './signUp';
import Login from './login';
import Home from './Home';
import Students from './Students';
import StudentList from './StudentList';
import Schedule from './Schedule';
import Settings from './Settings';
import AttendanceHistory from './AttendanceHistory';
import PrivateRoute from './PrivateRoute'; // Importing a custom `PrivateRoute` component to restrict access to protected routes

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import { useEffect } from 'react';

import Landing from './Landing';

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
          path="/studentList"
          element={
            <PrivateRoute>
              <StudentList />
            </PrivateRoute>
          }></Route>

        <Route
          path="/attendance/:studentId"
          element={
            <PrivateRoute>
              <AttendanceHistory />
            </PrivateRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            <PrivateRoute>
              <Schedule />
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
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
