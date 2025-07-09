import React from 'react';
import { useShopStore } from '@mf-demo/store';

interface CartButtonProps {
  onClick?: () => void;
  className?: string;
}

export function CartButton({ onClick, className = '' }: CartButtonProps): React.ReactElement {
  const { getCartItemsCount, toggleCart } = useShopStore();
  const itemCount = getCartItemsCount();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleCart();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className}`}
    >
      <span className="mr-2">🛒</span>
      Cart
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {itemCount}
        </span>
      )}
    </button>
  );
} 