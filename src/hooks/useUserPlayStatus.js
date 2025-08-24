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

  // Centralized play status checking logic
  const checkUserPlayStatus = useCallback(async () => {
    // Skip if we already know the status or missing required data
    if (initialStatus || !challengeId || challengeId === "N/A") {
      setCheckingPlayStatus(false);
      return;
    }

    const currentUserId = getUserId();
    if (!currentUserId) {
      setCheckingPlayStatus(false);
      return;
    }

    try {
      setPlayStatusError(null);
      const playStatusResult = await API.challenge.checkUserPlayed(currentUserId, challengeId);

      // Handle both success and specific "User can play" responses
      if (playStatusResult.success) {
        const hasPlayedData = playStatusResult.hasPlayed;
        let userHasPlayed = false;

        // Centralized response parsing logic
        if (Array.isArray(hasPlayedData) && hasPlayedData.length > 0) {
          userHasPlayed = true;
        } else if (typeof hasPlayedData === 'object' && hasPlayedData !== null) {
          // Check multiple indicators
          if (hasPlayedData.status === 200 || 
              hasPlayedData.message?.toLowerCase().includes('already played') ||
              hasPlayedData.message?.toLowerCase().includes('found') ||
              hasPlayedData.result_id) {
            userHasPlayed = true;
          }
        } else if (typeof hasPlayedData === 'string' && 
                   (hasPlayedData.toLowerCase().includes('found') || 
                    hasPlayedData.toLowerCase().includes('already played'))) {
          userHasPlayed = true;
        }

        setUserPlayStatus(userHasPlayed);
      } else if (playStatusResult.status === 409 && 
                 playStatusResult.data?.message?.toLowerCase().includes('user can play')) {
        // 409 "User can play" is valid - user hasn't played
        setUserPlayStatus(false);
      } else {
        // Only set error for actual failures
        setPlayStatusError('Failed to check play status');
      }
    } catch (error) {
      setPlayStatusError('Error checking play status');
    } finally {
      setCheckingPlayStatus(false);
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
