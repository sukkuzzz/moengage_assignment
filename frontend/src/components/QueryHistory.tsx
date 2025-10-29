'use client';

interface QueryHistoryItem {
  query: string;
  timestamp: string;
  success: boolean;
  execution_time?: number;
}

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onClose: () => void;
}

export default function QueryHistory({ history, onClose }: QueryHistoryProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-700 w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Query History</h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No queries executed yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border ${
                    item.success
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.success ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                    {item.execution_time && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.execution_time.toFixed(3)}s
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-2 rounded text-sm font-mono overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{item.query}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
