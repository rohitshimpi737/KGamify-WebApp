import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Navbar from "../layout/Navbar";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";

const Layout = ({
  children,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  selectedSort,
  setSelectedSort,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useTheme();
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const location = useLocation();

  // Close sidebar when clicking outside or on toggle button
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isToggleButton = toggleButtonRef.current?.contains(event.target);
      const isSidebar = sidebarRef.current?.contains(event.target);

      if (sidebarOpen && !isSidebar && !isToggleButton) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Close sidebar when navigating to settings
  useEffect(() => {
    if (location.pathname.includes("/app/settings")) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  // Determine if we should show navbar
  const shouldShowNavbar = !(
    location.pathname.includes("/app/profile") || 
    location.pathname.includes("/app/settings") || 
     location.pathname.includes("/app/analytics") ||
     location.pathname.includes("/app/leaderboard/")
  );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-black" : "bg-white"}`}>
      {/* Mobile-only content */}
      <div className="md:hidden">
        {/* Conditionally render Navbar - hidden on profile and settings pages */}
        {shouldShowNavbar && (
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            darkMode={darkMode}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            toggleButtonRef={toggleButtonRef}
          />
        )}

        <div ref={sidebarRef} className="z-50">
          <Sidebar
            sidebarOpen={sidebarOpen}
            darkMode={darkMode}
            closeSidebar={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className={`p-2 ${shouldShowNavbar ? "mt-14" : ""}`}>
          {children}
        </div>
      </div>

      {/* Desktop/tablet blocking message */}
      <div
        className={`hidden md:flex min-h-screen w-full items-center justify-center ${
          darkMode ? "text-orange-400" : "text-black"
        }`}
      >
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Mobile Access Required</h1>
          <p className="mb-2">
            This website is designed exclusively for mobile devices.
          </p>
          <p>Please access it using a smartphone for the best experience.</p>
        </div>
      </div>
    </div>
  );
};

export default Layout;