"use client";
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
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{paper.title}</h3>
      
      <button 
        onClick={() => onSave(paper.id)}
        className="text-blue-500 hover:text-blue-700"
      >
        {isSaved ? (
          <span>★ Saved</span>
        ) : (
          <span>☆ Save</span>
        )}
      </button>
      
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
        {new Date(paper.publicationDate).toLocaleDateString()}
      </div>
      
      <p className="text-gray-700 mb-4">{paper.abstract}</p>
      
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
      
      <div className="flex justify-between items-center text-sm">
        <span>{paper.citationCount.toLocaleString()} citations</span>
        <a href={paper.downloadUrl} className="text-blue-600 hover:underline">Download PDF</a>
      </div>
    </div>
  );
};

export default PaperCard;
