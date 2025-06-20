import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const RulesCard = ({ onClose, id }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [activeTab,setActiveTab] = useState('rules');
  const [showTerms, setShowTerms] = useState(true); // dropdown toggle
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Prevent background scrolling and lock interactions
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleStartQuiz = () => {
  onClose();
  navigate(`quiz/${id}`); // Use challenge ID in URL
};

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 overflow-y-auto py-8"
      onClick={handleBackdropClick} // Close when clicking on backdrop
    >
      <div 
        className="relative min-h-full flex items-center justify-center p-4"
      >
        <div 
          className={`mx-auto mt-5 rounded-xl shadow-lg overflow-hidden p-4 sm:p-6 w-full max-w-md md:max-w-screen-md lg:max-w-[700px] ${
            darkMode 
              ? 'bg-black text-white border-1 border-orange-400' 
              : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
        >
          {/* Header with Title and Close Button */}
          <div className="flex justify-between items-center mb-4 md:mb-6">
           <div className={"flex border-b-1 border-gray-300 space-x-25 "}> 
            <button
                className={`pb-2 px-1 ml-8 font-medium text-base md:text-lg ${
                  activeTab === 'rules'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('rules')}
              >
                Rules
              </button>
              <button
                className={`pb-2 px-1 mr-10 font-medium text-base md:text-lg ${
                  activeTab === 'reward'
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab('reward')}
              >
                Reward
              </button>
            </div>
            <div><button
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
          </div>

          
          {/* Rules Content with fixed height and scrolling */}
          {activeTab ==='rules' || activeTab ===''  ? (<div className="mb-6 md:mb-8 space-y-3 md:space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
            <p className="text-base md:text-lg">
              Please read the following rules carefully before starting the challenge:
            </p>
            
            <ul className="list-disc pl-4 md:pl-6 space-y-2 md:space-y-3">
              <li className="text-sm md:text-base">Each question must be answered within the specified time limit</li>
              <li className="text-sm md:text-base">You cannot return to previous questions once answered</li>
              <li className="text-sm md:text-base">Points are awarded based on both accuracy and speed</li>
              <li className="text-sm md:text-base">Any form of cheating will result in immediate disqualification</li>
              <li className="text-sm md:text-base">All answers must be submitted before the timer expires</li>
              <li className="text-sm md:text-base">The challenge consists of 15 multiple-choice questions</li>
              <li className="text-sm md:text-base">Each correct answer earns you 10 points</li>
              <li className="text-sm md:text-base">Points are reduced by 2 for every second taken</li>
              
            </ul>
          </div>):(
              <>
                <p className="text-base md:text-lg">
                  Here are the rewards for participating and ranking in this challenge:
                </p>
                <ul className="list-disc pl-4 md:pl-6 space-y-2 md:space-y-3">
                  <li className="text-sm md:text-base">Top 1: ₹1000 Amazon Voucher</li>
                  <li className="text-sm md:text-base">Top 3: Free access to premium mock tests</li>
                  <li className="text-sm md:text-base">Top 10: Digital Certificate of Achievement</li>
                  <li className="text-sm md:text-base">Top 50: Leaderboard shoutout</li>
                  <li className="text-sm md:text-base">Participation: 10 bonus points towards your profile</li>
                </ul>
              </>

          )

          }

          {/* Terms and Conditions Section */}
          <div className="mb-4">
            <div
              onClick={() => setShowTerms(!showTerms)}
              className="flex justify-between items-center cursor-pointer text-base font-medium mb-2"
            >
              <span>Terms and conditions</span>
              <span>{showTerms ? "▼" : "▲"}</span>
            </div>

            {showTerms && (
              <label className="flex items-start gap-3 text-sm md:text-base mt-2">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                  className="mt-1 w-4 h-4 accent-orange-500"
                />
                <span>I’ve read and understood the rules.</span>
              </label>
            )}
          </div>

          

          {/* Play Button */}
          <div className="flex justify-center">
            <button
              onClick={acceptedTerms ? handleStartQuiz : undefined}
              className={`w-full cursor-pointer max-w-xs text-white py-2 md:py-3 px-6 md:px-8 rounded-lg md:rounded-xl font-medium md:font-semibold text-base md:text-lg transition-colors flex items-center justify-center gap-2
              ${
                acceptedTerms
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}>
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

export default RulesCard;


