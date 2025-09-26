// LeaderboardPage.jsx
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import API from "../../services/api";
import { useAsyncState } from "../../hooks/useAsyncState";
import { extractUserId, formatTimeDisplay } from "../../utils/challengeUtils";
import LoadingState from "../ui/LoadingState";
import ErrorState from "../ui/ErrorState";

const LeaderboardPage = () => {
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
      leaderboard: []
    },
    loading: true,
    error: null
  });

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboardData = async () => {
      if (!id) {
        throw new Error('Missing challenge information');
      }

      console.log('Loading leaderboard for champion ID:', id);

      // Fetch championship details and leaderboard in parallel
      const [championshipResult, leaderboardResult] = await Promise.all([
        API.challenge.getChampionshipDetails(id),
        API.analytics.getLeaderboard(id)
      ]);

      console.log('Championship Result:', championshipResult);
      console.log('Leaderboard Result:', leaderboardResult);
      console.log('Leaderboard API URL called:', `https://kgamify.in/championshipmaker/apis/get_leaderboard.php?champ_id=${id}`);

      // Debug the leaderboard data structure
      if (leaderboardResult.success) {
        console.log('Leaderboard data structure:', {
          hasLeaderboard: !!leaderboardResult.leaderboard,
          leaderboardType: typeof leaderboardResult.leaderboard,
          leaderboardLength: Array.isArray(leaderboardResult.leaderboard) ? leaderboardResult.leaderboard.length : 'Not an array',
          firstEntry: leaderboardResult.leaderboard?.[0]
        });
      }

      return {
        championshipDetails: championshipResult.success && championshipResult.championship?.length
          ? championshipResult.championship[0]
          : null,
        leaderboard: leaderboardResult.success
          ? (leaderboardResult.leaderboard || leaderboardResult.data?.data || leaderboardResult.data || [])
          : [],
      };
    };

    executeAsync(loadLeaderboardData);
  }, [executeAsync, id]);

  // Loading state
  const { championshipDetails, leaderboard } = pageData || {};

  // Get current user's position in leaderboard
  const getCurrentUserRank = () => {
    if (!leaderboard || !user) return null;
    const userId = extractUserId(user);
    if (!userId) return null;

    const userEntry = leaderboard.find(entry =>
      entry.user_id?.toString() === userId.toString() ||
      entry.id?.toString() === userId.toString()
    );

    if (userEntry) {
      const rank = leaderboard.indexOf(userEntry) + 1;
      return { ...userEntry, rank };
    }
    return null;
  };

  const currentUserRank = getCurrentUserRank();

  if (loading) {
    return <LoadingState message="Loading leaderboard..." />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} backLink="/app/analytics" backText="Back to Analytics" />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
      }`}>
      {/* Mobile App Header */}
      <div className="bg-orange-400 text-black sticky top-0 z-50 shadow-md">
        {/* Status bar space for mobile */}
        <div className="h-safe-top bg-orange-500"></div>
        
        {/* Header content */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/app/analytics"
              className="p-2 -ml-2 rounded-full hover:bg-orange-500 active:bg-orange-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">Leaderboard</h1>
          </div>
          
          {/* Optional header actions */}
          <div className="flex items-center gap-2">
            {/* You can add more header actions here if needed */}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Challenge Info */}
        {championshipDetails && (
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold mb-1">
              {championshipDetails.champ_name}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {championshipDetails.category_name || championshipDetails.champ_category}
            </p>
          </div>
        )}

        {leaderboard && leaderboard.length > 0 ? (
          <>
            {/* Top 3 Podium - Mobile Optimized */}
            {leaderboard.length >= 3 && (
              <div className="mb-6 px-2">
                <div className="flex justify-center items-end gap-2 sm:gap-4 max-w-sm mx-auto">

                  {/* 2nd Place - Left Side */}
                  <div className="text-center flex-1">
                    <div className="text-xs font-bold mb-1">2nd</div>
                    <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center mb-1 mx-auto`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="font-semibold text-xs truncate px-1">{leaderboard[1]?.name || leaderboard[1]?.user_name}</div>
                    <div className="text-xs">{parseFloat(leaderboard[1]?.total_score || leaderboard[1]?.score || 0).toFixed(2)}</div>
                    {/* Podium Base */}
                    <div className="bg-gray-400 dark:bg-gray-700 h-12 w-full mt-2 rounded-t-md"></div>
                  </div>

                  {/* 1st Place - Center, Highest */}
                  <div className="text-center flex-1">
                    {/* Crown */}
                    <div className="flex justify-center mb-1">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 16L3 5L8 8L12 4L16 8L21 5L19 16H5Z" />
                      </svg>
                    </div>
                    <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center mb-1 mx-auto`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="font-bold text-sm truncate px-1">{leaderboard[0]?.name || leaderboard[0]?.user_name}</div>
                    <div className="text-xs">{parseFloat(leaderboard[0]?.total_score || leaderboard[0]?.score || 0).toFixed(2)}</div>
                    {/* Podium Base */}
                    <div className="bg-yellow-400 dark:bg-yellow-600 h-16 w-full mt-2 rounded-t-md"></div>
                  </div>

                  {/* 3rd Place - Right Side */}
                  <div className="text-center flex-1">
                    <div className="text-xs font-bold mb-1">3rd</div>
                    <div className={`w-16 h-16 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} flex items-center justify-center mb-1 mx-auto`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="font-semibold text-xs truncate px-1">{leaderboard[2]?.name || leaderboard[2]?.user_name}</div>
                    <div className="text-xs">{parseFloat(leaderboard[2]?.total_score || leaderboard[2]?.score || 0).toFixed(2)}</div>
                    {/* Podium Base */}
                    <div className="bg-orange-400 dark:bg-orange-700 h-10 w-full mt-2 rounded-t-md"></div>
                  </div>

                </div>
              </div>
            )}


            {/* Full Leaderboard List */}
            <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}>
              {(leaderboard.length >= 3 ? leaderboard.slice(3) : leaderboard).map((entry, index) => {
                const rank = leaderboard.length >= 3 ? index + 4 : index + 1; // Starting from 4th position if we have podium, otherwise from 1st
                const isCurrentUser = currentUserRank && currentUserRank.rank === rank;

                return (
                  <div
                    key={entry.user_id || entry.id || index}
                    className={`flex items-center p-4 border-b last:border-b-0 ${darkMode ? 'border-gray-700' : 'border-gray-100'
                      } ${isCurrentUser ? (darkMode ? 'bg-orange-900 bg-opacity-20' : 'bg-orange-50') : ''}`}
                  >
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      } flex items-center justify-center text-sm font-bold mr-3`}>
                      {rank}
                    </div>

                    {/* Profile */}
                    <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'
                      } flex items-center justify-center mr-3`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>

                    {/* Name and Score */}
                    <div className="flex-1">
                      <div className="font-semibold text-base">
                        {entry.name || entry.user_name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-orange-500 font-medium">
                        Score: {parseFloat(entry.total_score || entry.score || 0).toFixed(2)}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right">
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {formatTimeDisplay(entry.time_taken || entry.time)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Current User Position (if not in top positions) */}
            {currentUserRank && currentUserRank.rank > 3 && (
              <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-orange-900 bg-opacity-20 border border-orange-800' : 'bg-orange-50 border border-orange-200'
                }`}>
                <div className="text-center">
                  <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Your Position</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="font-bold">#{currentUserRank.rank}</div>
                    <div className="font-semibold">{currentUserRank.name || currentUserRank.user_name}</div>
                    <div className="text-orange-500 font-medium">
                      {parseFloat(currentUserRank.total_score || currentUserRank.score || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No Leaderboard Data</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Leaderboard will be available after participants complete the challenge.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
