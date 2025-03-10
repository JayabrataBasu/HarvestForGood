"use client";

import React, { useState, useEffect } from 'react';
import { PaperGrid } from '../components/research/PaperGrid';
import { Paper, Keyword } from '../types/paper.types';

export const ResearchPapersPage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch papers and keywords from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you'd fetch from your API
        // const response = await fetch('/api/research-papers');
        // const data = await response.json();
        
        // Sample data for demonstration purposes
        const sampleKeywords: Keyword[] = [
          { id: 'k1', name: 'Food Security' },
          { id: 'k2', name: 'Agriculture' },
          { id: 'k3', name: 'Sustainability' },
          { id: 'k4', name: 'Urban Farming' },
          { id: 'k5', name: 'Food Waste' },
          { id: 'k6', name: 'Community Gardens' },
          { id: 'k7', name: 'Nutrition' },
          { id: 'k8', name: 'Food Policy' },
        ];
        
        const samplePapers: Paper[] = Array(20).fill(null).map((_, idx) => ({
          id: `paper-${idx + 1}`,
          title: `Research Paper ${idx + 1}: ${['Impact of', 'Analysis of', 'Study on', 'Evaluation of'][idx % 4]} ${sampleKeywords[idx % sampleKeywords.length].name}`,
          abstract: `This research examines the relationship between ${sampleKeywords[idx % sampleKeywords.length].name.toLowerCase()} and sustainable development goals. Our findings indicate significant correlations between implementation strategies and community outcomes across various demographic groups.`,
          authors: [
            { 
              id: `author-${idx}-1`, 
              name: `Dr. ${['John Smith', 'Sarah Johnson', 'David Lee', 'Maria Garcia'][idx % 4]}`, 
              affiliation: `${['University of California', 'MIT', 'Stanford University', 'Oxford University'][idx % 4]}`
            },
            { 
              id: `author-${idx}-2`, 
              name: `Prof. ${['Robert Brown', 'Emily Chen', 'Michael Wilson', 'Lisa Wong'][idx % 4]}`, 
              affiliation: `${['Harvard University', 'Yale University', 'Princeton University', 'Cambridge University'][idx % 4]}`
            }
          ],
          publicationDate: new Date(2020 + (idx % 4), (idx % 12), 1),
          journal: `Journal of ${['Sustainable Agriculture', 'Food Studies', 'Environmental Science', 'Community Development'][idx % 4]}`,
          methodologyType: ['qualitative', 'quantitative', 'mixed'][idx % 3] as 'qualitative' | 'quantitative' | 'mixed',
          citationCount: 10 + (idx * 5),
          citationTrend: ['increasing', 'stable', 'decreasing'][idx % 3] as 'increasing' | 'stable' | 'decreasing',
          keywords: [
            sampleKeywords[idx % sampleKeywords.length],
            sampleKeywords[(idx + 1) % sampleKeywords.length],
            sampleKeywords[(idx + 2) % sampleKeywords.length]
          ],
          downloadUrl: '#sample-download-link'
        }));
        setPapers(samplePapers);
        setKeywords(sampleKeywords);
        setPapers(samplePapers);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load research papers. Please try again later.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
    return (
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Research Papers</h1>
          <p className="mt-2 text-lg text-gray-600">
            Explore our collection of research papers on sustainable food systems and community agriculture
          </p>
        </header>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <PaperGrid papers={papers} availableKeywords={keywords} />
        )}
      </div>
    );
  };