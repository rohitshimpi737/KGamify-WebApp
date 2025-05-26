// src/components/layout/NavigationGuard.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation, useNavigationType } from 'react-router-dom';

function NavigationGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' && location.pathname.startsWith('/app')) {
      navigate('/app', { replace: true });
    }
  }, [navigationType, location, navigate]);

  return children;
}

export default NavigationGuard;