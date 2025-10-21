import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Filter, Calendar, ArrowRight, Eye, MessageCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { formatPrice, formatDateTime } from '../../utils/helpers';
import { sendMessageToWhatsApp } from '../../utils/whatsapp';
import { api } from '../../utils/api';

interface Order {
  id: string;
  orderId: string;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    sku: string;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  whatsappLink?: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load orders from localStorage on component mount
  useEffect(() => {
    loadOrdersFromStorage();
  }, []);

  // Filter orders when search term or status filter changes
  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrdersFromStorage = () => {
    try {
      const storedOrders = localStorage.getItem('customerOrders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        // Sort by creation date (newest first)
        const sortedOrders = parsedOrders.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Error loading orders from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const syncOrdersToBackend = async () => {
    if (orders.length === 0) return;
    
    setIsSyncing(true);
    try {
      const response = await api.customerOrders.sync(orders);
      console.log('Orders synced to backend:', response);
      // You could show a success message here
    } catch (error) {
      console.error('Error syncing orders to backend:', error);
      // You could show an error message here
    } finally {
      setIsSyncing(false);
    }
  };

  const handleContactAdmin = (orderId: string) => {
    const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || '+919876543210';
    const message = `Hi! I have a question about my order ${orderId}.`;
    sendMessageToWhatsApp(message, adminWhatsApp);
  };

  const handleResendWhatsApp = (order: Order) => {
    if (order.whatsappLink) {
      window.open(order.whatsappLink, '_blank', 'noopener,noreferrer');
    } else {
      // Generate WhatsApp link if not available
      const adminWhatsApp = import.meta.env.VITE_ADMIN_WHATSAPP || '+919876543210';
      const message = `🛒 *Order Inquiry*\n\nOrder ID: ${order.orderId}\nCustomer: ${order.customerInfo.name}\nTotal: ₹${order.totalAmount}\n\nPlease provide order status and delivery details.`;
      const whatsappLink = `https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'warning',
    confirmed: 'success',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary-200 rounded w-64 mb-6"></div>
            <div className="h-10 bg-secondary-200 rounded w-full mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-secondary-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Order History</h1>
              <p className="text-secondary-600">
                View and track all your orders
              </p>
            </div>
            {orders.length > 0 && (
              <div className="mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={syncOrdersToBackend}
                  disabled={isSyncing}
                  className="w-full sm:w-auto"
                >
                  {isSyncing ? 'Syncing...' : 'Sync to Admin'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                  <Input
                    placeholder="Search by order ID, customer name, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No Orders Found</h3>
            <p className="text-secondary-600 mb-6">
              {orders.length === 0 
                ? "You haven't placed any orders yet. Start shopping to see your orders here."
                : "No orders match your current search criteria."
              }
            </p>
            {orders.length === 0 && (
              <Link to="/products">
                <Button>Start Shopping</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Order Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm text-secondary-600">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <Badge variant={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-3">
                      <p className="font-medium text-secondary-900">{order.customerInfo.name}</p>
                      <p className="text-sm text-secondary-600">{order.customerInfo.phone}</p>
                    </div>

                    {/* Order Items */}
                    <div className="mb-3">
                      <p className="text-sm text-secondary-600 mb-1">Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary-100 text-secondary-800"
                          >
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="text-lg font-semibold text-secondary-900">
                      Total: {formatPrice(order.totalAmount)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                    <Link to={`/order/${order.orderId}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactAdmin(order.orderId)}
                      className="w-full sm:w-auto"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Admin
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResendWhatsApp(order)}
                      className="w-full sm:w-auto"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {orders.length > 0 && (
          <div className="mt-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-secondary-900">Order Summary</h3>
                  <p className="text-secondary-600">
                    Total Orders: {orders.length} | 
                    Showing: {filteredOrders.length} | 
                    Total Spent: {formatPrice(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Calendar className="h-4 w-4" />
                  <span>Last updated: {formatDateTime(new Date())}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
