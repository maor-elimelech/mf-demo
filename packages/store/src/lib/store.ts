import { create } from 'zustand';

export interface Item {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  item: Item;
  quantity: number;
}

interface ShopState {
  items: Item[];
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (item: Item) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalPrice: () => number;
  getCartItemsCount: () => number;
}

// Mock data for the shop
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: '🎧',
    description: 'High-quality wireless headphones with noise cancellation'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: '⌚',
    description: 'Advanced smartwatch with health tracking features'
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 49.99,
    image: '💻',
    description: 'Ergonomic laptop stand for better posture'
  },
  {
    id: '4',
    name: 'Coffee Mug',
    price: 19.99,
    image: '☕',
    description: 'Ceramic coffee mug with temperature control'
  },
  {
    id: '5',
    name: 'Desk Lamp',
    price: 79.99,
    image: '💡',
    description: 'LED desk lamp with adjustable brightness'
  },
  {
    id: '6',
    name: 'Phone Case',
    price: 24.99,
    image: '📱',
    description: 'Protective phone case with wireless charging support'
  }
];

export const useShopStore = create<ShopState>((set, get) => ({
  items: mockItems,
  cart: [],
  isCartOpen: false,
  
  addToCart: (item: Item) => {
    const { cart } = get();
    const existingItem = cart.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      set({
        cart: cart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      });
    } else {
      set({
        cart: [...cart, { item, quantity: 1 }]
      });
    }
  },
  
  removeFromCart: (itemId: string) => {
    const { cart } = get();
    set({
      cart: cart.filter(cartItem => cartItem.item.id !== itemId)
    });
  },
  
  updateQuantity: (itemId: string, quantity: number) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    
    set({
      cart: cart.map(cartItem =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity }
          : cartItem
      )
    });
  },
  
  clearCart: () => {
    set({ cart: [] });
  },
  
  toggleCart: () => {
    set(state => ({ isCartOpen: !state.isCartOpen }));
  },
  
  setCartOpen: (isOpen: boolean) => {
    set({ isCartOpen: isOpen });
  },
  
  getTotalPrice: () => {
    const { cart } = get();
    return cart.reduce((total, cartItem) => 
      total + (cartItem.item.price * cartItem.quantity), 0
    );
  },
  
  getCartItemsCount: () => {
    const { cart } = get();
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
  }
}));
