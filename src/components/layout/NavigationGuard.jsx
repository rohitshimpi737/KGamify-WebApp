// src/components/layout/NavigationGuard.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation, useNavigationType, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function NavigationGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const { isAuthenticated, loading } = useAuth();

  // All hooks must be called before any conditional logic
  useEffect(() => {
    if (navigationType === 'POP' && location.pathname.startsWith('/app')) {
      navigate('/app', { replace: true });
    }
  }, [navigationType, location, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default NavigationGuard;