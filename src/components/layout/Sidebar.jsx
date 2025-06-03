import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

const Sidebar = ({ sidebarOpen, darkMode, closeSidebar }) => {
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
      className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform rounded-r-2xl rounded-tr-2xl ${
        darkMode ? "bg-black" : "bg-white"
      } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{
        boxShadow: sidebarOpen ? "0 0 0 100vmax rgba(0,0,0,0.5)" : "none",
      }}
    >
      {/* Profile Section */}
      <div className="bg-[#f58220] p-4  rounded-tr-2xl">
        <div className="flex flex-col items-start">
          <div className="bg-white p-2  rounded-full mb-1">
            <svg 
              className="w-7 h-7 text-orange-400" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <div className="text-left text-black">
            <p className="font-bold text-lg">John Doe</p>
            <p className="text-sm mt-1">john.doe@example.com</p>
          </div>
        </div>
      </div>
      
      <div
        className={`h-full px-3 pb-4 overflow-y-auto rounded-br-lg ${
          darkMode ? "bg-black" : "bg-white"
        }`}
      >
        <ul className="space-y-2 font-medium pt-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={closeSidebar}
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

          
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;