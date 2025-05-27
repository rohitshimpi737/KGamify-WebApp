import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
const RulesCard = ({ onClose ,id }) => {
      const { darkMode } = useTheme();
       const navigate = useNavigate();

  const handleStartQuiz = () => {
    onClose();
    navigate(`quiz/${id}`); // Include challenge ID in URL
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-md md:max-w-screen-md lg:max-w-[700px] px-4">
        <div className={`mx-auto rounded-xl shadow-lg overflow-hidden p-4 sm:p-6 ${
          onClose ? 'relative' : 'relative'
        }   ${darkMode ? 'bg-black text-white border-1 border-orange-400':'bg-white'}`}>
          {/* Header with Title and Close Button */}

          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold ">Rules </h2>
            
            <button
              onClick={onClose}
              className="p-1 md:p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close rules"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-orange-400"
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

          </div>
          
          {/* Rules Content */}
          <div className="mb-6 md:mb-8  space-y-3 md:space-y-4">
            <p className="text-base md:text-lg">
              Please read the following rules carefully before starting the challenge:
            </p>
            
            <ul className="list-disc pl-4 md:pl-6 space-y-2 md:space-y-3">
              <li className="text-sm md:text-base">Each question must be answered within the specified time limit</li>
              <li className="text-sm md:text-base">You cannot return to previous questions once answered</li>
              <li className="text-sm md:text-base">Points are awarded based on both accuracy and speed</li>
              <li className="text-sm md:text-base">Any form of cheating will result in immediate disqualification</li>
            </ul>
          </div>
                      <span className="text-red-400 justify-end"> ID: {id}</span> 

          {/* Play Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="w-full cursor-pointer max-w-xs bg-orange-500 hover:bg-orange-600 text-white py-2 md:py-3 px-6 md:px-8 rounded-lg md:rounded-xl font-medium md:font-semibold text-base md:text-lg transition-colors flex items-center justify-center gap-2"
            >
              Start Challenge
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M4 12l14-7v14l-14-7z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesCard