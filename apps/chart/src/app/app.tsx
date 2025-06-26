// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { CartModal, CartPage } from '@mf-demo/cart-components';

// Export individual components for different use cases
export { CartModal as CartModalComponent, CartPage as CartPageComponent } from '@mf-demo/cart-components';

// Default export - can be either modal or page based on props
interface AppProps {
  mode?: 'modal' | 'page';
  isOpen?: boolean;
  onClose?: () => void;
}

export function App({ mode = 'page', isOpen, onClose }: AppProps) {
  if (mode === 'modal') {
    return <CartModal isOpen={isOpen} onClose={onClose} />;
  }
  
  return <CartPage />;
}

export default App;
