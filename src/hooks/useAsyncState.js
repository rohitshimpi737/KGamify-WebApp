// Centralized loading and error state management hook
import { useState, useCallback } from 'react';

export const useAsyncState = (initialState = {
  data: null,
  loading: false,
  error: null
}) => {
  const [state, setState] = useState(initialState);

  // Set loading state
  const setLoading = useCallback((loading) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  // Set error state
  const setError = useCallback((error) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  // Set success state with data
  const setSuccess = useCallback((data) => {
    setState({ data, loading: false, error: null });
  }, []);

  // Execute async operation with automatic state management
  const executeAsync = useCallback(async (asyncFn) => {
    try {
      setLoading(true);
      const result = await asyncFn();
      setSuccess(result);
      return result;
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setSuccess, setError]);

  // Reset state
  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    executeAsync,
    reset
  };
};

// Centralized API state management hook
export const useApiCall = (apiFunction, dependencies = []) => {
  const { data, loading, error, executeAsync, reset } = useAsyncState();

  const execute = useCallback((...args) => {
    return executeAsync(() => apiFunction(...args));
  }, [executeAsync, apiFunction]);

  // Auto-execute on dependency change (optional)
  const autoExecute = useCallback((...args) => {
    if (dependencies.every(dep => dep != null)) {
      execute(...args);
    }
  }, [execute, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    autoExecute,
    reset
  };
};
