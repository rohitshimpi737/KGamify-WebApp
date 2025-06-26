// src/components/Analytics/AnalyticsPage.jsx
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const AnalyticsChallengeCard = ({ challenge }) => {
  const { darkMode } = useTheme();
  const { id, type, title, category, status, start, end, score, reward } = challenge;

  let statusColor = "bg-green-500";
  if (status === "Upcoming") statusColor = "bg-yellow-500";
  else if (status === "Completed") statusColor = "bg-red-500";

  return (
    <div
      className={`rounded-xl border-1 border-orange-400 shadow-lg overflow-hidden p-4 mt-4 relative ${
        darkMode ? "bg-black text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Top Row: Type and ID */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-red-400 font-medium text-base">{type}</span>
        <p className="text-sm text-gray-400">ID: {id}</p>
      </div>

      {/* Second Row: Title and Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-gray-600">{category}</p>
        </div>
        <span className={`px-3 py-1 ${statusColor} text-white rounded-full text-sm`}>
          {status}
        </span>
      </div>

      {/* Third Row: Dates and Score */}
      <div className="text-sm text-gray-700 mb-2">
        <p>Started: {start}</p>
        <p>End: {end}</p>
      </div>
      <p className="text-sm mb-2">Score: {score}</p>

      {reward && (
        <img
          src="https://static-cdn.jtvnw.net/jtv_user_pictures/fazeclan-profile_image-9e6cf1831ab63b1e-300x300.png"
          alt="Reward"
          className="w-24 h-24 object-cover mb-2"
        />
      )}

      <Link to={`/app/leaderboard/${id}`}>
        <button 
          className="w-full px-4 py-2 bg-orange-400 hover:bg-orange-500 rounded-md font-medium transition-colors"
        >
          View Analytics
        </button>
      </Link>
    </div>
  );
};

const AnalyticsPage = () => {
  const { darkMode } = useTheme();
  const analyticsData = [
    {
      id: 1,
      type: "Quick Hit",
      title: "Design Therapy - VIIT",
      category: "Design and Creativity",
      status: "Ongoing",
      start: "February 13 12:00 PM",
      end: "June 30 12:00 PM",
      score: -3.68333,
      reward: false,
    },
    {
      id: 2,
      type: "Play and Win",
      title: "Flutter Frenzy",
      category: "Computers and Technology",
      status: "Ongoing",
      start: "February 5 12:00 AM",
      end: "June 30 12:00 PM",
      score: 0,
      reward: true,
    },
  ];

  return (
    <div className={`max-w-4xl mx-auto p-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
      {/* Header with back button and title */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link 
            to="/app" 
            className={`p-2 rounded-full ${
              darkMode ? "bg-zinc-800 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </Link>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
            Analytics
          </h1>
        </div>
      </div>

      {/* Date
      <p className={`mb-6 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        April 22, 2025
      </p> */}

      {/* Analytics Cards */}
      <div className="space-y-6">
        {analyticsData.map((item) => (
          <AnalyticsChallengeCard key={item.id} challenge={item} />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;