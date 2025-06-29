import React from 'react';
import { Heart, ShoppingCart, Trash2, Share2 } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function WishlistPage() {
  const { wishlistItems, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = async (productId: string, wishlistItemId: string) => {
    await addToCart(productId);
    // Optionally remove from wishlist after adding to cart
    // await removeFromWishlist(wishlistItemId);
  };

  if (loading) {
    return (
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
          <div className="text-center py-12">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love for later by clicking the heart icon.</p>
            <Button>
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" size="md">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </Badge>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share Wishlist
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            const discountPercentage = product.sale_price 
              ? Math.round(((product.price - product.sale_price) / product.price) * 100)
              : 0;

            return (
              <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
                <div className="relative">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {product.sale_price && (
                    <Badge
                      variant="danger"
                      className="absolute top-3 left-3"
                    >
                      {discountPercentage}% OFF
                    </Badge>
                  )}

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="secondary">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {product.sale_price ? (
                      <>
                        <span className="text-lg font-bold text-primary-600">
                          {formatPrice(product.sale_price)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-primary-600">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <Badge variant="warning" size="sm" className="mb-3">
                      Only {product.stock_quantity} left
                    </Badge>
                  )}

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAddToCart(product.id, item.id)}
                      disabled={product.stock_quantity === 0}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Added {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wishlist Actions */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Love everything in your wishlist?</h3>
              <p className="text-gray-600">Add all available items to your cart at once.</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                Add All to Cart
              </Button>
              <Button variant="outline">
                Clear Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">You might also like</h2>
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Based on your wishlist, we think you'll love these similar products.
            </p>
            <Button>
              Discover More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}