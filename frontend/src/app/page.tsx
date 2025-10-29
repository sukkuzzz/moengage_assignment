'use client';

import { useState, useEffect } from 'react';
import QueryInput from '@/components/QueryInput';
import ResultsDisplay from '@/components/ResultsDisplay';
import TablesPanel from '@/components/TablesPanel';
import LoginModal from '@/components/LoginModal';
import QueryHistory from '@/components/QueryHistory';
import ThemeToggle from '@/components/ThemeToggle';

interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  execution_time?: number;
}

interface TableInfo {
  name: string;
  columns: { name: string; type: string }[];
  sample_data: any[];
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [queryHistory, setQueryHistory] = useState<any[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      fetchTables();
    }
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tables`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTables(data.tables);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        setIsAuthenticated(true);
        fetchTables();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setQueryResult(null);
    setTables([]);
    setSelectedTable(null);
    setQueryHistory([]);
  };

  const handleQueryExecute = async (query: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      setQueryResult(result);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        query,
        success: result.success,
        timestamp: new Date().toISOString(),
        execution_time: result.execution_time,
        error: result.error
      };
      setQueryHistory(prev => [historyItem, ...prev.slice(0, 49)]);
      
    } catch (error) {
      setQueryResult({
        success: false,
        error: 'Network error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableSelect = async (tableName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/tables/${tableName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedTable(data);
      }
    } catch (error) {
      console.error('Error fetching table details:', error);
    }
  };

  if (!isAuthenticated) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-theme-primary">
      {/* Header */}
      <header className="bg-theme-secondary shadow-sm border-b border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-theme-primary">SQL Runner</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-2 text-sm font-medium text-theme-secondary hover:text-theme-primary hover:bg-theme-tertiary rounded-md transition-colors"
              >
                History
              </button>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Tables */}
          <div className="lg:col-span-1">
            <TablesPanel
              tables={tables}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
            />
          </div>

          {/* Right Panel - Query and Results */}
          <div className="lg:col-span-2 space-y-6">
            <QueryInput onExecute={handleQueryExecute} isLoading={isLoading} />
            <ResultsDisplay result={queryResult} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Query History Modal */}
      {showHistory && (
        <QueryHistory
          history={queryHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}