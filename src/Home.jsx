import React from 'react'; // Import React library for creating React components
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom for navigation
import bgImage from './assets/home-bg.png';
import {
  Users,
  Calendar,
  Settings,
  Menu,
  Bell,
  Search,
  User,
} from 'lucide-react';

const DashboardCard = ({
  title,
  description,
  onClick,
  bgColor = 'bg-white',
  icon: Icon,
}) => (
  <button
    onClick={onClick} // Attach click handler to navigate or execute actions
    className={`${bgColor} group rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 w-full text-left `}>
    <div className="flex flex-col space-y-3 px-5">
      {Icon && (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      )}
      {/* Title of the card */}
      <h3 className="text-xl font-bold">{title}</h3>
      {/* Description of the card */}
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>View Details</span>
        <svg
          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </button>
);

/**
 * DashboardBanner Component
 * Displays a banner at the top of the dashboard with a welcome message.
 */
const DashboardBanner = () => (
  <div className="relative  flex mt-4 mb-4 bg-white/70 backdrop-blur-xl border-b border-gray-200 sticky top-0 w-[92vw]">
    {/* Tailwind classes:
     */}
    <div className="p-4 flex-col">
      {/* Welcome message content */}
      <h1 className="text-2xl font-bold mb-2 ">Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1">
        Welcome back! Here's what's happening today.
      </p>
    </div>
    <div className="flex items-center gap-3 ml-auto mr-10">
      {/* Search Bar */}
      <div className="relative hidden md:block ">
        <Search className="absolute left-3 top-1/2  -translate-y-1/2 w-8 h-4 text-gray-400 " />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-3 bg-gray-100 rounded-lg border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all w-[420px] rounded-lg focus:shadow-md "
        />
      </div>
    </div>
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
      title: 'Student Profiles', // Title of the card
      description: 'Edit and add student profiles', // Description of the card
      onClick: () => navigate('/students'), // Navigate to the "students" page on click
      icon: User,
    },
    {
      title: 'Manage Students',
      description: 'Mark attendance and assign homework',
      onClick: () => navigate('/studentList'), // Navigate to the "attendance" page on click
      icon: Users,
    },
    {
      title: 'Teaching Calendar',
      description: 'View your teaching calendar',
      onClick: () => navigate('/schedule'), // Navigate to the "schedule" page on click
      icon: Calendar,
    },
    {
      title: 'Settings',
      description: 'Manage your preferences and profile settings',
      onClick: () => navigate('/settings'), // or open modal
      icon: Settings,
    },
  ];

  return (
    <div className="ml-4 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden bg-cover bg-center">
      <main className="lg:ml-20 md:ml-20 mb-32">
        <DashboardBanner />
        {/* Grid container for dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-[92vw] mb-8 ">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index} // Unique key for each card
              title={item.title} // Pass title prop
              description={item.description} // Pass description prop
              onClick={item.onClick} // Pass onClick handler
              bgColor={item.bgColor} // Pass background color class
              icon={item.icon}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home; // Export the Home component as default
