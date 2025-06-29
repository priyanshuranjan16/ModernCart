import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: string;
  trackingNumber?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'MC-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 299.99,
    items: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 249.99,
        quantity: 1
      }
    ],
    shippingAddress: '123 Main Street, New York, NY 10001',
    trackingNumber: 'TRK123456789'
  },
  {
    id: '2',
    orderNumber: 'MC-2024-002',
    date: '2024-01-20',
    status: 'shipped',
    total: 599.98,
    items: [
      {
        id: '2',
        name: 'Smart Watch Series X',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 399.99,
        quantity: 1
      },
      {
        id: '3',
        name: 'Professional Running Shoes',
        image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 99.99,
        quantity: 2
      }
    ],
    shippingAddress: '123 Main Street, New York, NY 10001',
    trackingNumber: 'TRK987654321'
  },
  {
    id: '3',
    orderNumber: 'MC-2024-003',
    date: '2024-01-25',
    status: 'processing',
    total: 449.99,
    items: [
      {
        id: '4',
        name: 'Designer Leather Jacket',
        image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=200',
        price: 449.99,
        quantity: 1
      }
    ],
    shippingAddress: '123 Main Street, New York, NY 10001'
  }
];

export function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const filteredOrders = selectedTab === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedTab);

  const tabs = [
    { key: 'all', label: 'All Orders', count: mockOrders.length },
    { key: 'pending', label: 'Pending', count: mockOrders.filter(o => o.status === 'pending').length },
    { key: 'shipped', label: 'Shipped', count: mockOrders.filter(o => o.status === 'shipped').length },
    { key: 'delivered', label: 'Delivered', count: mockOrders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Order Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <Badge variant="secondary" size="sm" className="ml-2">
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Package className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h2>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <Button>
                Start Shopping
              </Button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={getStatusColor(order.status)} className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatPrice(order.total)}</div>
                    <div className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-primary-600">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        <Truck className="h-4 w-4 mr-2" />
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
            ))
          )}
        </div>

        {/* Order Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {mockOrders.length}
            </div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {formatPrice(mockOrders.reduce((sum, order) => sum + order.total, 0))}
            </div>
            <div className="text-gray-600">Total Spent</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-accent-600 mb-2">
              {mockOrders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-gray-600">Delivered Orders</div>
          </div>
        </div>
      </div>
    </div>
  );
}