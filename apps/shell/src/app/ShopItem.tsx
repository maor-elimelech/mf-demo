import React from 'react';
import { Item, useShopStore } from '@mf-demo/store';

interface ShopItemProps {
  item: Item;
}

export const ShopItem: React.FC<ShopItemProps> = ({ item }) => {
  const { addToCart } = useShopStore();

  const handleAddToCart = () => {
    addToCart(item);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6 text-center">
        <div className="text-6xl mb-4">{item.image}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600">${item.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}; 