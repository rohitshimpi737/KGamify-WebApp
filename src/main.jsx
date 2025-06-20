// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Profile from './components/ui/Profile';
import Settings from './components/ui/Settings';
import AuthForm from './components/SignUp/SignUp';
import NavigationGuard from './components/layout/NavigationGuard';
import './index.css';
import QuizComponent from './components/Quiz/QuizComponent';
import ResultsPage from './pages/ResultPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthForm />,
  },
  {
    path: '/app',
    element: (
      <NavigationGuard>
        <App />
      </NavigationGuard>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'settings', element: <Settings /> },
      { path: 'profile', element: <Profile /> },
      { path: 'analytics', element: <AnalyticsPage /> }, // Add this line
      { path: 'quiz/:id', element:<QuizComponent/>},
      {path:'results/:id',element:<ResultsPage/>}
    ],
  },
  {
    path: '/logout',
    element: <AuthForm />,
  },

  { path: '*', element: <NotFound /> }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);