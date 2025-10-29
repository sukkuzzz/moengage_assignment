'use client';

interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  execution_time?: number;
}

interface ResultsDisplayProps {
  result: QueryResult | null;
  isLoading: boolean;
}

export default function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-theme-secondary rounded-lg shadow-sm border border-theme">
        <div className="px-4 py-3 border-b border-theme">
          <h2 className="text-lg font-medium text-theme-primary">Results</h2>
        </div>
        <div className="p-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-theme-secondary">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Executing query...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-theme-secondary rounded-lg shadow-sm border border-theme">
        <div className="px-4 py-3 border-b border-theme">
          <h2 className="text-lg font-medium text-theme-primary">Results</h2>
        </div>
        <div className="p-8 text-center">
          <div className="flex flex-col items-center space-y-2 text-theme-tertiary">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No query executed yet</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="bg-theme-secondary rounded-lg shadow-sm border border-theme">
        <div className="px-4 py-3 border-b border-theme">
          <h2 className="text-lg font-medium text-theme-primary">Results</h2>
        </div>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-red-800">Query Error</h3>
            </div>
            <p className="mt-2 text-sm text-red-700">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-theme-secondary rounded-lg shadow-sm border border-theme">
      <div className="px-4 py-3 border-b border-theme">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-theme-primary">Results</h2>
          {result.execution_time && (
            <span className="text-sm text-theme-tertiary">
              Executed in {result.execution_time}ms
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {result.data && result.data.length > 0 ? (
          <table className="min-w-full divide-y divide-theme">
            <thead className="bg-theme-tertiary">
              <tr>
                {Object.keys(result.data[0]).map((key) => (
                  <th
                    key={key}
                    className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-theme-secondary divide-y divide-theme">
              {result.data.map((row, index) => (
                <tr key={index} className="hover:bg-theme-tertiary">
                  {Object.values(row).map((value, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary"
                    >
                      {value === null ? (
                        <span className="text-theme-tertiary italic">null</span>
                      ) : (
                        String(value)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-theme-tertiary">
            <p>No data returned</p>
          </div>
        )}
      </div>
    </div>
  );
}