import React from 'react';
import { ResearchPaper, Keyword } from '../../types/paper.types';

export interface PaperCardProps {
  paper: ResearchPaper;
  onSave: (paperId: string) => void;
  isSaved: boolean;
  onKeywordClick: (keyword: Keyword) => void;
  isListView?: boolean;

}

const PaperCard: React.FC<PaperCardProps> = ({ paper, onSave, isSaved, onKeywordClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{paper.title}</h3>
        <button
          onClick={() => onSave(paper.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          {isSaved ? (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path>
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="text-sm text-gray-600 mb-3">
        {paper.authors.map((author, index) => (
          <span key={author.id}>
            {author.name}
            {index < paper.authors.length - 1 ? ', ' : ''}
          </span>
        ))}
        {' • '}
        {paper.journal}
        {' • '}
        {paper.publicationDate.toLocaleDateString()}
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-3">{paper.abstract}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {paper.keywords.map(keyword => (
          <button
            key={keyword.id}
            onClick={() => onKeywordClick(keyword)}
            className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200"
          >
            {keyword.name}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center text-gray-600">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{paper.citationCount.toLocaleString()} citations</span>
        </div>
        
        <a 
          href={paper.downloadUrl}
          target="_blank"
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
};

export default PaperCard;
