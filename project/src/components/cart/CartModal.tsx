import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, loading } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart" maxWidth="lg">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={onClose}>Continue Shopping</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart" maxWidth="lg">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
            <img
              src={item.product?.image_url}
              alt={item.product?.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
              <p className="text-sm text-gray-500">
                {formatPrice(item.product?.sale_price || item.product?.price || 0)}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={loading}
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="w-8 text-center">{item.quantity}</span>
              
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={loading}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total: {formatPrice(getTotalPrice())}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Continue Shopping
            </Button>
            <Button className="flex-1">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}