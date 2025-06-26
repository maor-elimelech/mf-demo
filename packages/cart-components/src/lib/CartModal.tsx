import React from 'react';
import { useShopStore } from '@mf-demo/store';
import { CartItem } from './CartItem';

interface CartModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, isCartOpen, setCartOpen, getTotalPrice, clearCart } = useShopStore();
  
  const modalIsOpen = isOpen !== undefined ? isOpen : isCartOpen;
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setCartOpen(false);
    }
  };

  const handleCheckout = () => {
    alert(`Checkout successful! Total: $${getTotalPrice().toFixed(2)}`);
    clearCart();
    handleClose();
  };

  if (!modalIsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={handleClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-6xl mb-4">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              cart.map((cartItem) => (
                <CartItem 
                  key={cartItem.item.id} 
                  cartItem={cartItem} 
                  showControls={true}
                />
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold">Total: ${getTotalPrice().toFixed(2)}</span>
                <button
                  onClick={clearCart}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 