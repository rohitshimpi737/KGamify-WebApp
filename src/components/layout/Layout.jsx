import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Navbar from "../layout/Navbar";
import Sidebar from "./Sidebar";

// src/components/layout/Layout.jsx
const Layout = ({ children, 
  searchQuery, 
  setSearchQuery, 
  selectedFilter, 
  setSelectedFilter,
  selectedSort,
  setSelectedSort  }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <Navbar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        darkMode={darkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}/>
      <Sidebar sidebarOpen={sidebarOpen} darkMode={darkMode} />
      <div className={`p-4 sm:ml-64 mt-14 transition-all duration-300`}>
        <div className={`p-4 border-2 border-gray-200 border-dashed rounded-lg ${darkMode ? 'bg-black border-gray-700' : 'bg-white'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;