import { useState } from "react";
import DefaultImage from "../../assets/image.png";
import {Link} from 'react-router-dom'

const ProfileDropDown = ({ darkMode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <>
      <div className="flex items-center border-0">
        <div className="relative ">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex text-sm rounded-full focus:ring-4 ${darkMode ? 'bg-gray-800 focus:ring-gray-600' : 'bg-gray-800 focus:ring-gray-300'}`}
          >
            <span className="sr-only cursor-pointer">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full cursor-pointer"
              src={DefaultImage}
              alt="user"
            />
          </button>

          {dropdownOpen && (
            <div className={`absolute right-0 z-50 my-4 text-base divide-y rounded-sm shadow-sm ${darkMode ? 'bg-gray-700 divide-gray-600' : 'bg-white divide-gray-100'}`}>
              <div className={`px-4 py-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  anish
                </p>
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  anish@example.com
                </p>
              </div>
              <ul className="py-1">
                <li>
                  <Link
                    to="/logout"
                    className={`block px-4 py-2 text-sm rounded ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileDropDown;
