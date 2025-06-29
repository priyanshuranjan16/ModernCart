import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Download,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  ShoppingBag
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  purchaseDate: string;
  status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: OrderItem[];
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingEvents: TrackingEvent[];
  progress: number; // 0-100
}

// Mock data generator
const generateMockOrders = (): Order[] => {
  const statuses: Order['status'][] = ['delivered', 'in_transit', 'shipped', 'processing', 'pending'];
  const carriers = ['FedEx', 'UPS', 'USPS', 'DHL'];
  
  return Array.from({ length: 25 }, (_, i) => {
    const status = statuses[i % statuses.length];
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - (i * 3));
    
    const isDelivered = status === 'delivered';
    const progress = status === 'delivered' ? 100 : 
                    status === 'in_transit' ? 75 :
                    status === 'shipped' ? 50 :
                    status === 'processing' ? 25 : 10;

    return {
      id: `order-${i + 1}`,
      orderNumber: `MC-2024-${String(i + 1).padStart(3, '0')}`,
      purchaseDate: orderDate.toISOString(),
      status,
      total: 150 + (i * 25),
      subtotal: 130 + (i * 20),
      tax: 15 + (i * 2),
      shipping: i % 3 === 0 ? 0 : 5,
      items: [
        {
          id: `item-${i}-1`,
          name: `Product ${i + 1}`,
          image: `https://images.pexels.com/photos/${3394650 + i}/pexels-photo-${3394650 + i}.jpeg?auto=compress&cs=tinysrgb&w=200`,
          price: 75 + (i * 10),
          quantity: 1 + (i % 3),
          sku: `SKU-${i + 1}`
        }
      ],
      trackingNumber: status !== 'pending' ? `TRK${String(i + 1).padStart(9, '0')}` : undefined,
      carrier: status !== 'pending' ? carriers[i % carriers.length] : undefined,
      estimatedDelivery: isDelivered ? undefined : new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString(),
      actualDelivery: isDelivered ? new Date(orderDate.getTime() + (2 * 24 * 60 * 60 * 1000)).toISOString() : undefined,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zip: '10001'
      },
      trackingEvents: generateTrackingEvents(status, orderDate),
      progress
    };
  });
};

const generateTrackingEvents = (status: Order['status'], orderDate: Date): TrackingEvent[] => {
  const events: TrackingEvent[] = [
    {
      id: '1',
      status: 'Order Placed',
      description: 'Your order has been placed and confirmed.',
      location: 'ModernCart Warehouse',
      timestamp: orderDate.toISOString(),
      isCompleted: true
    }
  ];

  if (status === 'pending') return events;

  events.push({
    id: '2',
    status: 'Processing',
    description: 'Your order is being prepared for shipment.',
    location: 'ModernCart Warehouse',
    timestamp: new Date(orderDate.getTime() + (6 * 60 * 60 * 1000)).toISOString(),
    isCompleted: true
  });

  if (status === 'processing') return events;

  events.push({
    id: '3',
    status: 'Shipped',
    description: 'Your package has been picked up by the carrier.',
    location: 'Los Angeles, CA',
    timestamp: new Date(orderDate.getTime() + (24 * 60 * 60 * 1000)).toISOString(),
    isCompleted: true
  });

  if (status === 'shipped') return events;

  events.push({
    id: '4',
    status: 'In Transit',
    description: 'Your package is on its way to the destination.',
    location: 'Phoenix, AZ',
    timestamp: new Date(orderDate.getTime() + (36 * 60 * 60 * 1000)).toISOString(),
    isCompleted: status === 'in_transit' || status === 'delivered'
  });

  if (status === 'delivered') {
    events.push({
      id: '5',
      status: 'Delivered',
      description: 'Package delivered successfully.',
      location: 'New York, NY',
      timestamp: new Date(orderDate.getTime() + (48 * 60 * 60 * 1000)).toISOString(),
      isCompleted: true
    });
  }

  return events;
};

