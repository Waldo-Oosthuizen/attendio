import React from "react"; // Import React library for creating React components
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from react-router-dom for navigation

/**
 * DashboardCard Component
 * Represents an individual card on the dashboard with a title, description, and optional click handler.
 *
 * Props:
 * - title (string): The title text displayed on the card.
 * - description (string): The description text displayed on the card.
 * - onClick (function): The function to execute when the card is clicked.
 * - bgColor (string): Tailwind CSS class for the background color of the card (default: "bg-white").
 */
const DashboardCard = ({
  title,
  description,
  onClick,
  bgColor = "bg-white", // Default background color
}) => (
  <button
    onClick={onClick} // Attach click handler to navigate or execute actions
    className={`${bgColor} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 w-full text-left hover:scale-105`}>
    <div className="flex flex-col space-y-2">
      {/* Title of the card */}
      <h3 className="text-xl font-bold">{title}</h3>
      {/* Description of the card */}
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </button>
);

/**
 * DashboardBanner Component
 * Displays a banner at the top of the dashboard with a welcome message.
 */
const DashboardBanner = () => (
  <div className="bg-zen-gradient rounded-lg shadow-lg p-8 text-white relative overflow-hidden">
    {/* Tailwind classes:
     */}
    <div className="relative z-10">
      {/* Welcome message content */}
      <h2 className="text-2xl font-bold mb-2">Welcome to the Dashboard</h2>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 transform rotate-45 -translate-y-8 translate-x-8"></div>
  </div>
);

/**
 * Home Component
 * Serves as the main dashboard page containing the banner and a grid of dashboard cards.
 */
const Home = () => {
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  // Define dashboard items (title, description, action, and styling)
  const dashboardItems = [
    {
      title: "Students", // Title of the card
      description: "Edit or view all students or add new ones", // Description of the card
      onClick: () => navigate("/students"), // Navigate to the "students" page on click
      bgColor: "bg-blue-50 hover:bg-blue-100", // Background color and hover effect
    },
    {
      title: "Attendance",
      description: "Mark and view student attendance",
      onClick: () => navigate("/attendance"), // Navigate to the "attendance" page on click
      bgColor: "bg-purple-50 hover:bg-purple-100",
    },
    {
      title: "Teaching Schedule",
      description: "View or edit your teaching schedule",
      onClick: () => navigate("/schedule"), // Navigate to the "schedule" page on click
      bgColor: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "Settings",
      description: "Manage your preferences and profile settings",
      onClick: () => navigate("/settings"), // or open modal
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
    },
  ];

  return (
    <div className="px-4 sm:px-6 pb-24 py-6 md:ml-16 max-w-7xl mx-auto space-y-6 transition-all duration-300">
      <DashboardBanner />
      {/* Grid container for dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index} // Unique key for each card
            title={item.title} // Pass title prop
            description={item.description} // Pass description prop
            onClick={item.onClick} // Pass onClick handler
            bgColor={item.bgColor} // Pass background color class
          />
        ))}
      </div>
    </div>
  );
};

export default Home; // Export the Home component as default
