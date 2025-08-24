// Custom hook for centralized user play status management
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';

export const useUserPlayStatus = (challengeId, initialStatus = false) => {
  const { user } = useAuth();
  const [userPlayStatus, setUserPlayStatus] = useState(initialStatus);
  const [checkingPlayStatus, setCheckingPlayStatus] = useState(!initialStatus);
  const [playStatusError, setPlayStatusError] = useState(null);

  // Centralized user ID extraction
  const getUserId = useCallback(() => {
    return user?.userData?.user_id || user?.user_id || user?.userData?.id || user?.id;
  }, [user]);

  
// Inside checkUserPlayStatus function, add logging
const checkUserPlayStatus = useCallback(async () => {
  console.group('🔍 useUserPlayStatus Debug');
  console.log('Initial params:', { challengeId, initialStatus, currentUserId: getUserId() });

  // Skip checks with logging
  if (initialStatus || !challengeId || challengeId === "N/A") {
    console.log('Skipping check:', { initialStatus, challengeId });
    setCheckingPlayStatus(false);
    console.groupEnd();
    return;
  }

  const currentUserId = getUserId();
  if (!currentUserId) {
    console.log('No user ID found');
    setCheckingPlayStatus(false);
    console.groupEnd();
    return;
  }

  try {
    setPlayStatusError(null);
    console.log('Making API call with:', { currentUserId, challengeId });
    
    const playStatusResult = await API.challenge.checkUserPlayed(currentUserId, challengeId);
    console.log('API Response:', playStatusResult);

    if (playStatusResult.success) {
      const hasPlayedData = playStatusResult.hasPlayed;
      let userHasPlayed = false;

      console.log('Processing hasPlayedData:', hasPlayedData);

      // Detailed logging for each condition
      if (Array.isArray(hasPlayedData)) {
        console.log('Array check:', { isArray: true, length: hasPlayedData.length });
        userHasPlayed = hasPlayedData.length > 0;
      } else if (typeof hasPlayedData === 'object' && hasPlayedData !== null) {
        console.log('Object check:', {
          status: hasPlayedData.status,
          message: hasPlayedData.message,
          resultId: hasPlayedData.result_id
        });
        
        userHasPlayed = !!(
          hasPlayedData.status === 200 || 
          hasPlayedData.message?.toLowerCase().includes('already played') ||
          hasPlayedData.message?.toLowerCase().includes('found') ||
          hasPlayedData.result_id
        );
      } else if (typeof hasPlayedData === 'string') {
        console.log('String check:', { value: hasPlayedData });
        userHasPlayed = (
          hasPlayedData.toLowerCase().includes('found') || 
          hasPlayedData.toLowerCase().includes('already played')
        );
      }

      console.log('Final userHasPlayed value:', userHasPlayed);
      setUserPlayStatus(userHasPlayed);
      
    } else if (playStatusResult.status === 409) {
      console.log('409 Response:', playStatusResult.data);
      setUserPlayStatus(false);
    } else {
      console.warn('Unexpected response:', playStatusResult);
      setPlayStatusError('Failed to check play status');
    }
  } catch (error) {
    console.error('Error in checkUserPlayStatus:', error);
    setPlayStatusError('Error checking play status');
  } finally {
    setCheckingPlayStatus(false);
    console.groupEnd();
  }
}, [challengeId, initialStatus, getUserId]);

  // Effect to check play status
  useEffect(() => {
    checkUserPlayStatus();
  }, [checkUserPlayStatus]);

  // Refresh function for manual refresh
  const refreshPlayStatus = useCallback(() => {
    setCheckingPlayStatus(true);
    setPlayStatusError(null);
    checkUserPlayStatus();
  }, [checkUserPlayStatus]);

  return {
    userPlayStatus,
    checkingPlayStatus,
    playStatusError,
    refreshPlayStatus,
    getUserId
  };
};
