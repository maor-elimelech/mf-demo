import { CartButton, CartModal, CartPage, CartItem } from './cart-components';

describe('cartComponents', () => {
  it('should export all cart components', () => {
    expect(CartButton).toBeDefined();
    expect(CartModal).toBeDefined();
    expect(CartPage).toBeDefined();
    expect(CartItem).toBeDefined();
  });
});
