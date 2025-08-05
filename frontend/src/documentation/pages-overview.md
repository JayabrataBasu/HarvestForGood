# Frontend Features Documentation

## Component Structure and Features

### 1. Research Components

#### PaperCard.tsx

- Displays individual research paper information in a card format
- Shows title, authors, abstract, and metadata
- Handles user interactions like clicking for more details
- Potentially includes actions (save, share, download)

#### PaperFilter.tsx

- Provides advanced filtering capabilities
- Filter options include:
  - Date range
  - Research categories/topics
  - Author names
  - Keywords
- Real-time filter updates

#### PaperGrid.tsx

- Responsive grid layout for paper cards
- Handles pagination or infinite scroll
- Manages layout responsiveness
- Optimizes rendering for large datasets

### 2. Pages

#### ResearchPapers.tsx

- Main container page for research paper browsing
- Integrates PaperFilter, PaperGrid, and Search components
- Manages state for:
  - Current filter settings
  - Search queries
  - Selected papers
  - Pagination state

### 3. Search Functionality

#### index.tsx

- Implements search bar interface
- Handles search queries and results
- Features:
  - Auto-complete suggestions
  - Search history
  - Advanced search options
  - Real-time search results

### 4. Types and Data Models

#### paper.types.ts

- Core data interfaces for paper-related features
- Type definitions for:
  - Paper metadata
  - Search parameters
  - Filter options
  - API responses

## Component Interactions

- PaperFilter → ResearchPapers: Emits filter changes
- Search → ResearchPapers: Provides search results  
- ResearchPapers → PaperGrid: Passes filtered/searched paper data
- PaperCard ↔ ResearchPapers: Handles paper selection and interactions

## Data Flow

1. User initiates search or applies filters
2. ResearchPapers component coordinates data fetching
3. Updated data flows to PaperGrid
4. Individual PaperCards render with new data

## Performance Considerations

- Pagination/infinite scroll for large datasets
- Debounced search and filter operations
- Optimized re-rendering strategies
- Caching of frequently accessed data

## Debugging Guide

When "No papers found" appears:
1. Check browser console for API response logs
2. Verify filter parameter mapping between frontend and backend
3. Ensure backend API returns proper data structure
4. Check for type mismatches in date/year fields
5. Verify keyword and methodology field mappings
6. **CRITICAL**: Ensure PaperGrid.tsx is NOT doing client-side filtering on already server-filtered results
   - The API handles all filtering server-side and returns filtered results
   - Client-side filtering in PaperGrid can cause double filtering, resulting in empty results
   - PaperGrid should display papers as-is from the API response
7. Check console logs for "Applying filters" and "API Response" to see filter flow
8. Verify that filter parameters match exactly between frontend requests and backend expectations
   - Keywords should match case sensitivity
   - Methodology types should use exact backend values
   - Date formats should be consistent
