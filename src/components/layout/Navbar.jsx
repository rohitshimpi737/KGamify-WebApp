import KGamifyLogo from "../../assets/KGamify.svg";
import ProfileDropDown from "../ui/ProfileDropDown";
import { Link } from "react-router-dom";

const Navbar = ({ sidebarOpen, setSidebarOpen, darkMode }) => {
  return (
    <nav className={`fixed top-0 z-50 w-full border-b ${darkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`inline-flex items-center p-2 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 ${darkMode ? 'text-gray-400 hover:bg-orange-500 focus:ring-gray-600' : 'text-gray-500 hover:bg-gray-100 focus:ring-gray-200'}`}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                />
              </svg>
            </button>
            <Link to="/" className="flex ms-2 md:me-24 text-orange-400">
              <img src={KGamifyLogo} className="h-8 me-3" alt="Logo" />
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-orange-400">
                Championships
              </span>
            </Link>
          </div>
          {/* Profile Dropdown */}
          <ProfileDropDown darkMode={darkMode} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;