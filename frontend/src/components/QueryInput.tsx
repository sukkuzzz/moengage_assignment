'use client';

import { useState } from 'react';

interface QueryInputProps {
  onExecute: (query: string) => void;
  isLoading: boolean;
}

export default function QueryInput({ onExecute, isLoading }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onExecute(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onExecute(query.trim());
      }
    }
  };

  return (
    <div className="bg-theme-secondary rounded-lg shadow-sm border border-theme">
      <div className="px-4 py-3 border-b border-theme">
        <h2 className="text-lg font-medium text-theme-primary">SQL Query</h2>
        <p className="text-sm text-theme-secondary mt-1">
          Enter your SQL query below. Press Ctrl+Enter to execute.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="SELECT * FROM Customers WHERE age > 25;"
            className="w-full h-32 px-3 py-2 border border-theme rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm input-theme placeholder-theme-tertiary"
            disabled={isLoading}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              lineHeight: '1.5',
              tabSize: 2
            }}
          />
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-theme-tertiary">
              Tip: Use Ctrl+Enter to execute quickly
            </div>
            
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="px-4 py-2 button-theme text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Executing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                  Run Query
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}