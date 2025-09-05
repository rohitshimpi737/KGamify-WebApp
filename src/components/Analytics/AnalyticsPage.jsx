// src/components/Analytics/AnalyticsPage.jsx
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import API from "../../services/api";
import { useAsyncState } from "../../hooks/useAsyncState";
import { 
  extractUserId, 
  getDaysAgo, 
  formatDate, 
  getStatusStyle,
  transformAnalyticsData
} from "../../utils/challengeUtils";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

const AnalyticsChallengeCard = ({ challenge }) => {
  const { darkMode } = useTheme();
  const { id, type, title, category, status, start, end, score, reward, description } = challenge;

  return (
    <div
      className={`rounded-xl border shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
        darkMode 
          ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-750" 
          : "bg-white border-orange-200 text-gray-800 hover:shadow-2xl"
      }`}
    >
      <div className="p-4">
        {/* Header with Challenge Type and Status */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
            darkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-700"
          }`}>
            {type || "Play and Win"}
          </span>
          <span className={`px-3 py-1 ${getStatusStyle(status)} text-white rounded-full text-xs font-medium`}>
            {status || "Ended"}
          </span>
        </div>

        {/* Title and Category */}
        <div className="mb-3">
          <h3 className="text-lg font-bold mb-1 leading-tight">{title}</h3>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {category}
          </p>
        </div>

        {/* Description */}
        {description && (
          <p className={`text-sm mb-4 line-clamp-2 ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            {description}
          </p>
        )}

        {/* Date Information */}
        <div className={`border-t border-b py-3 mb-4 ${
          darkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <svg className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Started: {formatDate(start)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Ended: {formatDate(end)}
            </span>
          </div>
        </div>

        {/* Score and Time Info */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Score</span>
            <p className="text-xl font-bold text-orange-500">{score}</p>
          </div>
          <div className="text-right">
            <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Played</span>
            <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {getDaysAgo(end)}
            </p>
          </div>
        </div>

        {/* Reward Badge */}
        {reward && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800">
            <img
              src="/public/celebration-removebg-preview.png"
              alt="Reward"
              className="w-16 h-12 object-contain rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">Reward</p>
              <p className="text-purple-200 text-xs">Times Prime</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/app/analytics/report/${id}`} className="flex-1">
            <button className="w-full px-4 py-2.5 rounded-lg font-medium transition-colors text-white hover:opacity-90"
              style={{ backgroundColor: '#FFAB40' }}>
              Report Card
            </button>
          </Link>
          <Link to={`/app/leaderboard/${id}`} className="flex-1">
            <button className="w-full px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-white hover:opacity-90"
              style={{ backgroundColor: '#FF9700' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Leaderboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  
  // ===========================
  // CENTRALIZED ASYNC STATE MANAGEMENT
  // ===========================
  const { data: analyticsData, loading, error, executeAsync } = useAsyncState({
    data: [],
    loading: true,
    error: null
  });

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      const userId = extractUserId(user);
      if (!userId) {
        throw new Error('User not found');
      }

      const result = await API.analytics.getUserAnalytics(userId);
      
      if (result.success && result.analytics) {
        return transformAnalyticsData(result.analytics);
      } else {
        return [];
      }
    };

    executeAsync(loadAnalytics);
  }, [executeAsync, user]);

  // Loading state
  if (loading) {
    return <LoadingState message="Loading analytics..." />;
  }

  // Error state rendering
  if (error) {
    return <ErrorState error={error} backLink="/app" backText="Browse Challenges" />;
  }

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/app" 
            className={`p-2 rounded-full ${
              darkMode ? "bg-zinc-800 text-white" : "bg-zinc-500"
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
          <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        </div>

        {/* Analytics Cards */}
        {analyticsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.map((challenge) => (
              <AnalyticsChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Analytics Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't completed any challenges yet. Start participating to see your analytics here.
            </p>
            <Link
              to="/app"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Challenges
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
