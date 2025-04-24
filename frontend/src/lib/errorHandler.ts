/**
 * Error handling utility for API requests
 */

interface ErrorResponse {
  status: number;
  message: string;
  details?: string;
}

/**
 * Handle API errors consistently across the application
 * @param error The error caught in the catch block
 * @returns Standardized error object
 */
export const handleApiError = (error: unknown): ErrorResponse => {
  console.error('API Error:', error);
  
  if (error instanceof Response) {
    return {
      status: error.status,
      message: `Request failed: ${error.statusText}`,
    };
  }
  
  if (error instanceof Error) {
    return {
      status: 500,
      message: 'An error occurred',
      details: error.message,
    };
  }
  
  return {
    status: 500,
    message: 'An unknown error occurred',
  };
};

/**
 * Handles 429 Too Many Requests errors by implementing exponential backoff
 * @param retryFn The function to retry
 * @param maxRetries Maximum number of retry attempts
 * @returns Result of the function or throws after max retries
 */
export const retryWithBackoff = async <T>(
  retryFn: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await retryFn();
    } catch (error) {
      if (error instanceof Response && error.status === 429) {
        retries++;
        if (retries >= maxRetries) throw error;
        
        // Exponential backoff: wait longer after each retry
        const waitTime = Math.pow(2, retries) * 1000;
        console.log(`Rate limited. Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  
  throw new Error('Maximum retries exceeded');
};
