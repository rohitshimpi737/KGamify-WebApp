// Utility functions for challenge data processing
export const extractUserId = (user) => {
  return user?.userData?.user_id || user?.user_id || user?.userData?.id || user?.id;
};

export const validateChallengeData = (challenge) => {
  if (!challenge) return null;
  
  return {
    id: challenge?.id || "N/A",
    unique_id: challenge?.unique_id || `unique-${challenge?.id || "N/A"}`,
    title: challenge?.title || "Challenge",
    subtitle: challenge?.subtitle || "Championship", 
    category: challenge?.category || "General",
    status: challenge?.status || "upcoming",
    details: {
      questions: challenge?.details?.questions || "Questions",
      duration: challenge?.details?.duration || "Duration",
      participants: challenge?.details?.participants || "0 participants"
    },
    eligibility: Array.isArray(challenge?.eligibility) ? challenge.eligibility : ["All Students"],
    timings: {
      starts: challenge?.timings?.starts || "TBD",
      ends: challenge?.timings?.ends || "TBD"
    },
    teacher: challenge?.teacher || {},
    detailedData: challenge?.detailedData || {}
  };
};

export const parseUserPlayResponse = (hasPlayedData) => {
  if (!hasPlayedData) return false;

  // Array response - if length > 0, user has played
  if (Array.isArray(hasPlayedData) && hasPlayedData.length > 0) {
    return true;
  }

  // Object response - check multiple indicators
  if (typeof hasPlayedData === 'object' && hasPlayedData !== null) {
    if (hasPlayedData.status === 200 || 
        hasPlayedData.message?.toLowerCase().includes('already played') ||
        hasPlayedData.message?.toLowerCase().includes('found') ||
        hasPlayedData.result_id) {
      return true;
    }
  }

  // String response - check message content
  if (typeof hasPlayedData === 'string' && 
      (hasPlayedData.toLowerCase().includes('found') || 
       hasPlayedData.toLowerCase().includes('already played'))) {
    return true;
  }

  return false;
};

export const getStatusStyle = (status) => {
  const statusMap = {
    ongoing: "bg-green-500",
    upcoming: "bg-yellow-500", 
    completed: "bg-red-500",
    ended: "bg-red-500"
  };
  return statusMap[status?.toLowerCase()] || "bg-gray-500";
};

export const getParticipantCount = (participantText) => {
  if (typeof participantText === 'string' && participantText.includes(' ')) {
    return participantText.split(" ")[0];
  }
  return "0";
};

// ===========================
// CENTRALIZED UTILITY FUNCTIONS
// ===========================

// Time parsing utility - used across analytics components
export const parseTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  if (typeof timeStr === 'number') return timeStr;
  
  // Handle format "00:00:09" or "15sec"
  if (timeStr.includes(':')) {
    const parts = timeStr.split(':');
    if (parts.length === 3) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
  } else if (timeStr.includes('sec')) {
    return parseInt(timeStr.replace('sec', '')) || 0;
  }
  return parseInt(timeStr) || 0;
};

// Format time for display - centralized function
export const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '0sec';
  if (typeof timeStr === 'string' && timeStr.includes(':')) {
    return timeStr;
  }
  // Convert seconds to display format
  const totalSeconds = parseTimeToSeconds(timeStr);
  if (totalSeconds < 60) {
    return `${totalSeconds}sec`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Centralized date formatting
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  
  const defaultOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

// Calculate days ago from date
export const getDaysAgo = (endDate) => {
  if (!endDate) return "Recently";
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = Math.abs(now - end);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
};

// Determine challenge type from API data
export const getChallengeType = (item) => {
  if (item.mode_name === 'quick_hit' || item.game_mode === 'quick_hit') {
    return "Quick hit";
  }
  return item.game_mode || item.type || item.mode_name || "Play and Win";
};

// Transform analytics data with consistent sorting
export const transformAnalyticsData = (apiData) => {
  if (!Array.isArray(apiData)) return [];
  
  const transformedData = apiData.map(item => ({
    id: item.champ_id || item.id,
    type: getChallengeType(item),
    title: item.champ_name || item.title,
    category: item.category_name || item.champ_category || item.category,
    description: item.champ_description || item.description || "",
    status: item.status || "Ended",
    start: item.start_date || item.start,
    end: item.end_date || item.end,
    score: parseFloat(item.total_score || item.score || 0),
    reward: item.reward || item.has_reward || false,
  }));

  // Sort by end date (latest first), then by start date if end date is not available
  return transformedData.sort((a, b) => {
    const dateA = new Date(a.end || a.start || 0);
    const dateB = new Date(b.end || b.start || 0);
    return dateB - dateA; // Latest first (descending order)
  });
};

// Centralized color utilities
export const getScoreColor = (score, isNegative = false) => {
  if (score < 0 || isNegative) return 'text-red-500';
  if (score > 0) return 'text-green-600';
  return 'text-gray-600';
};
