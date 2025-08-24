// ===========================
// CONFIGURATION
// ===========================
import md5 from 'md5';

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://kgamify.in/championshipmaker/apis";

// ===========================
// CACHING SYSTEM
// ===========================
const apiCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Generates a unique cache key for API requests
 * @param {string} url - The API endpoint URL
 * @param {Object} params - Additional parameters for the request
 * @returns {string} Unique cache key
 */
const getCacheKey = (url, params = {}) => {
  const paramStr = JSON.stringify(params);
  return `${url}_${paramStr}`;
};

/**
 * Retrieves cached data if still valid
 * @param {string} cacheKey - The cache key to lookup
 * @returns {any|null} Cached data or null if expired/missing
 */
const getCachedData = (cacheKey) => {
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

/**
 * Stores data in cache with timestamp
 * @param {string} cacheKey - The cache key
 * @param {any} data - The data to cache
 */
const setCachedData = (cacheKey, data) => {
  apiCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Extracts user ID from localStorage
 * @returns {string|null} User ID or null if not found
 */
const getUserId = () => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.user_id || user.id || user.userId || user.email || null;
    }
  } catch (err) {
    console.warn("Failed to extract user ID:", err.message);
  }
  return null;
};

// ===========================
// CORE API REQUEST HANDLER
// ===========================

/**
 * Makes HTTP requests to the API
 * @param {string} endpoint - The API endpoint path
 * @returns {Promise<Object>} API response object with success, data, and status
 */
