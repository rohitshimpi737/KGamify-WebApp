import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4"
      role="main"
      aria-labelledby="404-heading"
    >
      <div className="max-w-md text-center">
        <h1 
          id="404-heading"
          className="text-6xl font-bold text-gray-900 mb-4 animate-bounce"
        >
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          to="/app" 
          className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg 
            hover:bg-orange-600 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          aria-label="Return to homepage"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;