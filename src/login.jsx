// Import necessary modules
import React, { useState, useEffect } from "react"; // React hooks for state management and side effects
import { FcGoogle } from "react-icons/fc"; // Google icon for the Google login button
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"; // Firebase functions for email/password and Google login
import { auth, googleProvider } from "./firebase-config"; // Firebase configuration and Google provider
import { useNavigate } from "react-router-dom"; // React Router hook for navigation
import { Eye, EyeOff, Loader } from "lucide-react"; // Icons for password visibility toggle and loading spinner
import background from "./assets/bg.jpeg"; // Background image for the Login page

// Login component declaration
const Login = ({ setShowSignUp }) => {
  // State to manage form inputs for email and password
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State to toggle the visibility of the password input field
  const [showPassword, setShowPassword] = useState(false);

  // State to track the loading status during login attempts
  const [isLoading, setIsLoading] = useState(false);

  // State to display error messages (e.g., Firebase errors)
  const [error, setError] = useState("");

  // State to track validation errors for email and password fields
  const [validationErrors, setValidationErrors] = useState({});

  // React Router hook to navigate between pages
  const navigate = useNavigate();

  // Clear the error message whenever the form data changes
  useEffect(() => {
    if (error) setError(""); // Reset error message when the user starts typing again
  }, [formData]);

  // Function to validate the form inputs
  const validateForm = () => {
    const errors = {}; // Object to collect validation errors
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pattern for validating email format

    // Validate email field
    if (!formData.email) {
      errors.email = "Email is required"; // Error if email is empty
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email"; // Error if email is invalid
    }

    // Validate password field
    if (!formData.password) {
      errors.password = "Password is required"; // Error if password is empty
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"; // Error if password is too short
    }

    setValidationErrors(errors); // Update state with validation errors
    return Object.keys(errors).length === 0; // Return true if no validation errors
  };

  // Function to handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract input field name and value
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update the corresponding field in the formData state
    }));

    // Clear the validation error for the field being updated
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Function to handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!validateForm()) return; // Validate the form; stop if there are errors

    setIsLoading(true); // Start the loading spinner
    try {
      // Firebase function to sign in with email and password
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/home"); // Redirect to the home page on successful login
    } catch (err) {
      const errorMessage = getFirebaseErrorMessage(err.code); // Map Firebase error code to a user-friendly message
      setError(errorMessage); // Display the error message
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  // Function to handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true); // Start the loading spinner
    try {
      // Firebase function to sign in with Google
      await signInWithPopup(auth, googleProvider);
      navigate("/home"); // Redirect to the home page on successful login
    } catch (err) {
      const errorMessage = getFirebaseErrorMessage(err.code); // Map Firebase error code to a user-friendly message
      setError(errorMessage); // Display the error message
    } finally {
      setIsLoading(false); // Stop the loading spinner
    }
  };

  // Function to map Firebase error codes to user-friendly messages
  const getFirebaseErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email"; // Error if no account exists
      case "auth/wrong-password":
        return "Incorrect password"; // Error if the password is incorrect
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later"; // Error for too many login attempts
      default:
        return "An error occurred. Please try again"; // Generic error message
    }
  };

  // Return the JSX structure for the Login page
  return (
    <div
      // Outer container with a full-screen background image and centered content
      className="flex items-center justify-center h-screen text-center p-5"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background})`, // Overlay to darken the background image
        backgroundSize: "cover", // Ensure the image covers the entire container
      }}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl">
        {/* Header */}
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email input field */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  validationErrors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                aria-invalid={validationErrors.email ? "true" : "false"}
                aria-describedby={
                  validationErrors.email ? "email-error" : undefined
                }
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600" id="email-error">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password input field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle password visibility
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  validationErrors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                aria-invalid={validationErrors.password ? "true" : "false"}
                aria-describedby={
                  validationErrors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600" id="password-error">
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          )}

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isLoading} // Disable button while loading
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google login button */}
        <button
          onClick={handleGoogleLogin} // Handle Google login
          disabled={isLoading} // Disable button while loading
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <FcGoogle className="h-5 w-5 mr-2" />
          Sign in with Google
        </button>

        {/* Link to Sign Up */}
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => setShowSignUp(true)} // Trigger function to show Sign Up page
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

// Exporting the Login component for use in other parts of the app
export default Login;
