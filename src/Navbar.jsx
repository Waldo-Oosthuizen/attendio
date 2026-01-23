import React, { useState, useEffect } from 'react'; // Import React, state, and effect hooks
import { FaHome } from 'react-icons/fa'; // Import Home icon from react-icons
import { IoPeople } from 'react-icons/io5'; // Import People icon from react-icons
import { useLocation, useNavigate } from 'react-router-dom'; // Import hooks for routing
import { HiOutlineClipboardList } from 'react-icons/hi';
import { AiOutlineCalendar } from 'react-icons/ai';

const Navbar = () => {
  // State to manage whether the navigation bar is open or closed
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Hooks to access the current route and navigate programmatically
  const location = useLocation();
  const navigate = useNavigate();

  // Effect to close the navigation bar whenever the route changes
  useEffect(() => {
    setIsNavOpen(false);
  }, [location]);

  // Effect to close the navigation bar when the "Escape" key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsNavOpen(false);
      }
    };

    // Add event listener for the "Escape" key
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape); // Clean up event listener
  }, []);

  // Function to toggle the navigation bar's open/closed state
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Array of navigation items, each with a path, icon, label, and optional action
  const navItems = [
    {
      path: '#home',
      icon: <FaHome className="h-6 w-6" />,
      label: 'Home',
    },
    {
      path: '#students',
      icon: <IoPeople className="h-6 w-6" />,
      label: 'Students',
    },
    {
      path: '#studentList',
      icon: <HiOutlineClipboardList className="h-6 w-6" />,
      label: 'Attendance',
    },
    {
      path: '#schedule',
      icon: <AiOutlineCalendar className="h-6 w-6" />,
      label: 'Schedule',
    },
  ];

  return (
    <div className="relative">
      {/* Desktop Sidebar Navigation */}
      <nav
        className={`fixed top-0 left-0 h-full bg-white text-black hidden md:flex flex-col ${
          isNavOpen ? 'md:w-64' : 'md:w-16'
        } transition-all duration-300 ease-in-out z-40 shadow-lg`}
        aria-expanded={isNavOpen}
        role="navigation">
        {/* Header Section with Toggle Button */}
        <div className="relative h-16 flex items-center border-b border-white/10">
          <button
            onClick={toggleNav}
            className={`p-2 text-white bg-slate-700  focus:outline-none focus:ring-2 focus:ring-black/20 rounded-md transition-all duration-300 ${
              isNavOpen ? 'ml-52' : 'ml-3'
            }`}
            aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}>
            {/* Conditional rendering for open/close icons */}
            {isNavOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

          {/* Display title only if the nav is open */}
          {isNavOpen && (
            <h1 className="text-xl font-semibold absolute left-4">Staccato</h1>
          )}
        </div>

        {/* Navigation Links */}
        <div className={`flex flex-col space-y-2 mt-6 px-3`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path; // Determine if the current route matches the item's path
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={item.action || undefined}
                className={`flex items-center px-3 py-3 rounded-md transition-all duration-200 ${
                  isNavOpen ? '' : 'justify-center'
                } ${
                  isActive
                    ? 'bg-black/20 text-black/80'
                    : 'hover:bg-black/10 text-black/80 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}>
                <span className="flex items-center justify-center w-6">
                  {item.icon}
                </span>
                {isNavOpen && (
                  <span className="ml-4 font-medium">{item.label}</span>
                )}
              </a>
            );
          })}
        </div>

        {/* Footer Section */}
        {isNavOpen && (
          <div className="mt-auto p-4 border-t border-white/10">
            <div className="text-sm text-white/60">
              &copy; 2025 Fretnot Music School
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white text-black z-40 shadow-lg border-t-2 mt-16">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={item.action || undefined}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive
                    ? 'bg-black/20 text-black'
                    : 'text-black/80 hover:text-black active:bg-white/10'
                }`}
                aria-current={isActive ? 'page' : undefined}>
                <span className="flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-xs mt-1">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Overlay (only for desktop) */}
      {isNavOpen && (
        <div
          onClick={toggleNav}
          className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm transition-all duration-300 z-30 hidden md:block"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Navbar;
