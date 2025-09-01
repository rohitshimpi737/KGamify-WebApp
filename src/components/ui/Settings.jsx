// src/components/ui/Settings.jsx
import { useTheme } from '../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link 
            to="/app" 
            className={`p-2 rounded-full ${
              darkMode ? "bg-zinc-800 text-white" : "bg-zinc-500"
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </Link>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            Settings
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {/* Dark Theme Toggle - simplified */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>Dark Theme</h2>
             
            </div>
            <button
              onClick={toggleTheme}
              className={`relative rounded-full w-12 h-6  border-1  transition-colors duration-200 ${
                darkMode ? 'bg-orange-500' : 'bg-zinc-400'
              }`}
            >
              <span
                className={`absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform duration-200 ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            
        </div>

        {/* License Section - simplified */}
          {/* <div className="relative">
            <h2 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Licenses</h2>
          </div> */}
        </div>
    </div>
  );
};

export default Settings;