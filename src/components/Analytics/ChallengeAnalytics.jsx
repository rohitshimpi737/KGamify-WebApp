// ChallengeAnalytics.jsx
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import API from "../../services/api";
import { useAsyncState } from "../../hooks/useAsyncState";
import { 
  extractUserId, 
  parseTimeToSeconds, 
  formatDate,
  getScoreColor
} from "../../utils/challengeUtils";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import PageHeader from "../ui/PageHeader";

const ChallengeAnalytics = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  
  // ===========================
  // CENTRALIZED ASYNC STATE MANAGEMENT
  // ===========================
  const { 
    data: pageData, 
    loading, 
    error, 
    executeAsync 
  } = useAsyncState({
    data: {
      championshipDetails: null,
      questionAnalytics: [],
    },
    loading: true,
    error: null
  });

  // Load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      const userId = extractUserId(user);
      if (!userId || !id) {
        throw new Error('Missing user or challenge information');
      }

      // Fetch championship details and question analytics in parallel
      const [championshipResult, questionAnalyticsResult] = await Promise.all([
        API.challenge.getChampionshipDetails(id),
        API.analytics.getAnalyticsPerQuestion(userId, id)
      ]);

      return {
        championshipDetails: championshipResult.success && championshipResult.championship?.length 
          ? championshipResult.championship[0] 
          : null,
        questionAnalytics: questionAnalyticsResult.success 
          ? questionAnalyticsResult.questionAnalytics || []
          : [],
      };
    };

    executeAsync(loadAnalyticsData);
  }, [executeAsync, user, id]);

  // Loading state
  const { championshipDetails, questionAnalytics } = pageData || {};

  // Calculate performance stats
  const getPerformanceStats = () => {
    if (!questionAnalytics || !questionAnalytics.length) return null;

    const correctAnswers = questionAnalytics.filter(q => 
      q.is_correct === true || q.is_correct === 1 || q.is_correct === "1"
    ).length;
    
    const totalScore = questionAnalytics.reduce((sum, q) => 
      sum + (parseFloat(q.points_earned || q.points) || 0), 0
    );
    
    const avgTime = questionAnalytics.reduce((sum, q) => 
      sum + (parseInt(q.time_taken || q.time) || 0), 0
    ) / questionAnalytics.length;
    
    const accuracy = (correctAnswers / questionAnalytics.length) * 100;

    return {
      correct: correctAnswers,
      total: questionAnalytics.length,
      score: totalScore.toFixed(1),
      avgTime: avgTime.toFixed(1),
      accuracy: accuracy.toFixed(1)
    };
  };

  const stats = getPerformanceStats();

  if (loading) {
    return <LoadingState message="Loading analytics..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} backLink="/app/analytics" backText="Back to Analytics" />;
  }

  return (
    <div className={`p-4 min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <PageHeader title="Leaderboard" backLink="/app/analytics" />

      {/* Challenge Info */}
      {championshipDetails && (
        <div className="mb-6">
          {/* Category */}
          <h2 className="text-2xl font-bold text-orange-500 mb-2">
            {championshipDetails.category_name || championshipDetails.champ_category || "Challenge Category"}
          </h2>
          
          {/* Challenge Title */}
          <h3 className="text-xl font-bold mb-2">
            {championshipDetails.champ_name || "Challenge Title"}
          </h3>
          
          {/* Start Date */}
          <p className="text-gray-600 dark:text-gray-400">
            Started : {formatDate(championshipDetails.start_date, { 
              weekday: 'short',
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
        </div>
      )}

      {/* Report Card Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Report Card</h3>
        
        {questionAnalytics && questionAnalytics.length > 0 ? (
          <div className={`rounded-lg overflow-hidden shadow-lg ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="p-3 text-center font-semibold">Q.No</th>
                    <th className="p-3 text-center font-semibold">Total Points</th>
                    <th className="p-3 text-center font-semibold">Bonus/ Penalty</th>
                    <th className="p-3 text-center font-semibold">Points</th>
                    <th className="p-3 text-center font-semibold">Actual Time</th>
                    <th className="p-3 text-center font-semibold">Expected Time</th>
                  </tr>
                </thead>
                <tbody>
                  {questionAnalytics.map((q, idx) => {
                    const isCorrect = q.is_correct === true || q.is_correct === 1 || q.is_correct === "1";
                    
                    // From API data: points is the final calculated points, total_coins is base points
                    const totalPoints = parseFloat(q.points || 0); // Final calculated points
                    const baseCoins = parseFloat(q.total_coins || 0); // Base points for question (usually 2)
                    
                    // Bonus/Penalty = Total Points - Points (base points)
                    const bonusPenalty = totalPoints - baseCoins;
                    
                    const actualTime = q.time_taken || 0;
                    const expectedTime = q.expected_time || 0;
                    
                    const actualTimeSeconds = parseTimeToSeconds(actualTime);
                    const expectedTimeSeconds = parseTimeToSeconds(expectedTime);
                    
                    return (
                      <tr key={idx} className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"} hover:bg-gray-50 dark:hover:bg-gray-800`}>
                        <td className="p-3 text-center font-medium">Q {idx + 1}</td>
                        <td className={`p-3 text-center font-semibold ${getScoreColor(totalPoints, totalPoints < 0)}`}>
                          {totalPoints.toFixed(3)}
                        </td>
                        <td className={`p-3 text-center font-semibold ${getScoreColor(bonusPenalty, bonusPenalty < 0)}`}>
                          {bonusPenalty.toFixed(2)}
                        </td>
                        <td className="p-3 text-center font-semibold">
                          {baseCoins.toFixed(0)}
                        </td>
                        <td className="p-3 text-center">
                          {actualTimeSeconds}sec
                        </td>
                        <td className="p-3 text-center">
                          {expectedTimeSeconds}sec
                        </td>
                      </tr>
                    );
                  })}
                  
                  {/* Total Row */}
                  <tr className={`border-t-2 ${darkMode ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-gray-100"} font-bold`}>
                    <td className="p-3 text-center">Total</td>
                    <td className="p-3 text-center text-green-600">
                      {questionAnalytics.reduce((sum, q) => 
                        sum + parseFloat(q.points || 0), 0
                      ).toFixed(3)}
                    </td>
                    <td className={`p-3 text-center ${
                      questionAnalytics.reduce((sum, q) => {
                        const totalPoints = parseFloat(q.points || 0);
                        const baseCoins = parseFloat(q.total_coins || 0);
                        return sum + (totalPoints - baseCoins); // Bonus/Penalty = Total Points - Points
                      }, 0) < 0 ? 'text-red-500' : 'text-green-600'
                    }`}>
                      {questionAnalytics.reduce((sum, q) => {
                        const totalPoints = parseFloat(q.points || 0);
                        const baseCoins = parseFloat(q.total_coins || 0);
                        return sum + (totalPoints - baseCoins); // Bonus/Penalty = Total Points - Points
                      }, 0).toFixed(3)}
                    </td>
                    <td className="p-3 text-center">
                      {questionAnalytics.reduce((sum, q) => 
                        sum + parseFloat(q.total_coins || 0), 0
                      ).toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      {questionAnalytics.reduce((sum, q) => {
                        return sum + parseTimeToSeconds(q.time_taken || 0);
                      }, 0)}sec
                    </td>
                    <td className="p-3 text-center">
                      {questionAnalytics.reduce((sum, q) => {
                        return sum + parseTimeToSeconds(q.expected_time || 0);
                      }, 0)}sec
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className={`rounded-lg p-6 text-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <p className="text-gray-500">No performance report available for this challenge.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChallengeAnalytics;
