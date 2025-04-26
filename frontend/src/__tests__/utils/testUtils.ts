import { generateTestData } from '@/utils/testDataGenerator';
import { ResearchPaper, Author, Keyword } from '@/types/paper.types';

// Generate a small set of test data for tests
export const getTestPapers = (count = 10): ResearchPaper[] => {
  const testData = generateTestData(count);
  return testData.papers;
};

// Simulate API response format
export const mockApiResponse = <T>(data: T, success = true, message = '') => {
  return {
    success,
    data,
    message,
  };
};

// Mock error response
export const mockApiErrorResponse = (message: string, fieldErrors?: Record<string, string[]>) => {
  return {
    success: false,
    message,
    error: {
      fieldErrors
    }
  };
};

// Helper to create a test paper
export const createTestPaper = (overrides: Partial<ResearchPaper> = {}): ResearchPaper => {
  return {
    id: `paper-${Math.random().toString(36).substring(2, 9)}`,
    slug: `test-paper-${Math.random().toString(36).substring(2, 9)}`,
    title: 'Test Paper Title',
    abstract: 'This is a test abstract for integration testing purposes.',
    publicationDate: new Date().toISOString(),
    authors: [
      {
        id: 'author-1',
        name: 'John Doe',
        affiliation: 'Test University',
        email: 'john@example.com',
        country: 'USA'
      }
    ],
    journal: 'Journal of Testing',
    keywords: [
      { id: 'kw-1', name: 'testing' },
      { id: 'kw-2', name: 'integration' }
    ],
    methodologyType: 'mixed',
    citationCount: 0,
    citationTrend: 'stable',
    doi: '10.1234/test.123',
    downloadUrl: 'https://example.com/test.pdf',
    volume: '1',
    issue: '1',
    pages: '1-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  };
};

// Helper to validate paper format
export const validatePaperFormat = (paper: ResearchPaper) => {
  expect(paper).toHaveProperty('id');
  expect(paper).toHaveProperty('title');
  expect(paper).toHaveProperty('abstract');
  expect(paper).toHaveProperty('publicationDate');
  expect(paper).toHaveProperty('authors');
  expect(Array.isArray(paper.authors)).toBe(true);
  expect(paper).toHaveProperty('journal');
  expect(paper).toHaveProperty('keywords');
  expect(Array.isArray(paper.keywords)).toBe(true);
};

// Mock paper form data
export const createPaperFormData = () => {
  return {
    title: 'Test Paper Title',
    abstract: 'This is a test abstract for the paper form.',
    authors: [
      { name: 'John Doe', affiliation: 'Test University', email: 'john@example.com' }
    ],
    publication_date: new Date().toISOString().split('T')[0],
    methodology_type: 'mixed' as const,
    citation_count: 0,
    citation_trend: 'stable' as const,
    journal: 'Journal of Testing',
    keywords: [
      { name: 'testing' },
      { name: 'integration' }
    ],
    download_url: 'https://example.com/test.pdf',
    doi: '10.1234/test.123',
    volume: '1',
    issue: '1',
    pages: '1-10',
  };
};
