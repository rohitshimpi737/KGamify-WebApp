// Shared Loading Component
import { useTheme } from "../../contexts/ThemeContext";

const LoadingState = ({ 
  message = "Loading...", 
  size = "medium", 
  className = "" 
}) => {
  const { darkMode } = useTheme();

  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12", 
    large: "h-16 w-16"
  };

  const containerClasses = {
    small: "p-4",
    medium: "p-8",
    large: "p-12"
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
    } ${className}`}>
      <div className={`text-center ${containerClasses[size]}`}>
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-orange-500 mx-auto mb-4`}></div>
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
