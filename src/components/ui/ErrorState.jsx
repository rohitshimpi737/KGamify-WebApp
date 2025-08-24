// Shared Error Component
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const ErrorState = ({ 
  error, 
  title = "Something went wrong", 
  backLink = "/app",
  backText = "Go Back",
  showBackButton = true,
  className = ""
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
    } ${className}`}>
      <div className="text-center p-8">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-red-500 mb-6">{error}</p>
        {showBackButton && (
          <Link
            to={backLink}
            className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {backText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
