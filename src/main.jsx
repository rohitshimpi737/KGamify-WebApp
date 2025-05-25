// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext'; // Add this import
import App from './App';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Profile from './components/ui/Profile';
import Settings from './components/ui/Settings';
import NavigationGuard from './components/layout/NavigationGuard';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <NavigationGuard>
        <App />
      </NavigationGuard>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: 'challenges', element: <Challenges /> },
      { path: 'profile', element: <Profile /> },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> 
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);