import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const Sidebar = ({ sidebarOpen, darkMode }) => {
  const menuItems = [
    {
      name: "Profile",
      icon: "M10 0s8 7.58 8 12a8 8 0 1 1-16 0c0-4.42 8-12 8-12zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
      path: "/app/profile",
    },
    {
      name: "Analytics",
      icon: "M18 4v16H2V4h16zm-4 4H6v8h8V8z",
      path: "/app/analytics",
    },
    {
      name: "Settings",
      icon: "M18 12c0-1.095-.305-2.14-.842-3.07l1.574-2.486-1.414-1.414-2.486 1.574A5.96 5.96 0 0 0 12 6c-1.095 0-2.14.305-3.07.842L6.444 5.268 5.03 6.682l1.574 2.486A5.96 5.96 0 0 0 6 12c0 1.095.305 2.14.842 3.07l-1.574 2.486 1.414 1.414 2.486-1.574c.93.537 1.975.842 3.07.842s2.14-.305 3.07-.842l2.486 1.574 1.414-1.414-1.574-2.486c.537-.93.842-1.975.842-3.07zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
      path: "/app/settings",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform border-r ${
        darkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
      } ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
    >
      <div
        className={`h-full px-3 pb-4 overflow-y-auto ${
          darkMode ? "bg-black" : "bg-white"
        }`}
      >
        <ul className="space-y-2 font-medium">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive
                      ? "text-white bg-orange-400"
                      : darkMode
                      ? "text-white hover:bg-orange-400/100"
                      : "text-gray-900 hover:bg-orange-200"
                  }`
                }
              >
                <svg
                  className={`w-5 h-5 transition duration-75 ${
                    darkMode
                      ? "text-white group-hover:text-black"
                      : "text-black"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                </svg>
                <span className="ms-3">{item.name}</span>
              </NavLink>
            </li>
          ))}

          {/* Logout at bottom */}
          <li className="absolute bottom-4 w-[calc(100%-1.5rem)]">
            <Link
              to="/logout" // 👈 Route to logout page
              className={`flex items-center p-2 rounded-lg group ${
                darkMode
                  ? "text-white hover:bg-orange-500"
                  : "text-gray-900 hover:bg-orange-100"
              }`}
            >
              <svg
                className={`w-5 h-5 transition duration-75 ${
                  darkMode
                    ? "text-gray-400 group-hover:text-white"
                    : "text-gray-500 group-hover:text-gray-900"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ms-3">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
