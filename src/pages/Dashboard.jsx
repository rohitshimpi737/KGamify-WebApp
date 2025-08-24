import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ChallengeCard from '../components/cards/ChallengeCard';
import API from '../services/api';
import { useAsyncState } from '../hooks/useAsyncState';

function Dashboard() {

  // ===========================
  // HOOKS & CONTEXT
  // ===========================
  const { darkMode } = useTheme();

  // ===========================
  // COMPONENT STATE
  // ===========================
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Show All');
  const [selectedSort, setSelectedSort] = useState('DATE');
  const [sortOpen, setSortOpen] = useState(false);

  // ===========================
  // CENTRALIZED ASYNC STATE MANAGEMENT
  // ===========================
  const { data: challenges, loading, error, executeAsync } = useAsyncState({
    data: [],
    loading: true,
    error: null
  });

  // ===========================
  // CONSTANTS & CONFIGURATION
  // ===========================

  // Update FILTER_TYPES constant if not already defined
  const FILTER_TYPES = {
    QUICK_HIT: "Quick hit",
    PLAY_WIN: "Play and Win",
    SHOW_ALL: "Show All"
  };

  const sortOptions = [
    { value: 'DATE', label: 'Date' },
    { value: 'A-Z', label: 'A-Z' },
    { value: 'STATUS', label: 'Status' },
  ];

  // ===========================
  // DATA LOADING & PROCESSING
  // ===========================
  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const categories = await API.challenge.getAllCategories();
        if (!Array.isArray(categories)) {
          console.warn('Categories is not an array:', categories);
          return [];
        }

        const merged = await Promise.all(
          categories.map(async (cat) => {
            try {
              const champId = cat.champ_id || cat.category_id;
              if (!champId) return null;

              const details = await API.challenge.getChallengeDetails(champId);
              if (!details) return null;

              // Only return challenges with active status
              if (String(details.champ_status) !== "1" || String(details.category_status) !== "1") {
                return null;
              }

              return { ...cat, ...details };
            } catch (err) {
              console.error(`Error processing category:`, err);
              return null;
            }
          })
        );

        return merged.filter(Boolean);
      } catch (error) {
        console.error('loadChallenges error:', error);
        return [];
      }
    };

    executeAsync(loadChallenges);
  }, [executeAsync]);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================

  const calculateChallengeStatus = (champ) => {
    try {
      const now = new Date();
      const startDate = new Date(`${champ.start_date} ${champ.start_time || '00:00:00'}`);
      const endDate = new Date(`${champ.end_date} ${champ.end_time || '23:59:59'}`);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'upcoming'; // Default if dates are invalid
      }

      if (now >= startDate && now <= endDate) return 'ongoing';
      if (now > endDate) return 'completed';
      return 'upcoming';
    } catch (error) {
      console.warn('Error calculating challenge status:', error);
      return 'upcoming';
    }
  };

  // ===========================
  // FILTERING & SORTING LOGIC
  // ===========================


  const getFilteredChallenges = () => {
    try {
      if (!Array.isArray(challenges)) return [];

      const lowerQuery = searchQuery.toLowerCase().trim();

      return challenges.filter(challenge => {
        if (!challenge) return false;

        // Search filter - check multiple fields
        const matchesSearch = !lowerQuery || [
          challenge.champ_name,
          challenge.category_name,
          challenge.mode_name,
          challenge.user_qualification,
          challenge.teacher_name
        ].some(field => field?.toLowerCase()?.includes(lowerQuery));

        // Type filter based on mode_name
        const matchesFilter =
          selectedFilter === FILTER_TYPES.SHOW_ALL ||
          (selectedFilter === FILTER_TYPES.QUICK_HIT && challenge.mode_name?.toLowerCase() === 'quick_hit') ||
          (selectedFilter === FILTER_TYPES.PLAY_WIN && challenge.mode_name?.toLowerCase() !== 'quick_hit');

        return matchesSearch && matchesFilter;
      });
    } catch (error) {
      console.error('Error filtering challenges:', error);
      return [];
    }
  };

  const getSortedChallenges = () => {
    try {
      const filtered = getFilteredChallenges();
      if (!Array.isArray(filtered)) return [];

      return [...filtered].sort((a, b) => {
        try {
          switch (selectedSort) {
            case 'A-Z': {
              // Sort by championship name
              const aName = a?.champ_name || '';
              const bName = b?.champ_name || '';
              return aName.localeCompare(bName);
            }

            case 'STATUS': {
              // Define priority for each status
              const statusPriority = {
                'ongoing': 0,
                'upcoming': 1,
                'completed': 2,
                'ended': 3
              };

              // Get current status for both challenges
              const aStatus = calculateChallengeStatus(a);
              const bStatus = calculateChallengeStatus(b);

              // First sort by status priority
              const statusDiff = (statusPriority[aStatus] || 999) - (statusPriority[bStatus] || 999);
              if (statusDiff !== 0) return statusDiff;

              // If same status, sort by start date
              const aDate = new Date(`${a.start_date} ${a.start_time || '00:00:00'}`);
              const bDate = new Date(`${b.start_date} ${b.start_time || '00:00:00'}`);
              return bDate - aDate;
            }

            case 'DATE':
            default: {
              // Sort by start date, most recent first
              const aDate = new Date(`${a.start_date} ${a.start_time || '00:00:00'}`);
              const bDate = new Date(`${b.start_date} ${b.start_time || '00:00:00'}`);

              if (isNaN(aDate.getTime())) return 1;  // Invalid dates go to end
              if (isNaN(bDate.getTime())) return -1;

              const dateDiff = bDate - aDate;
              if (dateDiff !== 0) return dateDiff;

              // If same date, sort by name as secondary criteria
              return (a?.champ_name || '').localeCompare(b?.champ_name || '');
            }
          }
        } catch (sortError) {
          console.warn('Error sorting challenges:', sortError);
          return 0;
        }
      });
    } catch (error) {
      console.error('Error in getSortedChallenges:', error);
      return [];
    }
  };


  // ===========================
  // EVENT HANDLERS
  // ===========================

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterChange = (filterType) => {
    setSelectedFilter(filterType);
  };

  const handleSortChange = (sortValue) => {
    setSelectedSort(sortValue);
    setSortOpen(false);
  };

  // ===========================
  // COMPUTED VALUES
  // ===========================

  const displayedChallenges = getSortedChallenges();
  const hasResults = displayedChallenges.length > 0;
  const isFiltered = searchQuery.trim() || selectedFilter !== 'Show All';

  // ===========================
  // RENDER HELPERS
  // ===========================

  const renderLoadingState = () => (
    <div className={`col-span-full text-center p-8 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      <div className="animate-pulse">Loading challenges...</div>
    </div>
  );

  const renderErrorState = () => (
    <div className={`col-span-full text-center p-8 text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
      <div className="mb-2">⚠️ {error}</div>
      <button
        onClick={() => window.location.reload()}
        className="text-xs underline hover:no-underline"
      >
        Reload Page
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className={`col-span-full text-center p-8 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {isFiltered
        ? `No challenges match your ${searchQuery ? 'search' : 'filter'} criteria`
        : 'No challenges available at the moment'
      }
    </div>
  );

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 pl-9 text-sm rounded-lg border focus:outline-none focus:ring-1 ${darkMode
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500'
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500'
              }`}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {Object.values(FILTER_TYPES).map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium ${darkMode
                ? selectedFilter === type
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
                : selectedFilter === type
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setSortOpen(true)}
            className={`p-2 rounded-lg ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {sortOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-brightness-80" onClick={() => setSortOpen(false)} />
          <div className={`relative w-65 max-w-xs rounded-xl shadow-lg z-10 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sort By</h3>
            </div>
            <div className="py-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-3 text-left flex items-center ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    } ${selectedSort === option.value
                      ? darkMode ? 'bg-orange-500 bg-opacity-20' : 'bg-orange-100'
                      : ''
                    }`}
                >
                  <span className="flex-1">{option.label}</span>
                  {selectedSort === option.value && (
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Cards Grid */}
      <div className="flex flex-col gap-4">
        {loading ? (
          renderLoadingState()
        ) : error ? (
          renderErrorState()
        ) : hasResults ? (
          displayedChallenges
            .filter(Boolean) // Remove any null/undefined entries
            .map(challenge => (
              <div
                key={challenge?.champ_id || challenge?.id || Math.random().toString(36).substr(2, 9)}
                className="w-full"
              >
                <ChallengeCard challenge={challenge} />
              </div>
            ))
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
}

export default Dashboard;
