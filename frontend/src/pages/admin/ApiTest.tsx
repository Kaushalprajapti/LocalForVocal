import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Loader, 
  RefreshCw,
  Database,
  Package,
  ShoppingCart,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { api } from '../../utils/api';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

const ApiTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testApi = async (name: string, testFn: () => Promise<any>): Promise<TestResult> => {
    try {
      const data = await testFn();
      return {
        name,
        status: 'success',
        message: 'Success',
        data
      };
    } catch (error: any) {
      return {
        name,
        status: 'error',
        message: error.message || 'Failed',
        data: error.response?.data
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    const tests = [
      // Health Check
      {
        name: 'Health Check',
        test: () => api.health()
      },
      
      // Admin APIs
      {
        name: 'Admin Verify Token',
        test: () => api.admin.verifyToken()
      },
      {
        name: 'Admin Profile',
        test: () => api.admin.getProfile()
      },
      {
        name: 'Admin Dashboard',
        test: () => api.admin.getDashboard()
      },
      
      // Categories APIs
      {
        name: 'Get Categories',
        test: () => api.categories.getAll()
      },
      
      // Products APIs
      {
        name: 'Get Products',
        test: () => api.products.getAll({ page: 1, limit: 5 })
      },
      {
        name: 'Get Low Stock Products',
        test: () => api.products.getLowStock()
      },
      
      // Orders APIs
      {
        name: 'Get Orders',
        test: () => api.orders.getAll({ page: 1, limit: 5 })
      },
      {
        name: 'Get Order Stats',
        test: () => api.orders.getStats()
      },
      
      // Analytics APIs
      {
        name: 'Sales Analytics',
        test: () => api.analytics.getSales({ period: '7d' })
      },
      {
        name: 'Product Analytics',
        test: () => api.analytics.getProducts({ limit: 5 })
      },
      {
        name: 'Low Stock Analytics',
        test: () => api.analytics.getLowStock()
      },
      {
        name: 'Dashboard Analytics',
        test: () => api.analytics.getDashboard()
      }
    ];

    const testResults: TestResult[] = [];
    
    for (const test of tests) {
      const result = await testApi(test.name, test.test);
      testResults.push(result);
      setResults([...testResults]);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const totalCount = results.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">API Test Center</h1>
          <p className="text-secondary-600">
            Test all admin API endpoints and functionality
          </p>
        </div>
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running Tests...' : 'Run All Tests'}</span>
        </Button>
      </div>

      {/* Summary */}
      {results.length > 0 && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-900">{totalCount}</div>
              <div className="text-sm text-secondary-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-secondary-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-secondary-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0}%
              </div>
              <div className="text-sm text-secondary-600">Success Rate</div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <div>
                  <h3 className="font-medium text-secondary-900">{result.name}</h3>
                  <p className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.message}
                  </p>
                </div>
              </div>
              {result.data && (
                <details className="text-xs text-secondary-500">
                  <summary className="cursor-pointer hover:text-secondary-700">
                    View Data
                  </summary>
                  <pre className="mt-2 p-2 bg-secondary-50 rounded text-xs overflow-auto max-h-32">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => window.open('/admin/products/add', '_blank')}
            className="flex items-center space-x-2"
          >
            <Package className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/admin/categories/add', '_blank')}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Add Category</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/admin/orders', '_blank')}
            className="flex items-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>View Orders</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/admin/analytics', '_blank')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>View Analytics</span>
          </Button>
        </div>
      </Card>

      {/* Environment Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Environment Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || '/api'}
          </div>
          <div>
            <strong>Environment:</strong> {import.meta.env.MODE}
          </div>
          <div>
            <strong>Token Present:</strong> {localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken') ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Admin Data:</strong> {localStorage.getItem('admin') || sessionStorage.getItem('admin') ? 'Yes' : 'No'}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ApiTest;



