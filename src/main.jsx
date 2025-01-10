import { StrictMode } from "react";
// Importing `StrictMode` from React.
// `StrictMode` is a development tool used to highlight potential problems in the application.
// It doesn’t render anything in the UI but helps identify unsafe lifecycle methods, deprecated APIs, and other issues.

import { createRoot } from "react-dom/client";
// Importing `createRoot` from the React DOM package.
// `createRoot` is the new way to render a React application (introduced in React 18).
// It replaces the older `ReactDOM.render()` method and is required for features like concurrent rendering.

import "./index.css";
// Importing the CSS file for global styles.
// This file contains styling that applies to the entire application.

import App from "./App.jsx";
// Importing the root `App` component from the `App.jsx` file.
// The `App` component is the main entry point for the application and contains all other components.

createRoot(document.getElementById("root")).render(
  // Using `createRoot` to create a root container for the React application.
  // `document.getElementById('root')` gets the DOM element with the ID "root".
  // This element is defined in the `index.html` file (usually in the public folder).

  <StrictMode>
    {/* Wrapping the application inside `StrictMode` to enable React's strict checks. */}
    <App />
    {/* Rendering the `App` component, which represents the entire React application. */}
  </StrictMode>
);
