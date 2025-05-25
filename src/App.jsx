// src/App.jsx
import Layout from './components/layout/Layout';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <Layout>
      <Outlet/>
    </Layout>
  );
}

export default App;