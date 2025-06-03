// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ChallengeCard from '../components/cards/ChallengeCard';
import { Challenges } from '../data_sample/Challenges';

function Dashboard() {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState('DATE');
  const [sortOpen, setSortOpen] = useState(false);

  const FILTER_TYPES = {
    QUICK_HIT: "Quick hit",
    PLAY_WIN: "Play and Win",
  };

  const sortOptions = [
    { value: 'DATE', label: 'Date' },
    { value: 'A-Z', label: 'A-Z' },
    { value: 'STATUS', label: 'Status' },
  ];

  const filteredChallenges = Challenges.filter(challenge => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = (
      challenge.title.toLowerCase().includes(lowerQuery) ||
      challenge.subtitle.toLowerCase().includes(lowerQuery) ||
      challenge.category.toLowerCase().includes(lowerQuery)
    );
    const matchesFilter = selectedFilter 
      ? challenge.title === selectedFilter 
      : true;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    const dateA = new Date(a.timings.starts);
    const dateB = new Date(b.timings.starts);

    switch(selectedSort) {
      case 'DATE':
        return dateB.getTime() - dateA.getTime();
      case 'A-Z': {
        const subA = a.subtitle.toLowerCase().trim();
        const subB = b.subtitle.toLowerCase().trim();
        return subA.localeCompare(subB);
      }
      case 'STATUS': {
        const validStatuses = ['ongoing', 'upcoming', 'completed'];
        const statusOrder = { ongoing: 1, upcoming: 2, completed: 3 };
        if (!validStatuses.includes(a.status)) console.warn('Invalid status:', a.status);
        if (!validStatuses.includes(b.status)) console.warn('Invalid status:', b.status);
        return statusOrder[a.status] - statusOrder[b.status];
      }
      default:
        return 0;
    }
  });
  
  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 py-2 pl-9 text-sm rounded-lg border focus:outline-none focus:ring-1 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
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
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex justify-between items-center mb-4">
        {/* Filter Buttons - Left Side */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedFilter(FILTER_TYPES.QUICK_HIT)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium ${
              darkMode
                ? selectedFilter === FILTER_TYPES.QUICK_HIT
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
                : selectedFilter === FILTER_TYPES.QUICK_HIT
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Quick Hit
          </button>
          <button
            onClick={() => setSelectedFilter(FILTER_TYPES.PLAY_WIN)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium ${
              darkMode
                ? selectedFilter === FILTER_TYPES.PLAY_WIN
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
                : selectedFilter === FILTER_TYPES.PLAY_WIN
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Play & Win
          </button>
          <button
            onClick={() => setSelectedFilter(null)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium ${
              darkMode
                ? !selectedFilter
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
                : !selectedFilter
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Show All
          </button>
        </div>

        {/* Sort Button - Right Side */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(true)}
            className={`p-2 rounded-lg ${
              darkMode
                ? 'text-white hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sort Modal */}
      {sortOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 backdrop-brightness-80"
            onClick={() => setSortOpen(false)}
          />
          
          {/* Modal Content */}
          <div className={`relative  w-65 max-w-xs rounded-xl shadow-lg z-10 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="p-4  border-b border-gray-200  dark:border-gray-700">
              <h3 className={`text-lg font-medium ${
                darkMode ? 'text-white' : 'text-gray-900 '
              }`}>
                Sort By
              </h3>
            </div>
            
            <div className="py-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedSort(option.value);
                    setSortOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-center ${
                    darkMode
                      ? 'text-white hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${
                    selectedSort === option.value
                      ? darkMode 
                        ? 'bg-orange-500 bg-opacity-20' 
                        : 'bg-orange-100'
                      : ''
                  }`}
                >
                  <span className="flex-1">{option.label}</span>
                  {selectedSort === option.value && (
                    <svg 
                      className="w-5 h-5 text-orange-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
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
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map(challenge => (
            <div key={challenge.id} className="w-full">  {/* Wrapper div */}
              <ChallengeCard 
                challenge={challenge} 
                className="w-full"  // Ensure full width
              />
            </div>
          ))
        ) : (
          <div className={`col-span-full text-center p-6 text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No challenges found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;