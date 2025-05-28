// src/pages/Dashboard.jsx
import { useOutletContext } from 'react-router-dom';
import { Challenges } from '../data_sample/Challenges';
import { useTheme } from '../contexts/ThemeContext';
import ChallengeCard from '../components/cards/ChallengeCard';
import Analytics from '../components/Analytics/Analytics';



function Dashboard() {
  const { searchQuery, selectedFilter,selectedSort } = useOutletContext();
  const { darkMode } = useTheme();

  

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
      // Normalize strings and compare
      const subA = a.subtitle.toLowerCase().trim();
      const subB = b.subtitle.toLowerCase().trim();
      return subA.localeCompare(subB);
    }

    case 'STATUS': {
      // Validate status values first
      const validStatuses = ['ongoing', 'upcoming', 'completed'];
      const statusOrder = { ongoing: 1, upcoming: 2, completed: 3 };
      
      // Fallback for invalid status values
      if (!validStatuses.includes(a.status)) console.warn('Invalid status:', a.status);
      if (!validStatuses.includes(b.status)) console.warn('Invalid status:', b.status);
      
      return statusOrder[a.status] - statusOrder[b.status];
    }

    default:
      return 0;
  }})
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {filteredChallenges.length > 0 ? (
        filteredChallenges.map(challenge => (
          <ChallengeCard 
            key={challenge.id} 
            challenge={challenge} 
            className="w-full h-full"
          />
        ))
      ) : (
        <div className={`col-span-full text-center p-8 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          No challenges found matching your criteria
        </div>
      )}
    </div>
  );
}

export default Dashboard;