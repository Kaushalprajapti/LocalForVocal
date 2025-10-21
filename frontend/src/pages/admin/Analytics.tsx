import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Download
} from 'lucide-react';
import { useQuery } from 'react-query';
import { api } from '../../utils/api';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Loader';
import { formatPrice, formatDateTime } from '../../utils/helpers';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  loading?: boolean;
}> = ({ title, value, change, changeType = 'neutral', icon: Icon, loading }) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-12 w-12 rounded-lg" />
        </div>
      </Card>
    );
  }

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-secondary-600',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-2xl font-bold text-secondary-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColors[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </Card>
  );
};

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Fetch analytics data
  const { data: salesData, isLoading: salesLoading } = useQuery(
    ['analytics-sales', timeRange],
    () => api.analytics.getSales({ period: timeRange }),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  const { data: productData, isLoading: productLoading } = useQuery(
    ['analytics-products', timeRange],
    () => api.analytics.getProducts({ period: timeRange }),
    {
      refetchInterval: 300000,
    }
  );

  const { data: orderData, isLoading: orderLoading } = useQuery(
    ['analytics-orders', timeRange],
    () => api.analytics.getOrders({ period: timeRange }),
    {
      refetchInterval: 300000,
    }
  );

  const { data: lowStockData, isLoading: lowStockLoading } = useQuery(
    'analytics-low-stock',
    () => api.analytics.getLowStock(),
    {
      refetchInterval: 600000, // Refetch every 10 minutes
    }
  );

  const timeRanges = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenue', icon: DollarSign },
    { value: 'orders', label: 'Orders', icon: ShoppingCart },
    { value: 'products', label: 'Products', icon: Package },
    { value: 'customers', label: 'Customers', icon: Users },
  ];

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600">
            Track your store's performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Time Range</h3>
            <p className="text-sm text-secondary-600">Select the time period for analytics</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatPrice(salesData?.totalRevenue || 0)}
          change="+12.5% from last period"
          changeType="positive"
          icon={DollarSign}
          loading={salesLoading}
        />
        <StatCard
          title="Total Orders"
          value={orderData?.totalOrders || 0}
          change="+8.2% from last period"
          changeType="positive"
          icon={ShoppingCart}
          loading={orderLoading}
        />
        <StatCard
          title="Total Products"
          value={productData?.totalProducts || 0}
          change="+3 new this period"
          changeType="positive"
          icon={Package}
          loading={productLoading}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockData?.length || 0}
          change={lowStockData?.length > 0 ? "Needs attention" : "All good"}
          changeType={lowStockData?.length > 0 ? "negative" : "positive"}
          icon={Package}
          loading={lowStockLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </div>
          
          {salesLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-secondary-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                <p className="text-secondary-500">Revenue chart will be displayed here</p>
                <p className="text-sm text-secondary-400">
                  Integration with charting library needed
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-secondary-900">Top Products</h3>
            <Badge variant="info" size="sm">
              {productData?.topProducts?.length || 0} products
            </Badge>
          </div>
          
          {productLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : productData?.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {productData.topProducts.slice(0, 5).map((product: any, index: number) => (
                <div key={product._id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {product.orders || 0} orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900">
                      {formatPrice(product.revenue || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-500">No product data available</p>
            </div>
          )}
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockData && lowStockData.length > 0 && (
        <Card className="p-6 border-l-4 border-yellow-400 bg-yellow-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-900">
                Low Stock Alert
              </h3>
            </div>
            <Badge variant="warning" size="sm">
              {lowStockData.length} items
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockData.slice(0, 6).map((product: any) => (
              <div key={product._id} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-red-600">
                      Only {product.stock} left
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Order Analytics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Order Analytics</h3>
        
        {orderLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">
                  {orderData?.confirmedOrders || 0}
                </span>
              </div>
              <h4 className="font-semibold text-secondary-900">Confirmed</h4>
              <p className="text-sm text-secondary-500">Orders confirmed</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">
                  {orderData?.pendingOrders || 0}
                </span>
              </div>
              <h4 className="font-semibold text-secondary-900">Pending</h4>
              <p className="text-sm text-secondary-500">Awaiting confirmation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">
                  {orderData?.cancelledOrders || 0}
                </span>
              </div>
              <h4 className="font-semibold text-secondary-900">Cancelled</h4>
              <p className="text-sm text-secondary-500">Orders cancelled</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
