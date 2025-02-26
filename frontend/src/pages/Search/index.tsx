import React, { useState, useEffect } from 'react';
import PaperCard from '../../components/research/PaperCard';
import PaperFilter from '../../components/research/PaperFilter';
import { ResearchPaper, PaperFilterOptions, Keyword, MethodologyType } from '../../types/paper.types';

// Sample data - would normally come from an API
const sampleKeywords: Keyword[] = [
  { id: '1', name: 'Machine Learning' },
  { id: '2', name: 'Artificial Intelligence' },
  { id: '3', name: 'Computer Vision' },
  { id: '4', name: 'Natural Language Processing' },
  { id: '5', name: 'Data Mining' },
  { id: '6', name: 'Neural Networks' },
  { id: '7', name: 'Deep Learning' },
  { id: '8', name: 'Robotics' },
];

const samplePapers: ResearchPaper[] = [
    {
        id: '1',
        title: 'Attention Is All You Need',
        authors: [
            { id: '1', name: 'Ashish Vaswani', affiliation: 'Google Brain' },
            { id: '2', name: 'Noam Shazeer', affiliation: 'Google Research' },
        ],
        publicationDate: new Date('2017-06-12'),
        abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
        methodologyType: 'quantitative',
        citationCount: 45678,
        citationTrend: [2000, 5000, 12000, 28000, 45678],
        downloadUrl: 'https://example.com/papers/attention-is-all-you-need.pdf',
        journal: 'Neural Information Processing Systems',
        keywords: [
            { id: '1', name: 'Machine Learning' },
            { id: '6', name: 'Neural Networks' },
            { id: '7', name: 'Deep Learning' },
        ]
    },
    {
        id: '2',
        title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
        authors: [
            { id: '3', name: 'Jacob Devlin', affiliation: 'Google AI Language' },
            { id: '4', name: 'Ming-Wei Chang', affiliation: 'Google AI Language' }
        ],
        publicationDate: new Date('2018-10-11'),
        abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations by jointly conditioning on both left and right context in all layers.',
        methodologyType: 'quantitative',
        citationCount: 32150,
        citationTrend: [1500, 8000, 15000, 32150],
        downloadUrl: 'https://example.com/papers/bert-pretraining.pdf',
        journal: 'North American Chapter of the Association for Computational Linguistics',
        keywords: [
            { id: '4', name: 'Natural Language Processing' },
            { id: '7', name: 'Deep Learning' },
        ]
    },
    {
        id: '3',
        title: 'A Survey on Transfer Learning',
        authors: [
            { id: '5', name: 'Sinno Jialin Pan', affiliation: 'Nanyang Technological University' }
        ],
        publicationDate: new Date('2010-10-01'),
        abstract: 'Transfer learning aims to improve the performance of target learning task by leveraging knowledge from source tasks. This survey is focused on categorizing and reviewing the current progress on transfer learning for classification, regression, and clustering problems.',
        methodologyType: 'qualitative',
        citationCount: 8500,
        citationTrend: [500, 1200, 3600, 6000, 8500],
        downloadUrl: 'https://example.com/papers/survey-transfer-learning.pdf',
        journal: 'IEEE Transactions on Knowledge and Data Engineering',
        keywords: [
            { id: '1', name: 'Machine Learning' },
            { id: '2', name: 'Artificial Intelligence' },
        ]
    }
];

const SearchPage: React.FC = () => {
    const [papers] = useState<ResearchPaper[]>(samplePapers);
    const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>(samplePapers);
    const [savedPapers, setSavedPapers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    const handleFilterChange = (filters: PaperFilterOptions) => {
        // Apply filters to the papers
        const filtered = papers.filter(paper => {
            // Filter by date range
            if (filters.dateRange.startDate && new Date(paper.publicationDate) < filters.dateRange.startDate) {
                return false;
            }
            if (filters.dateRange.endDate && new Date(paper.publicationDate) > filters.dateRange.endDate) {
                return false;
            }
            
            // Filter by methodology type
            if (filters.methodologyTypes.length > 0 && !filters.methodologyTypes.includes(paper.methodologyType as MethodologyType)) {
                return false;
            }
            
            // Filter by keywords
            if (filters.keywords.length > 0) {
                const paperKeywordNames = paper.keywords.map(k => k.name);
                if (!filters.keywords.some(k => paperKeywordNames.includes(k))) {
                    return false;
                }
            }
            
            // Filter by citation count
            if (paper.citationCount < filters.minCitations) {
                return false;
            }
            
            return true;
        });
        
        setFilteredPapers(filtered);
    };
    
    const handleSavePaper = (paperId: string) => {
        setSavedPapers(prev => {
            if (prev.includes(paperId)) {
                return prev.filter(id => id !== paperId);
            } else {
                return [...prev, paperId];
            }
        });
    };
    
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPapers(papers);
            return;
        }
        
        const query = searchQuery.toLowerCase();
        const results = papers.filter(paper => 
            paper.title.toLowerCase().includes(query) ||
            paper.abstract.toLowerCase().includes(query) ||
            paper.authors.some(author => author.name.toLowerCase().includes(query)) ||
            paper.keywords.some(keyword => keyword.name.toLowerCase().includes(query))
        );
        
        setFilteredPapers(results);
    }, [searchQuery, papers]);
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Academic Research Papers</h1>
            
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search papers by title, author, keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
                <PaperFilter 
                    availableKeywords={sampleKeywords}
                    onFilterChange={handleFilterChange}
                />
            </div>
            
            <div className="lg:col-span-3">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Results</h2>
                </div>
                {filteredPapers.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No papers found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredPapers.map((paper) => (
                            <PaperCard
                                key={paper.id}
                                paper={paper}
                                onSave={handleSavePaper}
                                isSaved={savedPapers.includes(paper.id)}
                                onKeywordClick={() => {}}
                            />
                        ))}
                    </div>
                )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
