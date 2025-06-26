import { useShopStore } from './store';

describe('useShopStore', () => {
  it('should initialize with mock items', () => {
    const { items } = useShopStore.getState();
    expect(items.length).toBeGreaterThan(0);
  });

  it('should add items to cart', () => {
    const { items, addToCart } = useShopStore.getState();
    const testItem = items[0];
    
    addToCart(testItem);
    
    const updatedCart = useShopStore.getState().cart;
    expect(updatedCart.length).toBe(1);
    expect(updatedCart[0].item.id).toBe(testItem.id);
    expect(updatedCart[0].quantity).toBe(1);
  });
});
