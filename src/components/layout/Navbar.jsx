import KGamifyLogo from "../../assets/KGamify.svg";
import ProfileDropDown from "../ui/ProfileDropDown";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = ({
  sidebarOpen,
  setSidebarOpen,
  darkMode,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  selectedSort,
  setSelectedSort,
}) => {
  const [sortOpen, setSortOpen] = useState(false);

  // Normalize filter names
  const FILTER_TYPES = {
    QUICK_HIT: "Quick hit",
    PLAY_WIN: "Play and Win",
  };

  const sortOptions = [
    { value: "DATE", label: "Date" },
    { value: "A-Z", label: "A-Z" },
    { value: "STATUS", label: "Status" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b ${
        darkMode ? "bg-black border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`inline-flex items-center p-2 text-sm rounded-lg sm:hidden focus:outline-none focus:ring-2 ${
                darkMode
                  ? "text-gray-400 hover:bg-orange-500 focus:ring-gray-600"
                  : "text-gray-500 hover:bg-gray-100 focus:ring-gray-200"
              }`}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Search Bar */}
          <div className="hidden sm:flex flex-grow justify-center mx-4">
            <div className="w-full max-w-md relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className={`w-5 h-5 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500"
                }`}
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Buttons Group */}
          <div className="hidden md:flex items-center gap-2 mx-4">
            <button
              onClick={() => setSelectedFilter("Quick hit")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                darkMode
                  ? selectedFilter === "Quick hit"
                    ? "bg-orange-400 text-white"
                    : "text-white hover:bg-orange-400"
                  : selectedFilter === "Quick hit"
                  ? "bg-orange-400 text-white"
                  : "text-gray-600 hover:bg-orange-400 hover:text-white"
              }`}
            >
              Quick Hit
            </button>
            <button
              onClick={() => setSelectedFilter("Play and Win")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                darkMode
                  ? selectedFilter === "Play and Win"
                    ? "bg-orange-400 text-white"
                    : "text-white hover:bg-orange-400"
                  : selectedFilter === "Play and Win"
                  ? "bg-orange-400 text-white"
                  : "text-gray-600 hover:bg-orange-400 hover:text-white"
              }`}
            >
              Play and Win
            </button>
            <button
              onClick={() => setSelectedFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                darkMode
                  ? !selectedFilter
                    ? "bg-orange-400 text-white"
                    : "text-white hover:bg-orange-400"
                  : !selectedFilter
                  ? "bg-orange-400 text-white"
                  : "text-gray-600 hover:bg-orange-400 hover:text-white"
              }`}
            >
              Show all
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className={`p-1.5 rounded-lg hover:bg-opacity-20 hover:text-white  hover:bg-orange-400 ${
                  darkMode
                    ? "text-white "
                    : "text-gray-600 "
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {sortOpen && (
                <div
                  className={`absolute right-0 mt-2 w-32 rounded-lg shadow-lg py-1 ${
                    darkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedSort(option.value);
                        setSortOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left ${
                        darkMode
                          ? "text-white hover:bg-orange-400 hover:text-black"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${
                        selectedSort === option.value
                          ? "bg-orange-400 bg-opacity-50"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile DropDown */}
          <ProfileDropDown darkMode={darkMode} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
