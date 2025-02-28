"use client";
import { useState, useEffect } from 'react';
import {PaperGrid} from '../../components/research/PaperGrid';
import PaperFilter from '../../components/research/PaperFilter';
import { Paper, Keyword, MethodologyType } from '../../types/paper.types';

export default function ResearchPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedPaperIds, setSavedPaperIds] = useState<string[]>([]);

  // Load sample data
  useEffect(() => {
    // Sample keywords
    const sampleKeywords: Keyword[] = [
      { id: 'k1', name: 'Food Security' },
      { id: 'k2', name: 'Agriculture' },
      { id: 'k3', name: 'Sustainability' },
      { id: 'k4', name: 'Urban Farming' },
    ];

    // Sample papers
    const samplePapers: Paper[] = Array(12).fill(null).map((_, idx) => ({
        id: `paper-${idx + 1}`,
        title: `Research Paper ${idx + 1}: Impact of Sustainable Practices`,
        abstract: "This research examines the relationship between sustainable practices and food security in urban environments.",
        authors: [
          { id: `author-${idx}-1`, name: `Dr. John Smith`, affiliation: `University of Research` },
          { id: `author-${idx}-2`, name: `Prof. Jane Doe`, affiliation: `Institute of Studies` }
        ],
        publicationDate: new Date(2020 + (idx % 4), (idx % 12), 1),
        journal: "Journal of Sustainable Agriculture",
        methodologyType: ['qualitative', 'quantitative', 'mixed'][idx % 3] as MethodologyType,
        citationCount: 10 + (idx * 5),
        citationTrend: ['increasing', 'stable', 'decreasing'][idx % 3] as 'increasing' | 'stable' | 'decreasing',
        keywords: [
          sampleKeywords[idx % sampleKeywords.length],
          sampleKeywords[(idx + 1) % sampleKeywords.length],
        ],
        downloadUrl: '#'
      }));
      
      setPapers(samplePapers);
      setKeywords(sampleKeywords);
      setIsLoading(false);
      
   
  }, []);

  const handleSavePaper = (paperId: string, isSaving: boolean) => {
    setSavedPaperIds(prev => 
      isSaving ? [...prev, paperId] : prev.filter(id => id !== paperId)
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Research Papers</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PaperFilter 
            availableKeywords={keywords}
            onFilterChange={() => {}}
          />
        </div>
        <div className="lg:col-span-3">
          <PaperGrid 
            papers={papers}
            availableKeywords={keywords}
            isLoading={isLoading}
            savedPaperIds={savedPaperIds}
            onSavePaper={handleSavePaper}
          />
        </div>
      </div>
    </div>
  );
}
