import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useShopStore } from '@mf-demo/store';
import { CartButton, CartModal } from '@mf-demo/cart-components';
import { ShopItem } from './ShopItem';
import { ChatWidget } from './ChatWidget';

const Chart = React.lazy(() => import('chart/Module'));

export function App() {
  const { items } = useShopStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                🛍️ Federated Shop
              </Link>
              <nav className="flex space-x-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/cart" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Cart Page
                </Link>
              </nav>
            </div>
            <CartButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route 
            path="/" 
            element={
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Our Store</h1>
                  <p className="text-gray-600">Discover amazing products with federated modules!</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <ShopItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <React.Suspense fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="text-xl">Loading cart...</div>
                </div>
              }>
                <Chart mode="page" />
              </React.Suspense>
            } 
          />
        </Routes>
      </main>

      {/* Cart Modal */}
      <CartModal />
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

export default App;