export function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Simulate API call
  const fetchOrders = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockOrders = generateMockOrders();
      const itemsPerPage = 10;
      const startIndex = (pageNum - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageOrders = mockOrders.slice(startIndex, endIndex);

      if (append) {
        setOrders(prev => [...prev, ...pageOrders]);
      } else {
        setOrders(pageOrders);
      }

      setHasMore(endIndex < mockOrders.length);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders(1, false);
    }
  }, [user, fetchOrders]);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchQuery === '' || 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      const matchesDate = dateFilter === 'all' || (() => {
        const orderDate = new Date(order.purchaseDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case 'week': return daysDiff <= 7;
          case 'month': return daysDiff <= 30;
          case 'quarter': return daysDiff <= 90;
          case 'year': return daysDiff <= 365;
          default: return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage, true);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped':
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
      case 'returned': return <RotateCcw className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'shipped':
      case 'in_transit': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled':
      case 'returned': return 'danger';
      default: return 'secondary';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const openCarrierTracking = (trackingNumber: string, carrier: string) => {
    const trackingUrls: Record<string, string> = {
      'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
      'USPS': `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`,
      'DHL': `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`
    };
    
    const url = trackingUrls[carrier] || `https://google.com/search?q=${trackingNumber}+tracking`;
    window.open(url, '_blank');
  };

  if (!user) {
    return (
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl">
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign in to view your orders</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your order history and tracking information.</p>
            <Button>Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : "You haven't placed any orders yet."
              }
            </p>
            <Button>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600">Placed on {formatDate(order.purchaseDate)}</p>
                        </div>
                        <Badge variant={getStatusColor(order.status)} className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatPrice(order.total)}</div>
                        <div className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.status !== 'cancelled' && order.status !== 'returned' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Order Progress</span>
                          <span>{order.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Order Items Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium text-primary-600">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg text-gray-600">
                          +{order.items.length - 3} more items
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleOrderExpansion(order.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                        </Button>
                        
                        {order.trackingNumber && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCarrierTracking(order.trackingNumber!, order.carrier!)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Track Package
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {order.status === 'delivered' && (
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Return
                          </Button>
                        )}
                        <Button size="sm">
                          Buy Again
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-6 bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tracking Timeline */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Tracking Timeline</h4>
                          <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="space-y-4">
                              {order.trackingEvents.map((event, index) => (
                                <div key={event.id} className="relative flex items-start">
                                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    event.isCompleted 
                                      ? 'bg-primary-600 border-primary-600 text-white' 
                                      : 'bg-gray-100 border-gray-300 text-gray-400'
                                  }`}>
                                    {event.isCompleted ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <Clock className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <div className="flex items-center justify-between">
                                      <h5 className={`font-medium ${
                                        event.isCompleted ? 'text-gray-900' : 'text-gray-500'
                                      }`}>
                                        {event.status}
                                      </h5>
                                      {event.timestamp && (
                                        <span className="text-xs text-gray-500">
                                          {new Date(event.timestamp).toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-sm ${
                                      event.isCompleted ? 'text-gray-600' : 'text-gray-400'
                                    }`}>
                                      {event.description}
                                    </p>
                                    <p className={`text-xs ${
                                      event.isCompleted ? 'text-gray-500' : 'text-gray-400'
                                    }`}>
                                      {event.location}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal:</span>
                              <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping:</span>
                              <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax:</span>
                              <span>{formatPrice(order.tax)}</span>
                            </div>
                            <div className="border-t pt-3">
                              <div className="flex justify-between font-semibold">
                                <span>Total:</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="mt-6">
                            <h5 className="font-medium text-gray-900 mb-2">Shipping Address</h5>
                            <div className="text-sm text-gray-600">
                              <div>{order.shippingAddress.name}</div>
                              <div>{order.shippingAddress.address}</div>
                              <div>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                              </div>
                            </div>
                          </div>

                          {/* Delivery Information */}
                          {(order.estimatedDelivery || order.actualDelivery) && (
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-900 mb-2">Delivery Information</h5>
                              <div className="text-sm text-gray-600">
                                {order.actualDelivery ? (
                                  <div>Delivered on {formatDate(order.actualDelivery)}</div>
                                ) : order.estimatedDelivery ? (
                                  <div>Estimated delivery: {formatDate(order.estimatedDelivery)}</div>
                                ) : null}
                                {order.trackingNumber && (
                                  <div className="mt-1">
                                    Tracking: {order.trackingNumber} ({order.carrier})
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center py-6">
                <Button
                  onClick={loadMore}
                  loading={loadingMore}
                  variant="outline"
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading more orders...
                    </>
                  ) : (
                    'Load More Orders'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => fetchOrders(1, false)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}