// Shared Page Header Component
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const PageHeader = ({ 
  title, 
  backLink, 
  showBackButton = true,
  className = "",
  children 
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex items-center gap-4 mb-6 ${className}`}>
      {showBackButton && backLink && (
        <Link 
          to={backLink} 
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      )}
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </div>
  );
};

export default PageHeader;
