import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SavedPaper {
  id: string;
  title: string;
  authors: string[];
  publicationYear: string;
  savedAt: string;
  slug?: string;
}

interface SavedPapersState {
  savedPapers: SavedPaper[];
  savedPaperIds: Set<string>;
  isLoading: boolean;
}

export const useSavedPapers = () => {
  const { user } = useAuth();
  const [state, setState] = useState<SavedPapersState>({
    savedPapers: [],
    savedPaperIds: new Set(),
    isLoading: true
  });

  // Load saved papers from localStorage
  const loadSavedPapers = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Get storage key based on user authentication (moved inside callback)
    const getStorageKey = () => {
      if (user) {
        return `savedPapers_${user.id}`;
      } else {
        // For guest users, use a consistent identifier
        let guestId = localStorage.getItem('guestId');
        if (!guestId) {
          guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('guestId', guestId);
        }
        return `savedPapers_${guestId}`;
      }
    };

    try {
      const storageKey = getStorageKey();
      const savedData = localStorage.getItem(storageKey);
      
      if (savedData) {
        const parsedData: SavedPaper[] = JSON.parse(savedData);
        const paperIds = new Set(parsedData.map(paper => paper.id));
        
        setState({
          savedPapers: parsedData,
          savedPaperIds: paperIds,
          isLoading: false
        });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading saved papers:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  // Get storage key helper function for other methods
  const getStorageKey = () => {
    if (user) {
      return `savedPapers_${user.id}`;
    } else {
      // For guest users, use a consistent identifier
      let guestId = localStorage.getItem('guestId');
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guestId', guestId);
      }
      return `savedPapers_${guestId}`;
    }
  };

  // Save papers to localStorage
  const savePapersToStorage = (papers: SavedPaper[]) => {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(papers));
    } catch (error) {
      console.error('Error saving papers to storage:', error);
    }
  };

  // Check if a paper is saved
  const isSaved = (paperId: string): boolean => {
    return state.savedPaperIds.has(paperId);
  };

  // Save a paper
  const savePaper = (paper: Omit<SavedPaper, 'savedAt'>) => {
    const savedPaper: SavedPaper = {
      ...paper,
      savedAt: new Date().toISOString()
    };

    setState(prevState => {
      if (prevState.savedPaperIds.has(paper.id)) {
        return prevState; // Already saved
      }

      const newSavedPapers = [...prevState.savedPapers, savedPaper];
      const newSavedPaperIds = new Set([...prevState.savedPaperIds, paper.id]);

      // Save to localStorage
      savePapersToStorage(newSavedPapers);

      return {
        ...prevState,
        savedPapers: newSavedPapers,
        savedPaperIds: newSavedPaperIds
      };
    });
  };

  // Remove a saved paper
  const removeSavedPaper = (paperId: string) => {
    setState(prevState => {
      const newSavedPapers = prevState.savedPapers.filter(paper => paper.id !== paperId);
      const newSavedPaperIds = new Set(newSavedPapers.map(paper => paper.id));

      // Save to localStorage
      savePapersToStorage(newSavedPapers);

      return {
        ...prevState,
        savedPapers: newSavedPapers,
        savedPaperIds: newSavedPaperIds
      };
    });
  };

  // Toggle save status
  const toggleSave = (paper: Omit<SavedPaper, 'savedAt'>) => {
    if (isSaved(paper.id)) {
      removeSavedPaper(paper.id);
    } else {
      savePaper(paper);
    }
  };

  // Clear all saved papers
  const clearAllSavedPapers = () => {
    setState({
      savedPapers: [],
      savedPaperIds: new Set(),
      isLoading: false
    });

    if (typeof window !== 'undefined') {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
    }
  };

  // Load saved papers on mount and user change
  useEffect(() => {
    loadSavedPapers();
  }, [loadSavedPapers]);

  return {
    savedPapers: state.savedPapers,
    savedPaperIds: state.savedPaperIds,
    isLoading: state.isLoading,
    isSaved,
    savePaper,
    removeSavedPaper,
    toggleSave,
    clearAllSavedPapers,
    reloadSavedPapers: loadSavedPapers
  };
};
