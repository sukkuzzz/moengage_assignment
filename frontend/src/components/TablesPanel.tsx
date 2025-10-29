'use client';

interface TableInfo {
  name: string;
  columns: { name: string; type: string }[];
  sample_data: any[];
}

interface TablesPanelProps {
  tables: string[];
  selectedTable: TableInfo | null;
  onTableSelect: (tableName: string) => void;
}

export default function TablesPanel({ tables, selectedTable, onTableSelect }: TablesPanelProps) {
  return (
    <div className="bg-theme-secondary rounded-lg shadow-sm border border-theme">
      <div className="px-4 py-3 border-b border-theme">
        <h2 className="text-lg font-medium text-theme-primary">Database Tables</h2>
        <p className="text-sm text-theme-secondary mt-1">
          Click on a table to view its schema and sample data.
        </p>
      </div>
      
      <div className="p-4">
        {tables.length === 0 ? (
          <p className="text-theme-tertiary text-sm">No tables available</p>
        ) : (
          <div className="space-y-2">
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => onTableSelect(table)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTable?.name === table
                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <span>{table}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {selectedTable && (
          <div className="mt-6 pt-6 border-t border-theme">
            <h3 className="text-sm font-medium text-theme-primary mb-3">
              {selectedTable.name} Schema
            </h3>
            <div className="space-y-2">
              {selectedTable.columns.map((column, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-theme-primary font-mono">{column.name}</span>
                  <span className="text-theme-tertiary">{column.type}</span>
                </div>
              ))}
            </div>
            
            {selectedTable.sample_data.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-theme-primary mb-2">Sample Data</h4>
                <div className="bg-theme-tertiary rounded-md p-3 text-xs">
                  <pre className="text-theme-primary whitespace-pre-wrap">
                    {JSON.stringify(selectedTable.sample_data.slice(0, 3), null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}