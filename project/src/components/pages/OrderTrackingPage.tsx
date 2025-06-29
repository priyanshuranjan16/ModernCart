import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  isCompleted: boolean;
}

interface TrackingInfo {
  trackingNumber: string;
  orderNumber: string;
  status: 'in_transit' | 'delivered' | 'pending' | 'exception';
  estimatedDelivery: string;
  carrier: string;
  events: TrackingEvent[];
  packageInfo: {
    weight: string;
    dimensions: string;
    service: string;
  };
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

// Create different tracking data for different tracking numbers
const createTrackingData = (trackingNumber: string): TrackingInfo => {
  const baseData = {
    trackingNumber,
    orderNumber: trackingNumber === 'TRK123456789' ? 'MC-2024-001' : 
                 trackingNumber === 'TRK987654321' ? 'MC-2024-002' : 'MC-2024-003',
    carrier: 'FedEx',
    packageInfo: {
      weight: '2.5 lbs',
      dimensions: '12" x 8" x 4"',
      service: 'FedEx Ground'
    },
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    }
  };

  if (trackingNumber === 'TRK123456789') {
    return {
      ...baseData,
      status: 'delivered',
      estimatedDelivery: '2024-01-18',
      events: [
        {
          id: '1',
          status: 'Order Placed',
          description: 'Your order has been placed and is being prepared for shipment.',
          location: 'ModernCart Warehouse, CA',
          timestamp: '2024-01-15T10:00:00Z',
          isCompleted: true
        },
        {
          id: '2',
          status: 'Order Processed',
          description: 'Your order has been processed and packaged.',
          location: 'ModernCart Warehouse, CA',
          timestamp: '2024-01-16T14:30:00Z',
          isCompleted: true
        },
        {
          id: '3',
          status: 'Shipped',
          description: 'Your package has been picked up by the carrier.',
          location: 'Los Angeles, CA',
          timestamp: '2024-01-17T09:15:00Z',
          isCompleted: true
        },
        {
          id: '4',
          status: 'Delivered',
          description: 'Package delivered successfully to your address.',
          location: 'New York, NY',
          timestamp: '2024-01-18T15:30:00Z',
          isCompleted: true
        }
      ]
    };
  } else if (trackingNumber === 'TRK987654321') {
    return {
      ...baseData,
      status: 'in_transit',
      estimatedDelivery: '2024-01-28',
      events: [
        {
          id: '1',
          status: 'Order Placed',
          description: 'Your order has been placed and is being prepared for shipment.',
          location: 'ModernCart Warehouse, CA',
          timestamp: '2024-01-20T10:00:00Z',
          isCompleted: true
        },
        {
          id: '2',
          status: 'Order Processed',
          description: 'Your order has been processed and packaged.',
          location: 'ModernCart Warehouse, CA',
          timestamp: '2024-01-21T14:30:00Z',
          isCompleted: true
        },
        {
          id: '3',
          status: 'Shipped',
          description: 'Your package has been picked up by the carrier.',
          location: 'Los Angeles, CA',
          timestamp: '2024-01-22T09:15:00Z',
          isCompleted: true
        },
        {
          id: '4',
          status: 'In Transit',
          description: 'Your package is on its way to the destination.',
          location: 'Phoenix, AZ',
          timestamp: '2024-01-24T16:45:00Z',
          isCompleted: true
        },
        {
          id: '5',
          status: 'Out for Delivery',
          description: 'Your package is out for delivery and will arrive today.',
          location: 'New York, NY',
          timestamp: '',
          isCompleted: false
        },
        {
          id: '6',
          status: 'Delivered',
          description: 'Package delivered successfully.',
          location: 'New York, NY',
          timestamp: '',
          isCompleted: false
        }
      ]
    };
  } else {
    return {
      ...baseData,
      status: 'pending',
      estimatedDelivery: '2024-01-30',
      events: [
        {
          id: '1',
          status: 'Order Placed',
          description: 'Your order has been placed and is being prepared for shipment.',
          location: 'ModernCart Warehouse, CA',
          timestamp: '2024-01-25T10:00:00Z',
          isCompleted: true
        },
        {
          id: '2',
          status: 'Order Processed',
          description: 'Your order is being processed and will be packaged soon.',
          location: 'ModernCart Warehouse, CA',
          timestamp: '',
          isCompleted: false
        },
        {
          id: '3',
          status: 'Shipped',
          description: 'Your package will be picked up by the carrier.',
          location: 'Los Angeles, CA',
          timestamp: '',
          isCompleted: false
        }
      ]
    };
  }
};

// Mock recent orders data
const mockRecentOrders = [
  {
    id: '1',
    orderNumber: 'MC-2024-001',
    trackingNumber: 'TRK123456789',
    status: 'delivered',
    deliveryDate: '2024-01-18'
  },
  {
    id: '2',
    orderNumber: 'MC-2024-002',
    trackingNumber: 'TRK987654321',
    status: 'in_transit',
    deliveryDate: null
  },
  {
    id: '3',
    orderNumber: 'MC-2024-003',
    trackingNumber: 'TRK555666777',
    status: 'processing',
    deliveryDate: null
  }
];

