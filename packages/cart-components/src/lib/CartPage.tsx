import React from 'react';
import { useShopStore } from '@mf-demo/store';
import { CartItem } from './CartItem';

export function CartPage(): React.ReactElement {
  const { cart, getTotalPrice, clearCart } = useShopStore();

  const handleCheckout = () => {
    alert(`Checkout successful! Total: $${getTotalPrice().toFixed(2)}`);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some items to your cart to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.map((cartItem) => (
                <CartItem 
                  key={cartItem.item.id} 
                  cartItem={cartItem} 
                  showControls={true}
                />
              ))}
            </div>
            
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-lg text-gray-600">
                    Items: {cart.reduce((total, item) => total + item.quantity, 0)}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    Total: ${getTotalPrice().toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={clearCart}
                  className="px-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 