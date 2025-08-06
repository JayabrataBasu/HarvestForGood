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
- **Client-side filtering removed to prevent double-filtering**
- Displays papers exactly as received from backend API

### 2. Pages

#### ResearchPapers.tsx

- Main container page for research paper browsing
- Integrates PaperFilter, PaperGrid, and Search components
- **Client-side filtering removed to prevent double-filtering**
- Backend API handles all filtering server-side
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
- ResearchPapers → API: Sends filter parameters to backend
- API → ResearchPapers: Returns pre-filtered paper data
- ResearchPapers → PaperGrid: Passes pre-filtered paper data directly
- PaperCard ↔ ResearchPapers: Handles paper selection and interactions

## Data Flow

1. User initiates search or applies filters
2. ResearchPapers component sends filter parameters to backend API
3. Backend API returns pre-filtered results
4. Pre-filtered data flows directly to PaperGrid without additional client filtering
5. Individual PaperCards render with backend-filtered data

## Performance Considerations

- **Server-side filtering eliminates double-filtering performance issues**
- Pagination/infinite scroll for large datasets
- Debounced search and filter operations
- Optimized re-rendering strategies
- Caching of frequently accessed data
- Backend handles all complex filtering logic for optimal performance

## Debugging Guide

When "No papers found" appears:
1. Check browser console for API response logs
2. Verify filter parameter mapping between frontend and backend
3. Ensure backend API returns proper data structure
4. Check for type mismatches in date/year fields
5. Verify keyword and methodology field mappings
6. **RESOLVED**: Client-side filtering in PaperGrid removed to prevent double filtering
   - The API handles all filtering server-side and returns filtered results
   - PaperGrid now displays papers exactly as received from API
   - No additional client-side filtering is performed
7. Check console logs for "Applying filters" and "API Response" to see filter flow
8. Verify that filter parameters match exactly between frontend requests and backend expectations
   - Keywords should match case sensitivity
   - Methodology types should use exact backend values
   - Date formats should be consistent
