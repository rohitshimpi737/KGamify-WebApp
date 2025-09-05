import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ProfileImage from '../../components/layout/ProfileImage';


const Sidebar = ({ sidebarOpen, darkMode, closeSidebar }) => {
  const { user ,  profileImage, setProfileImage } = useAuth();
  const menuItems = [
    {
      name: "Profile",
      icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
      path: "/app/profile",
    },
    {
      name: "Analytics",
      icon: "M5 9.2h3V19H5zM10.6 5h3v14h-3zm5.6 8h3v6h-3z",
      path: "/app/analytics",
    },
    {
      name: "Settings",
      icon: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
      path: "/app/settings",
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform rounded-r-2xl rounded-tr-2xl ${darkMode ? "bg-black" : "bg-white"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{
        boxShadow: sidebarOpen ? "0 0 0 100vmax rgba(0,0,0,0.5)" : "none",
      }}
    >
      {/* Profile Section */}
      <div className="bg-[#f58220] p-4 rounded-tr-2xl">
        <div className="flex flex-col items-start">
          <ProfileImage
            size="md"
            darkMode={darkMode}
            imageSrc={user?.profile_image || profileImage}
          />
          <div className="text-left">
            <p className="font-bold text-lg text-white">
              {user?.user_name || user?.name || "User"}
            </p>
            <p className="text-sm mt-1 text-white">
              {user?.email || "No email"}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`h-full px-3 pb-4 overflow-y-auto rounded-br-lg ${darkMode ? "bg-black" : "bg-white"
          }`}
      >
        <ul className="mt-6">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={closeSidebar} // Add this line
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 cursor-pointer transition-colors ${isActive
                    ? 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : `${darkMode
                      ? 'text-white hover:bg-gray-800'
                      : 'text-black hover:bg-gray-50'
                    }`
                  }`
                }
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={item.icon} />
                </svg>
                <span className="ml-4 font-normal">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;