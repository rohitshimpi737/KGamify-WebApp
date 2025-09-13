// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
const DefaultImage = '/images/image.png';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  signUp: () => {},
  error: null,
  clearError: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(DefaultImage);


  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      }
    } catch (err) {
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error function
  const clearError = () => {
    setError(null);
  };

const signUp = async (userData) => {
  setLoading(true);
  try {
    const response = await API.auth.signUp(userData); // Changed from authAPI to API.auth
    console.log("Auth API Response:", response);

    if (response.success) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      return { success: true };
    } else {
      setError(response.error || 'Failed to create account');
      return { 
        success: false, 
        error: response.error || 'Failed to create account'
      };
    }
  } catch (error) {
    console.error("SignUp Error:", error);
    const errorMessage = error.message || 'An unexpected error occurred';
    setError(errorMessage);
    return { 
      success: false, 
      error: errorMessage
    };
  } finally {
    setLoading(false);
  }
};

 // Login function
const login = async (credentials) => {
  setLoading(true);
  setError(null);

  try {
    const result = await API.auth.signIn(credentials);

    if (result.success) {
      // Extract the full user data from the nested API response
      const userData = result.user.userData;
      const fullUserData = {
        ...userData,
        email: userData?.email || credentials.email,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
      };

      setUser(fullUserData);
      localStorage.setItem('user', JSON.stringify(fullUserData));

      return { success: true, message: result.message };
    } else {
      setError(result.error);
      return { success: false, error: result.error };
    }
  } catch (err) {
    const errorMessage = 'Network error. Please check your connection and try again.';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};


  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user?.isAuthenticated,
    loading,
    error,
    login,
    logout,
    signUp,
    clearError,
    profileImage,
    setProfileImage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
