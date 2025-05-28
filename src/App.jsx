// src/App.jsx
import { useState } from 'react';
import Layout from './components/layout/Layout';
import { Outlet } from 'react-router-dom';

// In App.jsx, ensure state is properly passed:
// src/App.jsx
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedSort, setSelectedSort] = useState('DATE');

  

  return (
    <Layout 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      selectedSort={selectedSort}
      setSelectedSort={setSelectedSort}
    >
      <Outlet context={{ 
        searchQuery, 
        selectedFilter,
        selectedSort,
        setSelectedSort  // MUST include this
      }} />
    </Layout>
  );
}
export default App;