// src/components/ui/Settings.jsx
import { useTheme } from '../../contexts/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  return (
    <div className="max-w-4xl mx-auto p-2 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/app"
            className={`flex items-center ${darkMode ? "text-white" : "text-black"}`}
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`}>
            Settings
          </h1>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>Dark Theme</span>
          <button
            onClick={toggleTheme}
            className={`relative rounded-full w-14 h-7 transition-colors duration-200 ${darkMode ? 'bg-orange-500' : 'bg-zinc-400'
              }`}
          >
            {/* Remove the absolute positioned icons */}
            <span
              className={`absolute top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 flex items-center justify-center ${darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
            >
              {/* Place icons inside the circle */}
              {darkMode ? (
                <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-zinc-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              )}
            </span>
          </button>
        </div>


        {/* License Section */}
        <div className="flex items-center justify-between">
          <span className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>Licenses</span>
        </div>

        {/* Account Management */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
            <Link
              to="/logout"
              className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );


};

export default Settings;