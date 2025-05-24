import { useState } from "react";
const ProfileDropDown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <>
      <div className="flex items-center">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-50 my-4 text-base bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <p className="text-sm text-gray-900 dark:text-white">
                  anish
                </p>
                <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                  anish@example.com
                </p>
              </div>
              <ul className="py-1">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Sign out
                  </a>
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
