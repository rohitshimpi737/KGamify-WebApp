import {  useNavigationType, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';


function NavigationGuard({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP' && location.pathname !== '/') {
      // Redirect to home if trying to navigate back from any sub-route
      navigate('/', { replace: true });
    }
  }, [navigationType, location, navigate]);

  return children;
}


export default NavigationGuard;