// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
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
import LeaderboardPage from './components/Analytics/LeaderboardPage';
import ChallengeAnalytics from './components/Analytics/ChallengeAnalytics';
import ForgotPassword from "./components/SignUp/ForgotPassword";

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
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'analytics/report/:id', element: <ChallengeAnalytics /> },
      { path: 'leaderboard/:id', element: <LeaderboardPage /> },
      { path: 'quiz/:id', element: <QuizComponent /> },
      { path: 'results/:id', element: <ResultsPage /> }
    ],
  },
  {
    path: '/logout',
    element: <AuthForm />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: '*',
    element: <NotFound />
  }

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
);