const apiRequest = async (endpoint) => {
  try {
    const baseUrl = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : "/" + endpoint;
    const url = `${baseUrl}${normalizedEndpoint}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const rawData = await res.text();

    let parsedData;
    try {
      parsedData = JSON.parse(rawData);
    } catch (parseError) {
      if (!res.ok) {
        return {
          success: false,
          error: `Server error: ${res.status} - ${rawData || "Unknown error"}`,
          status: res.status,
        };
      }
      parsedData = rawData;
    }

    return { success: res.ok, data: parsedData, status: res.status };
  } catch (err) {
    return {
      success: false,
      error: `Network error: ${err.message}`,
      status: 0,
    };
  }
};

// ===========================
// AUTHENTICATION APIs
// ===========================

/**
 * Authentication service with user registration and login functionality
 */
const authAPI = {
  /**
   * Registers a new user account
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.password - User's password
   * @param {string} userData.phone - User's phone number
   * @param {string} [userData.qualification=''] - User's qualification (optional)
   * @returns {Promise<Object>} Registration response with success status and user data
   */


  signUp: async ({ firstName, lastName, email, password, phone }) => {
    try {
      const name = `${firstName} ${lastName}`;
      const hashedPassword = md5(password);

      const queryParams = new URLSearchParams({
        user_name: name,
        email,
        password: hashedPassword,
        phone_no: phone,
        qualification: null,
      }).toString();

      console.log("SignUp Request:", queryParams); // Add this for debugging

      const res = await apiRequest(`/post_user_data.php?${queryParams}`);
      console.log("SignUp Response:", res); // Add this for debugging

      if (res.success) {
        return {
          success: true,
          message: "Account created successfully!",
          user: {
            name,
            email,
            phone,
            isAuthenticated: true,
            loginTime: new Date().toISOString(),
          },
        };
      } else {
        throw new Error(res.error || 'Signup failed');
      }
    } catch (error) {
      console.error("API SignUp Error:", error); // Add this for debugging
      throw error;
    }
  },


  /**
   * Authenticates existing user with email and password
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User's email address
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Authentication response with user data and session info
   */

  signIn: async ({ email, password }) => {

    const hashedPassword = md5(password);

    const queryParams = new URLSearchParams({
      email,
      password: hashedPassword,
    }).toString();

    const res = await apiRequest(`/check_user_data.php?${queryParams}`);

    let isValidLogin = false;

    if (res.success) {
      if (typeof res.data === "object" && res.data !== null) {
        isValidLogin =
          res.data.status === 200 ||
          res.data.message === "User Found" ||
          (res.data.message &&
            res.data.message.toLowerCase().includes("found"));
      } else {
        isValidLogin = /success|valid|found/i.test(res.data);
      }
    }

    return isValidLogin
      ? {
        success: true,
        message: "Login successful!",
        user: {
          email,
          userData: res.data?.data || null,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        },
      }
      : { success: false, error: "Invalid credentials" };
  },

  /**
   * Send password reset email to user
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Response with success status and message
   */
  forgotPassword: async (email) => {
    const cacheKey = getCacheKey('/forgot_password.php', { email });

    try {
      const queryParams = new URLSearchParams({
        email: email.trim()
      }).toString();

      const res = await apiRequest(`/forgot_password.php?${queryParams}`);

      return res.success
        ? {
          success: true,
          message: res.message || "Password reset instructions have been sent to your email address"
        }
        : {
          success: false,
          error: res.error || res.message || "Failed to send reset email"
        };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process forgot password request'
      };
    }
  },
};

// ===========================
// USER PROFILE MANAGEMENT
// ===========================

/**
 * User profile management service for personal data and preferences
 */
const userAPI = {
  /**
   * Updates user's personal information
   * @param {Object} userData - Updated user data
   * @param {string} userData.userId - User's unique identifier
   * @param {string} userData.name - User's full name
   * @param {string} userData.email - User's email address
   * @param {string} userData.age - User's age
   * @param {string} userData.location - User's location
   * @param {string} userData.phoneNo - User's phone number
   * @param {string} userData.interests - User's interests/hobbies
   * @returns {Promise<Object>} Update response with success status
   */
  updatePersonalData: async ({
    userId,
    name,
    email,
    age,
    location,
    phoneNo,
    interests,
  }) => {
    // Always send all fields, even if empty, to ensure complete update
    const params = {
      user_id: userId || "",
      name: name || "",
      email: email || "",
      age: age || "",
      location: location || "",
      phone_no: phoneNo || "",
      interests: interests || "",
    };

    const queryParams = new URLSearchParams(params).toString();
    const res = await apiRequest(`/post_personal_data.php?${queryParams}`);

    return res.success
      ? {
        success: true,
        message: "Personal data updated successfully!",
        data: res.data,
      }
      : {
        success: false,
        error: res.error || "Failed to update personal data",
      };
  },

  /**
   * Updates user's educational qualification details
   * @param {Object} qualificationData - Educational qualification information
   * @param {string} qualificationData.userId - User's unique identifier
   * @param {string} qualificationData.qualification - Qualification level
   * @param {string} qualificationData.educationType - Type of education
   * @param {string} qualificationData.instituteName - Name of educational institution
   * @param {string} qualificationData.boardName - Board/University name
   * @param {string} qualificationData.passingYear - Year of completion
   * @param {string} qualificationData.percentage - Academic percentage/grade
   * @param {boolean} qualificationData.isHighest - Whether this is the highest qualification
   * @returns {Promise<Object>} Update response with success status
   */
  updateQualificationDetails: async ({
    userId,
    qualification,
    educationType,
    instituteName,
    boardName,
    passingYear,
    percentage,
    isHighest,
  }) => {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    // Build params manually to match exact working format
    const paramsList = [
      `user_id=${encodeURIComponent(userId)}`,
      `qualification=${encodeURIComponent(qualification || "")}`,
      `education_type=${encodeURIComponent(
        educationType || qualification || ""
      )}`,
      `institute_name=${instituteName ? encodeURIComponent(instituteName) : "null"
      }`,
      `board_name=${boardName ? encodeURIComponent(boardName) : "null"}`,
      `passing_year=${passingYear ? encodeURIComponent(passingYear) : "null"}`,
      `percentage=${percentage ? encodeURIComponent(percentage) : "null"}`,
      `is_highest=${isHighest ? "1" : "0"}`,
    ];

    const queryString = paramsList.join("&");
    const res = await apiRequest(
      `/post_qualification_details.php?${queryString}`
    );

    return res.success
      ? {
        success: true,
        message: "Qualification details updated successfully!",
        data: res.data,
      }
      : {
        success: false,
        error:
          res.error ||
          `Failed to update qualification details. Server responded with: ${res.status
          }. Response: ${JSON.stringify(res.data)}`,
      };
  },

  /**
   * Updates complete user profile including personal and qualification data
   * @param {Object} profileData - Complete profile information
   * @param {Object} [profileData.personalData] - Personal information to update
   * @param {Object} [profileData.qualificationData] - Qualification information to update
   * @returns {Promise<Object>} Combined update response with success status and detailed results
   */
  updateProfile: async (profileData) => {
    const { personalData, qualificationData } = profileData;

    try {
      const results = [];

      if (personalData) {
        const personalResult = await userAPI.updatePersonalData(personalData);
        results.push(personalResult);
      }

      if (qualificationData) {
        const qualificationResult = await userAPI.updateQualificationDetails(
          qualificationData
        );
        results.push(qualificationResult);
      }

      const allSuccessful = results.every((result) => result.success);

      return allSuccessful
        ? {
          success: true,
          message: "Profile updated successfully!",
          results,
        }
        : {
          success: false,
          error: "Some profile updates failed",
          results,
        };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },
};

// ===========================
// QUIZ MANAGEMENT
// ===========================

/**
 * Quiz operations service for questions, submissions, and results
 */
const quizAPI = {
  /**
   * Retrieves quiz questions for a specific mode with caching
   * @param {string|number} modeId - Quiz mode identifier
   * @returns {Promise<Object>} Quiz questions response with caching support
   */
  getQuestions: async (modeId) => {
    const cacheKey = getCacheKey("/get_question.php", { mode_id: modeId });

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams({
      mode_id: modeId,
    }).toString();

    const res = await apiRequest(`/get_question.php?${queryParams}`);

    const result = res.success
      ? {
        success: true,
        questions: res.data?.data || res.data,
      }
      : { success: false, error: res.error || "Failed to fetch questions" };

    // Cache successful responses
    if (result.success) {
      setCachedData(cacheKey, result);
    }

    return result;
  },

  /**
   * Submits quiz answer result with enhanced scoring validation
   * @param {Object} resultData - Quiz submission data
   * @param {string|number} resultData.questionId - Question identifier
   * @param {string|number} resultData.champId - Championship/challenge identifier
   * @param {string} resultData.userId - User identifier
   * @param {number} resultData.timeTaken - Time taken to answer (seconds)
   * @param {number} resultData.expectedTime - Expected answer time (seconds)
   * @param {number} resultData.pointsEarned - Points earned for the answer
   * @param {string} resultData.correctAns - Correct answer
   * @param {string} resultData.submittedAns - User's submitted answer
   * @returns {Promise<Object>} Submission response with success status
   */
  submitResult: async ({
    questionId,
    champId,
    userId,
    timeTaken,
    expectedTime,
    pointsEarned,
    correctAns,
    submittedAns,
  }) => {
    let safePointsEarned = 0;

    if (pointsEarned !== null && pointsEarned !== undefined) {
      safePointsEarned = Number(pointsEarned);
      if (isNaN(safePointsEarned)) {
        safePointsEarned = 0;
      }
    } else {
      safePointsEarned = 0.01;
    }

    safePointsEarned = Math.round(safePointsEarned * 100) / 100;

    if (safePointsEarned === 0) {
      safePointsEarned = 0.01;
    }

    const params = {
      question_id: String(questionId),
      champ_id: String(champId),
      user_id: String(userId),
      time_taken: String(timeTaken),
      expected_time: String(expectedTime),
      points_earned: String(safePointsEarned), // FIXED: Never exactly 0
      correct_ans: String(correctAns),
      submitted_ans: String(submittedAns),
    };

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const res = await apiRequest(`/post_result.php?${queryString}`);

    return res.success
      ? {
        success: true,
        result: res.data?.data || res.data,
      }
      : { success: false, error: res.error || "Failed to submit result" };
  },

  /**
   * Reports a question as incorrect or problematic
   * @param {Object} reportData - Question report data
   * @param {string|number} reportData.questionId - Question identifier
   * @param {string|number} reportData.champId - Championship identifier
   * @param {string|number} reportData.teacherId - Teacher identifier
   * @param {string} reportData.userId - User identifier
   * @returns {Promise<Object>} Report submission response
   */
  submitWrongQuestion: async ({ questionId, champId, teacherId, userId }) => {
    const queryParams = new URLSearchParams({
      question_id: questionId,
      champ_id: champId,
      teacher_id: teacherId,
      user_id: userId,
    }).toString();

    const res = await apiRequest(`/post_wrong_questions.php?${queryParams}`);

    return res.success
      ? {
        success: true,
        result: res.data?.data || res.data,
      }
      : {
        success: false,
        error: res.error || "Failed to submit wrong question",
      };
  },

  /**
   * Submits final quiz results with comprehensive scoring data
   * @param {Object} finalData - Complete quiz session results
   * @param {string|number} finalData.champId - Championship identifier
   * @param {string} finalData.userId - User identifier
   * @param {number} finalData.timeTaken - Total time taken
   * @param {number} finalData.expectedTime - Expected completion time
   * @param {string} finalData.gameMode - Game mode identifier
   * @param {number} finalData.totalQuestions - Total number of questions
   * @param {number} finalData.correctQuestions - Number of correct answers
   * @param {number} finalData.totalScore - Total score achieved
   * @param {number} finalData.totalBonus - Total bonus points
   * @param {number} finalData.totalPenalty - Total penalty points
   * @param {number} finalData.totalNegativePoints - Total negative points
   * @returns {Promise<Object>} Final submission response
   */
  submitFinalResult: async ({
    champId,
    userId,
    timeTaken,
    expectedTime,
    gameMode,
    totalQuestions,
    correctQuestions,
    totalScore,
    totalBonus,
    totalPenalty,
    totalNegativePoints,
  }) => {
    const queryParams = new URLSearchParams({
      champ_id: champId,
      user_id: userId,
      time_taken: timeTaken,
      expected_time: expectedTime,
      game_mode: gameMode,
      total_questions: totalQuestions,
      correct_questions: correctQuestions,
      total_score: totalScore,
      total_bonus: totalBonus,
      total_penalty: totalPenalty,
      total_negative_points: totalNegativePoints,
    }).toString();

    const res = await apiRequest(`/post_final_result.php?${queryParams}`);
    console.log("   Data:", res.data);

    return res.success
      ? {
        success: true,
        result: res.data?.data || res.data,
      }
      : { success: false, error: res.error || "Failed to submit final result" };
  },
};

// ===========================
// CHALLENGE MANAGEMENT
// ===========================

/**
 * Challenge data service for retrieving and managing educational challenges
 */

const challengeAPI = {
  getAllCategories: async () => {
    try {
      console.log('Fetching categories...');
      const res = await apiRequest('/get_category.php');
      console.log('Categories response:', res);

      if (!res.success) {
        console.warn('getAllCategories failed:', res.error || res);
        return [];
      }

      const categories = Array.isArray(res.data?.data) ? res.data.data : 
                        Array.isArray(res.data) ? res.data : [];
      
      console.log(`Found ${categories.length} categories:`, categories);
      return categories;
    } catch (error) {
      console.error('getAllCategories error:', error);
      return [];
    }
  },

  getChallengeDetails: async (champId) => {
    try {
      console.log(`Fetching details for challenge ${champId}...`);
      const res = await apiRequest(`/fetch_details.php?champ_id=${encodeURIComponent(champId)}`);
      console.log(`Challenge ${champId} response:`, res);

      // Handle 469 and 500 errors explicitly
      if (res.status === 469 || res.status === 500) {
        console.warn(`Challenge ${champId} not found or error:`, res.status);
        return null;
      }

      if (!res.success) {
        console.warn(`getChallengeDetails(${champId}) failed:`, res.error || res);
        return null;
      }

      const details = Array.isArray(res.data?.data) && res.data.data.length > 0 ? res.data.data[0] :
                     Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;

      console.log(`Challenge ${champId} details:`, details);
      return details;
    } catch (error) {
      console.error(`getChallengeDetails error for ${champId}:`, error);
      return null;
    }
  },

   getChampionshipDetails: async (champId) => {
    const cacheKey = getCacheKey("/fetch_details.php", { champ_id: champId });

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams({
      champ_id: champId,
    }).toString();

    const res = await apiRequest(`/fetch_details.php?${queryParams}`);

    const result = res.success
      ? {
          success: true,
          championship: res.data?.data || res.data,
        }
      : {
          success: false,
          error: res.error || "Failed to fetch championship details",
        };

    // Cache successful responses
    if (result.success) {
      setCachedData(cacheKey, result);
    }

    return result;
  },
  

  /**
   * Checks if a user has played a specific championship
   * @param {string} userId - User identifier
   * @param {string|number} champId - Championship identifier
   * @returns {Promise<Object>} User play status response with caching
   */
  checkUserPlayed: async (userId, champId) => {
    const cacheKey = getCacheKey("/check_user_played.php", {
      user_id: userId,
      champ_id: champId,
    });

    // Check cache first (shorter cache duration for user play status)
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams({
      user_id: userId,
      champ_id: champId,
    }).toString();

    const res = await apiRequest(`/check_user_played.php?${queryParams}`);

    const result = res.success
      ? {
        success: true,
        hasPlayed: res.data?.data || res.data,
      }
      : {
        success: false,
        error: res.error || "Failed to check user play status",
      };

    // Cache successful responses
    if (result.success) {
      setCachedData(cacheKey, result);
    }

    return result;
  },
};

// ===========================
// ANALYTICS & REPORTING
// ===========================

const analyticsAPI = {
  /**
   * Retrieves comprehensive analytics for a specific user
   * @param {string} userId - User identifier
   * @returns {Promise<Object>} User analytics response with performance metrics and caching
   */
  getUserAnalytics: async (userId) => {
    const cacheKey = getCacheKey("/get_analytics.php", { user_id: userId });

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams({
      user_id: userId,
    }).toString();

    const res = await apiRequest(`/get_analytics.php?${queryParams}`);

    const result = res.success
      ? {
        success: true,
        analytics: res.data?.data || res.data,
      }
      : {
        success: false,
        error: res.error || "Failed to fetch user analytics",
      };

    // Cache successful responses
    if (result.success) {
      setCachedData(cacheKey, result);
    }

    return result;
  },

  /**
   * Retrieves detailed analytics for user performance per question in a championship
   * @param {string} userId - User identifier
   * @param {string|number} champId - Championship identifier
   * @returns {Promise<Object>} Per-question analytics response with detailed performance metrics
   */
  getAnalyticsPerQuestion: async (userId, champId) => {
    const cacheKey = getCacheKey("/get_analytics_per_question.php", {
      user_id: userId,
      champ_id: champId,
    });

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams({
      user_id: userId,
      champ_id: champId,
    }).toString();

    const res = await apiRequest(
      `/get_analytics_per_question.php?${queryParams}`
    );

    const result = res.success
      ? {
        success: true,
        questionAnalytics: res.data?.data || res.data,
      }
      : {
        success: false,
        error: res.error || "Failed to fetch question analytics",
      };

    // Cache successful responses
    if (result.success) {
      setCachedData(cacheKey, result);
    }

    return result;
  },

  /**
   * Retrieves leaderboard rankings for a specific championship
   * @param {string|number} champId - Championship identifier
   * @returns {Promise<Object>} Leaderboard response with user rankings and scores
   */
  getLeaderboard: async (champId) => {
    const cacheKey = getCacheKey("/get_leaderboard.php", { champ_id: champId });

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams({
      champ_id: champId,
    }).toString();

    const res = await apiRequest(`/get_leaderboard.php?${queryParams}`);

    const result = res.success
      ? {
        success: true,
        leaderboard: res.data?.data || res.data,
      }
      : { success: false, error: res.error || "Failed to fetch leaderboard" };

    // Cache successful responses
    if (result.success) {
      setCachedData(cacheKey, result);
    }

    return result;
  },
};

// ===========================
// TEACHER INFORMATION
// ===========================

const teacherAPI = {
  /**
   * Retrieves detailed information for a specific teacher (privacy-compliant)
   * @param {string|number} teacherId - Teacher identifier
   * @returns {Promise<Object>} Teacher details response excluding sensitive information
   */

  getTeacherDetails: async (teacherId) => {
    const cacheKey = getCacheKey("/get_teacher_details.php", {
      teacher_id: teacherId,
    });

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const queryParams = new URLSearchParams({
      teacher_id: teacherId,
    }).toString();

    const res = await apiRequest(`/get_teacher_details.php?${queryParams}`);

    const result = res.success
      ? {
        success: true,
        teacher: res.data?.data || res.data,
      }
      : {
        success: false,
        error: res.error || "Failed to fetch teacher details",
      };

    // Cache successful responses
    if (result.success) {
      setCachedData(cacheKey, result);
    }

    return result;
  },
};

// ===========================
// API SERVICE EXPORTS
// ===========================

export { authAPI, userAPI, getUserId };

export default {
  auth: authAPI,
  user: userAPI,
  quiz: quizAPI,
  challenge: challengeAPI,
  analytics: analyticsAPI,
  teacher: teacherAPI,
  getUserId,
};
