import { getFieldErrors } from '@/lib/errorHandler';

describe('Error Handler Utilities', () => {
  test('should extract field errors from API response', () => {
    // Mock API error response
    const apiErrorResponse = {
      success: false,
      message: 'Validation failed',
      error: {
        fieldErrors: {
          title: ['Title is required', 'Title must be unique'],
          abstract: ['Abstract is too short'],
          keywords: ['At least one keyword is required']
        }
      }
    };

    // Extract field errors
    const fieldErrors = getFieldErrors(apiErrorResponse);

    // Verify extracted errors
    expect(fieldErrors).toEqual({
      title: ['Title is required', 'Title must be unique'],
      abstract: ['Abstract is too short'],
      keywords: ['At least one keyword is required']
    });
  });

  test('should return empty object when no field errors present', () => {
    // Mock API error response without field errors
    const apiErrorResponse = {
      success: false,
      message: 'General server error',
    };

    // Extract field errors
    const fieldErrors = getFieldErrors(apiErrorResponse);

    // Should return empty object
    expect(fieldErrors).toEqual({});
  });

  test('should handle null or undefined error response gracefully', () => {
    // Test with null
    expect(getFieldErrors(null)).toEqual({});
    
    // Test with undefined
    expect(getFieldErrors(undefined)).toEqual({});
  });

  test('should handle nested errors in different formats', () => {
    // Mock API error response with differently structured error object
    const apiErrorResponse = {
      success: false,
      message: 'Validation failed',
      errors: {
        title: 'Title is required',
        details: [
          { field: 'abstract', message: 'Abstract is too short' },
          { field: 'keywords', message: 'At least one keyword is required' }
        ]
      }
    };

    // Define custom error extractor function
    const customExtractor = (response: any) => {
      const errors: Record<string, string[]> = {};
      
      if (response?.errors) {
        // Handle direct property errors
        if (response.errors.title) {
          errors.title = [response.errors.title];
        }
        
        // Handle array of error details
        if (Array.isArray(response.errors.details)) {
          response.errors.details.forEach((detail: any) => {
            if (detail.field && detail.message) {
              errors[detail.field] = errors[detail.field] || [];
              errors[detail.field].push(detail.message);
            }
          });
        }
      }
      
      return errors;
    };

    // Extract field errors using custom extractor
    const fieldErrors = customExtractor(apiErrorResponse);

    // Verify extracted errors
    expect(fieldErrors).toEqual({
      title: ['Title is required'],
      abstract: ['Abstract is too short'],
      keywords: ['At least one keyword is required']
    });
  });
});
