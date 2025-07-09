import React from 'react';
import { CartItem as CartItemType, useShopStore } from '@mf-demo/store';

interface CartItemProps {
  cartItem: CartItemType;
  showControls?: boolean;
}

export function CartItem({ cartItem, showControls = true }: CartItemProps): React.ReactElement {
  const { updateQuantity, removeFromCart } = useShopStore();
  const { item, quantity } = cartItem;

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <div className="text-4xl mr-4">{item.image}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
        <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
      </div>
      {showControls && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
          >
            +
          </button>
          <button
            onClick={handleRemove}
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      )}
      {!showControls && (
        <div className="text-right">
          <p className="text-sm text-gray-600">Qty: {quantity}</p>
          <p className="font-bold">${(item.price * quantity).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
} 