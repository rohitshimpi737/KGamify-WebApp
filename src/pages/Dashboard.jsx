// src/pages/Dashboard.jsx
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
      const result = await API.challenge.getAllChallenges();
      
      if (result.success && result.challenges) {
        const transformedChallenges = await transformChallenges(result.challenges);
        return transformedChallenges;
      } else {
        throw new Error(result.error || 'Failed to fetch challenges');
      }
    };

    executeAsync(loadChallenges);
  }, [executeAsync]);

  const transformChallenges = async (apiChallenges) => {
    if (!Array.isArray(apiChallenges)) {
      console.warn('API challenges is not an array:', apiChallenges);
      return [];
    }

    console.log(`Transforming ${apiChallenges.length} challenges with lazy loading...`);
    
    // Transform challenges without fetching details immediately (lazy loading)
    return apiChallenges.map((champ, index) => {
      try {
        // Calculate status based on dates
        const status = calculateChallengeStatus(champ);

        // Transform data with basic info only - details will be loaded on demand
        const transformedChallenge = {
          id: champ.champ_id || `challenge-${index}`,
          unique_id: champ.champ_id || `unique-${index}`,
          title: 'Play and Win', // Default, will be updated when details load
          subtitle: champ.champ_name || 'Unnamed Challenge',
          category: champ.category_name || 'General',
          status: status,
          details: {
            questions: '10 Questions', // Default values
            duration: '15 Minutes',
            participants: '0 participants'
          },
          eligibility: ["All Students"],
          timings: {
            starts: formatDate(champ.start_date, champ.start_time),
            ends: formatDate(champ.end_date, champ.end_time)
          },
          teacher: {
            name: "",
            department: champ.category_name || "General",
            institute: "KGamify Platform",
            championshipsCreated: 1,
            profilePic: null
          },
          originalData: champ,
          detailedData: null,
          // Lazy loading flags
          detailsLoaded: false,
          isLoadingDetails: false
        };

        console.log(`Transformed challenge ${index + 1} (basic):`, transformedChallenge.subtitle);
        return transformedChallenge;
        
      } catch (transformError) {
        console.error(`Error transforming challenge ${index}:`, transformError);
        // Return a minimal valid challenge object
        return {
          id: champ.champ_id || `error-challenge-${index}`,
          unique_id: champ.champ_id || `error-unique-${index}`,
          title: 'Play and Win',
          subtitle: champ.champ_name || 'Challenge (Error)',
          category: champ.category_name || 'General',
          status: 'upcoming',
          details: {
            questions: '10 Questions',
            duration: '15 Minutes',
            participants: '0 participants'
          },
          eligibility: ["All Students"],
          timings: {
            starts: 'TBD',
            ends: 'TBD'
          },
          teacher: {
            name: "System Administrator",
            department: "General",
            institute: "KGamify Platform",
            championshipsCreated: 1,
            profilePic: null
          },
          originalData: champ,
          detailedData: null,
          detailsLoaded: false,
          isLoadingDetails: false
        };
      }
    });
  };

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

  const formatDuration = (timeStr) => {
    if (!timeStr) return '15 Minutes';
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return '15 Minutes';
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} Minutes`;
    } catch (error) {
      return '15 Minutes';
    }
  };

  const formatDate = (dateStr, timeStr) => {
    try {
      const date = new Date(`${dateStr} ${timeStr || '00:00:00'}`);
      if (isNaN(date.getTime())) return 'TBD';
      
      return date.toLocaleDateString('en-US', {
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true
      });
    } catch (error) {
      return 'TBD';
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
        
        // Search filter
        const matchesSearch = !lowerQuery || 
          challenge.title?.toLowerCase().includes(lowerQuery) ||
          challenge.subtitle?.toLowerCase().includes(lowerQuery) ||
          challenge.category?.toLowerCase().includes(lowerQuery);

        // Type filter
        const matchesFilter = selectedFilter === 'Show All' || 
                             !selectedFilter || 
                             challenge.title === selectedFilter;

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
            case 'A-Z':
              return (a.subtitle || '').localeCompare(b.subtitle || '');
            
            case 'STATUS': {
              const statusOrder = { 'ongoing': 0, 'upcoming': 1, 'completed': 2 };
              const aOrder = statusOrder[a.status] ?? 3;
              const bOrder = statusOrder[b.status] ?? 3;
              return aOrder - bOrder;
            }
            
            case 'DATE':
            default: {
              const aDate = new Date(a.originalData?.start_date || '1970-01-01');
              const bDate = new Date(b.originalData?.start_date || '1970-01-01');
              return bDate - aDate; // Changed to bDate - aDate for newest first
            }
          }
        } catch (sortError) {
          console.warn('Error sorting challenges:', sortError);
          return 0;
        }
      });
    } catch (error) {
      console.error('Error sorting challenges:', error);
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
            className={`w-full px-3 py-2 pl-9 text-sm rounded-lg border focus:outline-none focus:ring-1 ${
              darkMode
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
              className={`px-3 py-1.5 text-xs rounded-lg font-medium ${
                darkMode
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
                  className={`w-full px-4 py-3 text-left flex items-center ${
                    darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  } ${
                    selectedSort === option.value
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
          displayedChallenges.map(challenge => (
            <div key={challenge.id} className="w-full">
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
