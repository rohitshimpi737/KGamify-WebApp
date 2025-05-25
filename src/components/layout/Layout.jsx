import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Navbar from "../layout/Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        darkMode={darkMode}
      />

      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div className={`p-4 sm:ml-64 mt-14 transition-all duration-300`}>
        <div className={`p-4 border-2 border-gray-200 border-dashed rounded-lg ${darkMode ? 'bg-black border-gray-700' : 'bg-white'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;