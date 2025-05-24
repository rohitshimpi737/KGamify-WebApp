const Sidebar = ({ sidebarOpen }) => {


    const menuItems = [
    {
      name: "Profile",
      icon: "M10 0s8 7.58 8 12a8 8 0 1 1-16 0c0-4.42 8-12 8-12zM6 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    },
    { name: "Analytics", icon: "M18 4v16H2V4h16zm-4 4H6v8h8V8z" },
    {
      name: "Settings",
      icon: "M18 12c0-1.095-.305-2.14-.842-3.07l1.574-2.486-1.414-1.414-2.486 1.574A5.96 5.96 0 0 0 12 6c-1.095 0-2.14.305-3.07.842L6.444 5.268 5.03 6.682l1.574 2.486A5.96 5.96 0 0 0 6 12c0 1.095.305 2.14.842 3.07l-1.574 2.486 1.414 1.414 2.486-1.574c.93.537 1.975.842 3.07.842s2.14-.305 3.07-.842l2.486 1.574 1.414-1.414-1.574-2.486c.537-.93.842-1.975.842-3.07zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z",
    },
  ];


  return (
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-[#f58220] dark:border-gray-700 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-[#f58220]">
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d={item.icon} clipRule="evenodd" />
                  </svg>
                  <span className="ms-3">{item.name}</span>
                </a>
              </li>
            ))}

            {/* Logout at bottom */}
            <li className="absolute bottom-4 w-[calc(100%-1.5rem)]">
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
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
              </a>
            </li>
          </ul>
        </div>
      </aside>

  );
}


export default Sidebar;
