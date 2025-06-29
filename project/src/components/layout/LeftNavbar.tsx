import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  Heart, 
  User, 
  ShoppingCart,
  Package,
  Truck,
  HelpCircle,
  Phone,
  Info,
  RotateCcw,
  Shield,
  FileText,
  Briefcase,
  History
} from 'lucide-react';

export function LeftNavbar() {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/cart', label: 'Cart', icon: ShoppingCart },
    { path: '/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/orders', label: 'Past Orders', icon: Package },
    { path: '/order-history', label: 'Order History', icon: History },
    { path: '/tracking', label: 'Order Tracking', icon: Truck },
  ];

  const supportItems = [
    { path: '/contact', label: 'Contact', icon: Phone },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
    { path: '/shipping', label: 'Shipping', icon: Truck },
    { path: '/returns', label: 'Returns', icon: RotateCcw },
  ];

  const companyItems = [
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/careers', label: 'Careers', icon: Briefcase },
    { path: '/privacy', label: 'Privacy', icon: Shield },
    { path: '/terms', label: 'Terms', icon: FileText },
  ];

  const NavSection = ({ title, items }: { title: string; items: any[] }) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto z-30">
      <div className="p-4">
        <NavSection title="Main" items={navigationItems} />
        <NavSection title="Support" items={supportItems} />
        <NavSection title="Company" items={companyItems} />
        
        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Get in touch with our support team
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-white rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}