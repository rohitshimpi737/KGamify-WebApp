// ChallengeAnalytics.jsx
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

// Contexts
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

// Services & Hooks
import API from "../../services/api";
import { useAsyncState } from "../../hooks/useAsyncState";

// Utils
import {
  extractUserId,
  parseTimeToSeconds,
  formatDate,
  getScoreColor,
} from "../../utils/challengeUtils";

// UI Components
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";
import PageHeader from "../ui/PageHeader";


// ===========================
// HELPER FUNCTION
// ===========================
const calculateChallengeAnalytics = (questionAnalytics = []) => {
  if (!questionAnalytics || !questionAnalytics.length) return null;

  const sortedAnalytics = [...questionAnalytics].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  // Simplified row data with only required fields
  const rows = sortedAnalytics.map((q, idx) => {
    const totalPoints = parseFloat(q.points || 0);
    const baseCoins = parseFloat(q.total_coins || 0);
    const bonusPenalty = totalPoints - baseCoins;

    const actualTimeInSeconds = parseTimeToSeconds(q.time_taken || "00:00:00");
    const expectedTimeInSeconds = parseTimeToSeconds(q.expected_time || "00:00:00");

    return {
      qNo: idx + 1,
      totalPoints,
      bonusPenalty,
      baseCoins: q.total_coins,
      actualTime: q.time_taken || "00:00:00",
      expectedTime: q.expected_time || "00:00:00",
      actualTimeInSeconds,
      expectedTimeInSeconds,
    };
  });

  // Totals calculation
  const totals = rows.reduce(
    (acc, row) => {
      acc.totalPoints += row.totalPoints;
      acc.bonusPenalty += row.bonusPenalty;
      acc.baseCoins += parseFloat(row.baseCoins);
      acc.totalActualTime += row.actualTimeInSeconds;
      acc.totalExpectedTime += row.expectedTimeInSeconds;
      return acc;
    },
    {
      totalPoints: 0,
      bonusPenalty: 0,
      baseCoins: 0,
      totalActualTime: 0,
      totalExpectedTime: 0,
    }
  );

  return { rows, totals };
};


// ===========================
// MAIN COMPONENT
// ===========================
const ChallengeAnalytics = () => {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const { user } = useAuth();

  // ===========================
  // ASYNC STATE
  // ===========================
  const {
    data: pageData,
    loading,
    error,
    executeAsync,
  } = useAsyncState({
    data: {
      championshipDetails: null,
      questionAnalytics: [],
    },
    loading: true,
    error: null,
  });

  // Fetch analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      const userId = extractUserId(user);
      if (!userId || !id) {
        throw new Error("Missing user or challenge information");
      }

      const [championshipResult, questionAnalyticsResult] = await Promise.all([
        API.challenge.getChampionshipDetails(id),
        API.analytics.getAnalyticsPerQuestion(userId, id),
      ]);

      return {
        championshipDetails:
          championshipResult.success && championshipResult.championship?.length
            ? championshipResult.championship[0]
            : null,
        questionAnalytics: questionAnalyticsResult.success
          ? questionAnalyticsResult.questionAnalytics || []
          : [],
      };
    };

    executeAsync(loadAnalyticsData);
  }, [executeAsync, user, id]);

  const { championshipDetails, questionAnalytics } = pageData || {};

  // ===========================
  // PERFORMANCE DATA
  // ===========================
  const computedData = useMemo(
    () => calculateChallengeAnalytics(questionAnalytics),
    [questionAnalytics]
  );

  // ===========================
  // LOADING + ERROR HANDLING
  // ===========================
  if (loading) return <LoadingState message="Loading analytics..." />;
  if (error)
    return (
      <ErrorState
        error={error}
        backLink="/app/analytics"
        backText="Back to Analytics"
      />
    );

  // ===========================
  // RENDER
  // ===========================
  return (
    <div
      className={`p-4 min-h-screen ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <PageHeader title="Leaderboard" backLink="/app/analytics" />

      {/* Challenge Info */}
      {championshipDetails && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-orange-500 mb-2">
            {championshipDetails.category_name ||
              championshipDetails.champ_category ||
              "Challenge Category"}
          </h2>
          <h3 className="text-xl font-bold mb-2">
            {championshipDetails.champ_name || "Challenge Title"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Started:{" "}
            {formatDate(championshipDetails.start_date, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      )}

      {/* Report Card */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Report Card</h3>

        {computedData ? (
          <div
            className={`rounded-lg overflow-hidden shadow-lg ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="p-3 text-center">Q.No</th>
                  <th className="p-3 text-center">Base Points</th>
                  <th className="p-3 text-center">Bonus / Penalty</th>
                  <th className="p-3 text-center">Total Points</th>
                  <th className="p-3 text-center">Time Taken</th>
                  <th className="p-3 text-center">Expected Time</th>
                </tr>
              </thead>
              <tbody>
                {computedData.rows.map((row) => (
                  <tr
                    key={row.qNo}
                    className={`border-b ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    } hover:bg-gray-50 dark:hover:bg-gray-800`}
                  >
                    <td className="p-3 text-center">Q {row.qNo}</td>
                    <td className="p-3 text-center font-semibold">
                      {row.baseCoins}
                    </td>
                    <td
                      className={`p-3 text-center font-semibold ${getScoreColor(
                        row.bonusPenalty
                      )}`}
                    >
                      {row.bonusPenalty.toFixed(2)}
                    </td>
                    <td
                      className={`p-3 text-center font-semibold ${getScoreColor(
                        row.totalPoints
                      )}`}
                    >
                      {row.totalPoints.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">{row.actualTime}</td>
                    <td className="p-3 text-center">{row.expectedTime}</td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr
                  className={`border-t-2 ${
                    darkMode
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-300 bg-gray-100"
                  } font-bold`}
                >
                  <td className="p-3 text-center">Totals</td>
                  <td className="p-3 text-center">
                    {computedData.totals.baseCoins.toFixed(2)}
                  </td>
                  <td
                    className={`p-3 text-center ${
                      computedData.totals.bonusPenalty < 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {computedData.totals.bonusPenalty.toFixed(2)}
                  </td>
                  <td className="p-3 text-center text-green-600">
                    {computedData.totals.totalPoints.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    {new Date(computedData.totals.totalActualTime * 1000)
                      .toISOString()
                      .substr(11, 8)}
                  </td>
                  <td className="p-3 text-center">
                    {new Date(computedData.totals.totalExpectedTime * 1000)
                      .toISOString()
                      .substr(11, 8)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className={`rounded-lg p-6 text-center ${
              darkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <p className="text-gray-500">
              No performance report available for this challenge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeAnalytics;
