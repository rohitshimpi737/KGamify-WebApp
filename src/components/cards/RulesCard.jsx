import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUserPlayStatus } from "../../hooks/useUserPlayStatus";

const RulesCard = ({ onClose, challenge }) => {
  // ===========================
  // Challenge Data
  // ===========================
  const { id, status, subtitle, detailedData } = challenge || {};
  const {
    no_of_question,
    question_count,
    time_minutes,
    user_qualification,
    gift_description,
    gift_image,
  } = detailedData || {};

  const challengeId = challenge?.id || id;
  const challengeStatus = status || "upcoming";

  // Status helpers
  const isCompleted = challengeStatus === "completed";
  const isOngoing = challengeStatus === "ongoing";
  const isUpcoming = challengeStatus === "upcoming";

  // ===========================
  // Contexts & Hooks
  // ===========================
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("rules");
  const [showTerms, setShowTerms] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Centralized User Play Status
  const { userPlayStatus, checkingPlayStatus, playStatusError, getUserId } =
    useUserPlayStatus(challengeId);

  // ===========================
  // Effects
  // ===========================
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // ===========================
  // Handlers
  // ===========================
  const handleStartQuiz = () => {
    onClose();

    if (userPlayStatus) {
      const currentUserId = getUserId();
      navigate(`/app/analytics/${challengeId}`, {
        state: {
          message: isCompleted
            ? "Championship has ended. View your results below."
            : "You have already completed this championship. View your results below.",
          championshipData: detailedData,
          userId: currentUserId,
          fromRulesCard: true,
        },
      });
      return;
    }

    if (isCompleted) return; // Block if ended
    if (challengeId) navigate(`/app/quiz/${challengeId}`);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ===========================
  // Button Config
  // ===========================
 const getButtonConfig = () => {

  console.group('Button Config Status');
    console.log({
      checkingPlayStatus,
      userPlayStatus,
      challengeStatus,
      acceptedTerms
    });
    
  // First check if we're still loading status
  if (checkingPlayStatus) {
    return {
      text: "Checking Status...",
      subText: "Please wait while we verify your participation status",
      bgColor: "bg-gray-500",
      hoverColor: "",
      disabled: true,
      icon: "loading"
    };
  }

  // If user has played, always show View Analytics regardless of challenge status
  if (userPlayStatus) {
    return {
      text: "View Analytics",
      subText: challengeStatus === "ended" 
        ? "Check your final results" 
        : "Check your current progress",
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      disabled: false,
      icon: "analytics"
    };
  }

  // Handle other cases based on challenge status
  switch (challengeStatus) {
    case "ongoing":
      return {
        text: "Start Challenge",
        subText: "Championship is in progress",
        bgColor: "bg-orange-500",
        hoverColor: "hover:bg-orange-600",
        disabled: !acceptedTerms,
        icon: "play"
      };

    case "ended":
      return {
        text: "Championship Ended",
        subText: "This championship has concluded",
        bgColor: "bg-gray-500",
        hoverColor: "",
        disabled: true,
        icon: "ended"
      };

    case "upcoming":
      return {
        text: "Start Challenge",
        subText: "Championship starts soon",
        bgColor: "bg-yellow-500",
        hoverColor: "hover:bg-yellow-600",
        disabled: true,
        icon: "calendar"
      };

    default:
      return {
        text: "Status Unknown",
        subText: "Unable to determine championship status",
        bgColor: "bg-gray-500",
        hoverColor: "",
        disabled: true,
        icon: "error"
      };
  }
};

  const buttonConfig = getButtonConfig();

  // ===========================
  // Render
  // ===========================
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 overflow-y-auto py-8"
      onClick={handleBackdropClick}
    >
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div
          className={`mx-auto mt-5 rounded-xl shadow-lg overflow-hidden p-4 sm:p-6 w-full max-w-md md:max-w-screen-md lg:max-w-[700px] ${
            darkMode
              ? "bg-black text-white border-1 border-orange-400"
              : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex border-b-1 border-gray-300 space-x-25">
              <button
                className={`pb-2 px-1 ml-8 font-medium text-base md:text-lg ${
                  activeTab === "rules"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("rules")}
              >
                Rules
              </button>
              <button
                className={`pb-2 px-1 mr-10 font-medium text-base md:text-lg ${
                  activeTab === "reward"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
                onClick={() => setActiveTab("reward")}
              >
                Reward
              </button>
            </div>
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

          {/* Tabs */}
          {activeTab === "rules" ? (
            // Rules
            <div className="mb-6 md:mb-8 space-y-3 md:space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  Championship Format
                </h3>
                <div className="text-sm md:text-base space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">•</span>
                    <span>
                      You'll face {no_of_question || "10"} multiple choice
                      questions.
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">•</span>
                    <span>Time limit: {time_minutes || "15"} minutes.</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">•</span>
                    <span>Answer fast for a competitive edge.</span>
                  </div>
                  {user_qualification && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">•</span>
                      <span>Eligibility: {user_qualification}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scoring */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Scoring Rules</h3>
                <div className="text-sm md:text-base space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">•</span>
                    <span>Correct answer = gain points.</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">•</span>
                    <span>Answer quickly to earn bonus points.</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">•</span>
                    <span>Exceed the time limit? You'll lose points.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Reward
            <div className="mb-6 md:mb-8 space-y-3 md:space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-900">
              {gift_description ? (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Join the {subtitle || "Challenge"}!
                  </h3>

                  {gift_image && (
                    <div className="mb-4 flex justify-center">
                      <img
                        src={gift_image}
                        alt="Reward"
                        className="max-w-full h-32 object-contain rounded-lg"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  )}

                  <div
                    className="text-sm md:text-base space-y-2 prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: gift_description }}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">Description</p>
                </div>
              )}
            </div>
          )}

          {/* Terms */}
          {isOngoing && !userPlayStatus && (
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
                  <span>I've read and understood the rules.</span>
                </label>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {buttonConfig.subText}
              </p>
            </div>

            <button
              onClick={!buttonConfig.disabled ? handleStartQuiz : undefined}
              className={`w-full max-w-xs text-white py-2 md:py-3 px-6 md:px-8 rounded-lg md:rounded-xl 
      font-medium md:font-semibold text-base md:text-lg transition-colors 
      flex items-center justify-center gap-2 
      ${
        buttonConfig.disabled
          ? "bg-gray-400 cursor-not-allowed"
          : `${buttonConfig.bgColor} ${buttonConfig.hoverColor} cursor-pointer`
      }`}
            >
              {buttonConfig.text}
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {buttonConfig.icon === "analytics" ? (
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                ) : buttonConfig.icon === "ended" ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 12l14-7v14l-14-7z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </button>

            {isUpcoming && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 max-w-xs">
                Championship starts on {challenge?.timings?.starts || "TBD"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesCard;
