/**
 * Error handling utility for API requests
 */

export interface ErrorResponse {
  status: number;
  message: string;
  details?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Handle API errors consistently across the application
 * @param error The error caught in the catch block
 * @returns Standardized error object
 */
export const handleApiError = (error: unknown): ErrorResponse => {
  console.error('API Error:', error);
  
  // Handle Response objects (fetch API throws these)
  if (error instanceof Response) {
    return {
      status: error.status,
      message: `Request failed: ${error.statusText}`,
    };
  }
  
  // Handle Error objects (including custom errors)
  if (error instanceof Error) {
    // Try to parse the error message as JSON for DRF validation errors
    try {
      const parsedError = JSON.parse(error.message);
      
      // Check if it's a Django Rest Framework validation error
      if (typeof parsedError === 'object' && parsedError !== null) {
        // Handle field-specific validation errors
        if (Object.keys(parsedError).some(key => Array.isArray(parsedError[key]))) {
          return {
            status: 400,
            message: 'Validation error',
            fieldErrors: parsedError as Record<string, string[]>,
          };
        }
        
        // Handle non-field errors
        if (parsedError.detail) {
          return {
            status: 400,
            message: parsedError.detail,
          };
        }
        
        // Handle other JSON error formats
        if (parsedError.message) {
          return {
            status: 400,
            message: parsedError.message,
          };
        }
      }
    } catch {
      // Not a JSON error, just use the error message
    }
    
    return {
      status: 500,
      message: 'An error occurred',
      details: error.message,
    };
  }
  
  // Handle unknown error types
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

/**
 * Extract field error messages from API response
 * @param error The processed error response
 * @param fieldName The field name to get errors for
 * @returns Array of error messages or empty array
 */
export const getFieldErrors = (
  error: ErrorResponse | undefined,
  fieldName: string
): string[] => {
  if (!error || !error.fieldErrors || !error.fieldErrors[fieldName]) {
    return [];
  }
  
  return error.fieldErrors[fieldName];
};
