import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { LeftNavbar } from './components/layout/LeftNavbar';
import { ProductGrid } from './components/products/ProductGrid';
import { ProductModal } from './components/products/ProductModal';
import { ProductFilters } from './components/filters/ProductFilters';
import { ProfilePage } from './components/pages/ProfilePage';
import { CartPage } from './components/pages/CartPage';
import { WishlistPage } from './components/pages/WishlistPage';
import { OrdersPage } from './components/pages/OrdersPage';
import { OrderHistoryPage } from './components/pages/OrderHistoryPage';
import { OrderTrackingPage } from './components/pages/OrderTrackingPage';
import { Product, Category } from './types';
import { mockProducts, mockCategories } from './data/mockData';

// Page components
function HomePage({ 
  products, 
  categories, 
  filteredProducts, 
  selectedProduct, 
  setSelectedProduct, 
  loading, 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  handleClearFilters 
}: any) {
  return (
    <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Discover Premium Products
          </h1>
          <p className="text-xl opacity-90">
            Shop the latest trends with unbeatable prices and exceptional quality
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              priceRange={priceRange}
              sortBy={sortBy}
              onCategoryChange={setSelectedCategory}
              onPriceRangeChange={setPriceRange}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
            />

            {/* Featured Categories */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Shop by Category</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={category.image_url} 
                        alt={category.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Offers */}
            <div className="mt-6 bg-gradient-to-br from-accent-500 to-accent-600 p-6 rounded-lg text-white">
              <h3 className="text-lg font-semibold mb-2">Special Offers</h3>
              <p className="text-sm opacity-90 mb-4">
                Get 20% off your first order with code WELCOME20
              </p>
              <button className="bg-white text-accent-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Shop Now
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content - Products Grid */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
              </h2>
              <p className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <ProductGrid
            products={filteredProducts}
            loading={loading}
            onProductClick={setSelectedProduct}
          />
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </main>
  );
}

function AboutPage() {
  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About ModernCart</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">
            ModernCart is your trusted online shopping destination, committed to providing premium products 
            and exceptional customer service since our founding.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To make premium products accessible to everyone while maintaining the highest standards 
                of quality and customer satisfaction.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="text-gray-600 space-y-2">
                <li>• Quality products from trusted brands</li>
                <li>• Exceptional customer service</li>
                <li>• Fast and reliable shipping</li>
                <li>• Secure and easy shopping experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Customer Service</h3>
                <p className="text-gray-600">1-800-MODERN-CART</p>
                <p className="text-gray-600">support@moderncart.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9AM - 8PM EST</p>
                <p className="text-gray-600">Saturday - Sunday: 10AM - 6PM EST</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">
                  123 Commerce Street<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
              </div>
              <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQPage() {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all items in original condition. Returns are free and easy - just contact our customer service team to get started."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 business days) and overnight shipping options are also available at checkout."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 50 countries worldwide. International shipping times and costs vary by destination."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and other digital wallet options."
    }
  ];

  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShippingPage() {
  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping Information</h1>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Shipping Options</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <h3 className="font-semibold">Standard Shipping</h3>
                  <p className="text-gray-600">3-5 business days</p>
                </div>
                <span className="font-semibold">FREE on orders $50+</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <h3 className="font-semibold">Express Shipping</h3>
                  <p className="text-gray-600">1-2 business days</p>
                </div>
                <span className="font-semibold">$9.99</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <h3 className="font-semibold">Overnight Shipping</h3>
                  <p className="text-gray-600">Next business day</p>
                </div>
                <span className="font-semibold">$19.99</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
            <p className="text-gray-600 mb-4">
              We ship to over 50 countries worldwide. International shipping costs and delivery times vary by destination.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Canada: 5-7 business days, starting at $12.99</li>
              <li>• Europe: 7-10 business days, starting at $19.99</li>
              <li>• Asia Pacific: 10-14 business days, starting at $24.99</li>
              <li>• Other regions: 14-21 business days, starting at $29.99</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReturnsPage() {
  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Returns & Exchanges</h1>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
            <p className="text-gray-600 mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              you can return it within 30 days of delivery for a full refund.
            </p>
            <h3 className="font-semibold mb-2">Return Requirements:</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Items must be in original condition with tags attached</li>
              <li>• Items must be returned within 30 days of delivery</li>
              <li>• Original packaging and accessories must be included</li>
              <li>• Some items (underwear, swimwear, personalized items) cannot be returned</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
            <ol className="text-gray-600 space-y-2">
              <li>1. Contact our customer service team to initiate a return</li>
              <li>2. Print the prepaid return label we'll email you</li>
              <li>3. Package your items securely with the return label</li>
              <li>4. Drop off at any authorized shipping location</li>
              <li>5. Receive your refund within 5-7 business days after we receive your return</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            make a purchase, or contact us for support.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use the information we collect to provide, maintain, and improve our services, 
            process transactions, and communicate with you.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
          <p className="text-gray-600 mb-4">
            We do not sell, trade, or otherwise transfer your personal information to third parties 
            without your consent, except as described in this policy.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at privacy@moderncart.com.
          </p>
        </div>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using ModernCart, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Use License</h2>
          <p className="text-gray-600 mb-4">
            Permission is granted to temporarily download one copy of ModernCart's materials 
            for personal, non-commercial transitory viewing only.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
          <p className="text-gray-600 mb-4">
            The materials on ModernCart are provided on an 'as is' basis. ModernCart makes no warranties, 
            expressed or implied, and hereby disclaims and negates all other warranties.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-600">
            If you have any questions about these Terms of Service, please contact us at legal@moderncart.com.
          </p>
        </div>
      </div>
    </div>
  );
}

function CareersPage() {
  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Careers</h1>
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals to join our growing team. 
              At ModernCart, we believe in creating an inclusive, innovative workplace where everyone can thrive.
            </p>
            
            <h3 className="text-lg font-semibold mb-4">Current Openings</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold">Senior Frontend Developer</h4>
                <p className="text-gray-600">Remote • Full-time</p>
                <p className="text-sm text-gray-500 mt-1">
                  Join our engineering team to build the next generation of e-commerce experiences.
                </p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold">Customer Success Manager</h4>
                <p className="text-gray-600">New York, NY • Full-time</p>
                <p className="text-sm text-gray-500 mt-1">
                  Help our customers succeed and grow their businesses with our platform.
                </p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold">Product Marketing Manager</h4>
                <p className="text-gray-600">San Francisco, CA • Full-time</p>
                <p className="text-sm text-gray-500 mt-1">
                  Drive product adoption and growth through strategic marketing initiatives.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-600 mb-4">
                Don't see a role that fits? We're always interested in hearing from talented individuals.
              </p>
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Send Us Your Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('name');

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProducts(mockProducts);
      setCategories(mockCategories);
      setFilteredProducts(mockProducts);
      setLoading(false);
    };

    loadData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.sale_price || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.sale_price || a.price) - (b.sale_price || b.price);
        case 'price-high':
          return (b.sale_price || b.price) - (a.sale_price || a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('name');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchQuery} />
        <LeftNavbar />
        
        <Routes>
          <Route path="/" element={
            <HomePage
              products={products}
              categories={categories}
              filteredProducts={filteredProducts}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              handleClearFilters={handleClearFilters}
            />
          } />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-history" element={<OrderHistoryPage />} />
          <Route path="/tracking" element={<OrderTrackingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/careers" element={<CareersPage />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-16 ml-64">
          <div className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">ModernCart</h3>
                <p className="text-gray-400">
                  Your trusted online shopping destination for premium products and exceptional service.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/" className="hover:text-white transition-colors">Electronics</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Fashion</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Home & Garden</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Sports</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
                  <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                  <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 ModernCart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;