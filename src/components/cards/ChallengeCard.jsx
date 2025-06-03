import { useState } from "react";
import TeacherDetail from "./TeacherDetail";
import { useTheme } from "../../contexts/ThemeContext";
import RulesCard from "./RulesCard";

const ChallengeCard = ({ challenge }) => {
  const { darkMode } = useTheme();
  const [showTeacherDetail, setShowTeacherDetail] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);


  const handleTeacherClick = (e) => {
  e.stopPropagation();
  if (challenge.status !== 'completed') {
    setShowTeacherDetail(true); // Force open teacher detail
    setShowRules(false); // Force close rules
  }
};

const handleCardClick = () => {
  if (challenge.status !== 'completed') {
    setShowRules(!showRules); // Toggle rules
    setShowTeacherDetail(false); // Force close teacher detail
  } else {
    alert('It has been ended');
  }
};

  return (
    <div
      onClick={ !showTeacherDetail && handleCardClick}
      className={`mx-auto max-w-md rounded-xl border-1 border-orange-400 shadow-lg overflow-hidden p-4 sm:p-6 relative ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Top Row: Title and ID */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-red-400 font-medium text-base">
          {challenge.title}
        </span>
        <p className="text-sm text-gray-400">ID: {challenge.id}</p>
      </div>

      {/* Second Row: Subtitle and Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">{challenge.subtitle}</h2>
          <span className="text-sm text-gray-500">{challenge.category}</span>
        </div>
        <span
          className={`px-3 py-1 ${
            challenge.status === "ongoing"
              ? "bg-green-500"
              : challenge.status === "upcoming"
              ? "bg-yellow-500"
              : "bg-red-500"
          } text-white rounded-full text-sm`}
        >
          {challenge.status}
        </span>
      </div>

      {/* Third Row: Questions and Participants */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center text-sm">
          <span>{challenge.details.questions} | {challenge.details.duration}</span>
        </div>
        <div className="flex items-center text-sm">
          <svg
            className="w-4 h-4 ml-1 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span className="text-gray-500 ml-1">
            {challenge.details.participants.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Border Bottom */}
      <hr className="my-4 border-t border-gray-200" />

      {/* Bottom Section: Eligibility, Dates, and Teacher */}
      <div className="flex justify-between items-start">
        {/* Left Column: Eligibility and Dates */}
        <div className="flex-1">
          {/* Eligibility with Degree Cap Icon */}
          <div className="flex items-start mb-3">
            <svg 
              className="w-5 h-5 mr-2 mt-0.5 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            <div className="flex flex-wrap gap-2">
              {challenge.eligibility.map((item, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs ${
                    darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Dates with Calendar Icon */}
          <div className="flex items-center">
            <svg 
              className="w-5 h-5 mr-2 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-sm">
              <div>
                <span className="font-medium text-gray-500 mr-1">Starts:</span>
                <span>{challenge.timings.starts}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500 mr-1">Ends:</span>
                <span>{challenge.timings.ends}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Teacher Profile */}
        <button
  className="w-12 h-12 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
  aria-label="Teacher profile"
  onClick={handleTeacherClick}
>
          <svg
            className="w-8 h-8 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

     {/* Popups */}
      {showTeacherDetail &&  !showRules && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-20"
            onClick={() => setShowTeacherDetail(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-72 bg-white rounded-xl shadow-xl p-5">
            <TeacherDetail
              teacher={challenge.teacher}
              onClose={() => setShowTeacherDetail(false)}
            />
          </div>
        </>
      )}

      {showRules && !showTeacherDetail && (
        <RulesCard
          onStart={() => {
            setShowRules(false);
            setShowQuiz(true);
          }}
          id={challenge.id}
          onClose={() => setShowRules(false)}
        />
      )}

      {showQuiz && (
        <QuizComponent
          challenge={challenge}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
};

export default ChallengeCard;