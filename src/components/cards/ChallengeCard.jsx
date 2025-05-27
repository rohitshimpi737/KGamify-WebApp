/* eslint-disable no-unused-vars */
import { useState } from "react";
import TeacherDetail from "./TeacherDetail";
import { useTheme } from "../../contexts/ThemeContext";
import RulesCard from "./RulesCard";

const ChallengeCard = ({ challenge }) => {
  const { darkMode } = useTheme();
  const [showTeacherDetail, setShowTeacherDetail] = useState(false);
  const [showRules, setShowRules] = useState(false);

  return (
    <div
      onClick={() => setShowRules(!showRules)}
      className={`mx-auto max-w-md md:max-w-screen-md lg:max-w-[700px] rounded-xl border-1 border-orange-400 shadow-lg overflow-hidden p-4 sm:p-6 relative ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Category Tags */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 mb-4">
        <span className="text-red-400 text-sm sm:text-base">
          {challenge.title.split("/")[0].trim()}
        </span>
        <p className="text-sm sm:text-base text-gray-400">ID: {challenge.id}</p>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold mb-1">
            {challenge.subtitle}
          </h2>
          <span className="text-sm md:text-base text-gray-500">
            {challenge.category}
          </span>
        </div>

        <span className={`px-3 py-1 ${
          challenge.status === 'ongoing' ? 'bg-green-500' : 
          challenge.status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-500'
        } text-white rounded-full text-sm md:text-base`}>
          {challenge.status}
        </span>
      </div>

      {/* Details Section */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between gap-2">
        <div className="flex items-center text-sm md:text-base">
          <span>{challenge.details.questions}</span>
          <span className="mx-2 hidden sm:inline">|</span>
          <span>{challenge.details.duration}</span>
        </div>
        <div className="flex items-center text-sm md:text-base">
          <svg
            className="w-4 h-4 ml-1 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span className="text-gray-500">{challenge.details.participants.split(' ')[0]}</span>
        </div>
      </div>

      <hr className="my-4 border-t border-gray-200" />

      {/* Eligibility Section & Teacher Details */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-start gap-4">
        <div className="mb-4 flex-1">
          <span className="text-sm md:text-base font-medium text-gray-500">
            Eligibility:
          </span>
          <div className="mt-1 flex flex-wrap gap-2">
             {challenge.eligibility.map((item, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                {item}
            </span>

             ))}
            
          </div>
        </div>

          
        <button
          className="w-12 h-12 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
          aria-label="Teacher profile"
          onClick={() => setShowTeacherDetail(!showTeacherDetail)}
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

      {/* Teacher Detail Popup */}
      {showTeacherDetail &&  (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-20"
            onClick={() => setShowTeacherDetail(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-72 bg-white rounded-xl shadow-xl p-5">
            <TeacherDetail
              // TEACHER PASS AS PARAMETER FOR TEACHER CARD
              teacher={challenge.teacher}
              onClose={() => setShowTeacherDetail(false)}
            />
          </div>
        </>
      )}

      {/* Date Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
        <div>
          <p className="text-gray-500 font-medium">Starts:</p>
          <p className="text-gray-700">{challenge.timings.starts}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">Ends:</p>
          <p className="text-gray-700">{challenge.timings.ends}</p>
        </div>
      </div>

      {/* Show Rules */}
      {showRules && !showTeacherDetail && (
        <RulesCard onClose={() => setShowRules(false)} />
      )}
    </div>
  );
};

export default ChallengeCard;