export function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentlyTracking, setCurrentlyTracking] = useState('');

  const handleTrackPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentlyTracking(trackingNumber);
    
    // Simulate API call
    setTimeout(() => {
      const validTrackingNumbers = ['TRK987654321', 'TRK123456789', 'TRK555666777'];
      if (validTrackingNumbers.includes(trackingNumber)) {
        setTrackingData(createTrackingData(trackingNumber));
      } else {
        setError('Tracking number not found. Please check and try again.');
        setTrackingData(null);
      }
      setLoading(false);
      setCurrentlyTracking('');
    }, 1000);
  };

  const handleQuickTrack = (orderTrackingNumber: string) => {
    setTrackingNumber(orderTrackingNumber);
    setError('');
    setLoading(true);
    setCurrentlyTracking(orderTrackingNumber);
    
    // Simulate API call
    setTimeout(() => {
      const validTrackingNumbers = ['TRK987654321', 'TRK123456789', 'TRK555666777'];
      if (validTrackingNumbers.includes(orderTrackingNumber)) {
        setTrackingData(createTrackingData(orderTrackingNumber));
      } else {
        setError('Tracking number not found. Please check and try again.');
        setTrackingData(null);
      }
      setLoading(false);
      setCurrentlyTracking('');
    }, 1000);
  };

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    if (!isCompleted) {
      return <Clock className="h-5 w-5 text-gray-400" />;
    }

    switch (status.toLowerCase()) {
      case 'order placed':
      case 'order processed':
        return <Package className="h-5 w-5 text-primary-600" />;
      case 'shipped':
      case 'in transit':
      case 'out for delivery':
        return <Truck className="h-5 w-5 text-primary-600" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TrackingInfo['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_transit':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'exception':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success" size="sm">Delivered</Badge>;
      case 'in_transit':
        return <Badge variant="primary" size="sm">In Transit</Badge>;
      case 'processing':
        return <Badge variant="warning" size="sm">Processing</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleTrackPackage} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your tracking number
              </label>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., TRK987654321"
                  className="flex-1"
                />
                <Button type="submit" loading={loading && currentlyTracking === trackingNumber}>
                  <Search className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            <p className="text-sm text-gray-600">
              You can find your tracking number in your order confirmation email or in your order history.
            </p>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Package Status Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order #{trackingData.orderNumber}
                  </h2>
                  <p className="text-gray-600">Tracking: {trackingData.trackingNumber}</p>
                </div>
                <Badge variant={getStatusColor(trackingData.status)} size="md">
                  {trackingData.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {trackingData.status === 'delivered' ? 'Delivered' : 'Estimated Delivery'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {trackingData.carrier}
                  </div>
                  <div className="text-sm text-gray-600">Carrier</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {trackingData.packageInfo.service}
                  </div>
                  <div className="text-sm text-gray-600">Service Type</div>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Tracking History</h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {trackingData.events.map((event, index) => (
                    <div key={event.id} className="relative flex items-start">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                        event.isCompleted 
                          ? 'bg-white border-primary-500' 
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        {getStatusIcon(event.status, event.isCompleted)}
                      </div>
                      
                      {/* Event content */}
                      <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${
                            event.isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {event.status}
                          </h4>
                          {event.timestamp && (
                            <span className="text-sm text-gray-500">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${
                          event.isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {event.description}
                        </p>
                        <div className={`flex items-center mt-2 text-sm ${
                          event.isCompleted ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Package & Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Package Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{trackingData.packageInfo.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions:</span>
                    <span className="font-medium">{trackingData.packageInfo.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{trackingData.packageInfo.service}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
                <div className="text-gray-600">
                  <div className="font-medium text-gray-900">{trackingData.shippingAddress.name}</div>
                  <div>{trackingData.shippingAddress.address}</div>
                  <div>
                    {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} {trackingData.shippingAddress.zip}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <h3 className="font-semibold text-gray-900">Need help with your order?</h3>
                  <p className="text-gray-600">Contact our customer support team for assistance.</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline">
                    Contact Support
                  </Button>
                  <Button variant="outline">
                    Report Issue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access to Recent Orders */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {mockRecentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="font-medium">Order #{order.orderNumber}</div>
                    {getOrderStatusBadge(order.status)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.status === 'delivered' && order.deliveryDate
                      ? `Delivered on ${new Date(order.deliveryDate).toLocaleDateString()}`
                      : `Tracking: ${order.trackingNumber}`
                    }
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleQuickTrack(order.trackingNumber)}
                  disabled={loading}
                  loading={loading && currentlyTracking === order.trackingNumber}
                >
                  Track
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}