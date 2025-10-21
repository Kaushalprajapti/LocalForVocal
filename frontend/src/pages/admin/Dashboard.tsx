import React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Eye,
  Star
} from 'lucide-react';
import { useQuery } from 'react-query';
import { api } from '../../utils/api';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
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

const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading } = useQuery(
    'admin-dashboard',
    () => api.admin.getDashboard(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const { data: lowStockData, isLoading: lowStockLoading } = useQuery(
    'low-stock-products',
    () => api.products.getLowStock(),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  const stats = dashboardData || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    recentOrders: [],
    topProducts: [],
    salesData: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          loading={isLoading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+8.2% from last month"
          changeType="positive"
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          change="+3 new this week"
          changeType="positive"
          icon={Package}
          loading={isLoading}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockCount}
          change={stats.lowStockCount > 0 ? "Needs attention" : "All good"}
          changeType={stats.lowStockCount > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Orders</h2>
            <Badge variant="info" size="sm">
              {stats.recentOrders?.length || 0} orders
            </Badge>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : stats.recentOrders?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order._id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {order.customerInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {order.customerInfo.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                    <Badge
                      variant={
                        order.status === 'confirmed' ? 'success' :
                        order.status === 'pending' ? 'warning' : 'error'
                      }
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-500">No recent orders</p>
            </div>
          )}
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Top Products</h2>
            <Badge variant="info" size="sm">
              {stats.topProducts?.length || 0} products
            </Badge>
          </div>
          
          {isLoading ? (
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
          ) : stats.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.slice(0, 5).map((product: any, index: number) => (
                <div key={product._id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <span className="text-secondary-600 font-semibold text-sm">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-secondary-500 ml-1">
                          {product.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <span className="text-xs text-secondary-500">
                        {product.orders || 0} orders
                      </span>
                    </div>
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
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">
                Low Stock Alert
              </h3>
              <p className="text-yellow-700">
                {lowStockData.length} products are running low on stock and need attention.
              </p>
            </div>
          </div>
          <div className="mt-4">
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
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
