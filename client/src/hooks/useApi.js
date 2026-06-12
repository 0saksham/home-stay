import { useState, useCallback, useRef } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * useApi — wraps every API call with:
 *  - 3-second wake-up screen trigger for Render cold starts
 *  - 60-second timeout (Render free tier can take up to 50s)
 *  - Unified loading / error state
 */
export const useApi = () => {
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);
  // Keep a ref to cancel the timer across re-renders
  const wakeUpTimer = useRef(null);

  const call = useCallback(async (method, endpoint, data = null, extraConfig = {}) => {
    setIsLoading(true);
    setError(null);

    // Show wake-up overlay after 3 s if server hasn't responded yet
    wakeUpTimer.current = setTimeout(() => {
      setIsWakingUp(true);
    }, 3000);

    try {
      const config = {
        method,
        url: `${BASE_URL}${endpoint}`,
        timeout: 60000,          // 60 s — covers Render worst-case cold start
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json',
        },
        ...extraConfig,
      };
      if (data) config.data = data;

      const response = await axios(config);
      return response.data;

    } catch (err) {
      const msg = err.response?.data?.error
        || err.response?.data?.message
        || (err.code === 'ECONNABORTED' ? 'Request timed out — server may still be waking up.' : 'Something went wrong');
      setError(msg);
      throw err;
    } finally {
      clearTimeout(wakeUpTimer.current);
      setIsWakingUp(false);
      setIsLoading(false);
    }
  }, []);

  return { call, isWakingUp, isLoading, error };
};
