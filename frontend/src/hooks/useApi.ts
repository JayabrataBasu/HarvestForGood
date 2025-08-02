import { useState, useEffect, useCallback } from 'react';
import { AxiosResponse, AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => void;
  reset: () => void;
}

export function useApi<T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  immediate: boolean = true
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      setState({
        data: null,
        loading: false,
        error:
          typeof axiosError.response?.data === 'object' && axiosError.response?.data && 'detail' in axiosError.response.data
            ? ((axiosError.response.data as { detail?: string }).detail ?? axiosError.message ?? 'An error occurred')
            : axiosError.message || 'An error occurred',
      });
    }
  }, [apiCall]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    ...state,
    refetch,
    reset,
  };
}
