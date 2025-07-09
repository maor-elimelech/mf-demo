import { useState, useCallback } from 'react';
import { ChatMcp, type ChatMcpConfig, type MCPTool, type MCPToolResult } from '@mf-demo/chat-mcp-lib';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Example shop tools that the chat can use
  const createShopTools = useCallback((): MCPTool[] => {
    return [
      {
        name: 'get_products',
        description: 'Get a list of available products in the shop',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by product category (optional)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of products to return (optional)',
            },
          },
          required: [],
        },
        handler: async (params: Record<string, unknown>): Promise<MCPToolResult> => {
          // Mock products data
          const products = [
            { id: 1, name: 'Wireless Headphones', price: 99.99, category: 'electronics' },
            { id: 2, name: 'Coffee Mug', price: 14.99, category: 'kitchen' },
            { id: 3, name: 'Yoga Mat', price: 29.99, category: 'fitness' },
          ];

          let filteredProducts = products;
          
          if (params.category) {
            filteredProducts = products.filter(p => p.category === params.category);
          }
          
          if (params.limit) {
            filteredProducts = filteredProducts.slice(0, params.limit as number);
          }

          return {
            content: [
              {
                type: 'text',
                text: `Here are the available products:\n\n${filteredProducts
                  .map(p => `• ${p.name} - $${p.price} (${p.category})`)
                  .join('\n')}`,
              },
            ],
          };
        },
      },
      {
        name: 'add_to_cart',
        description: 'Add a product to the shopping cart',
        inputSchema: {
          type: 'object',
          properties: {
            productId: {
              type: 'number',
              description: 'The ID of the product to add to cart',
            },
            quantity: {
              type: 'number',
              description: 'The quantity to add (optional, defaults to 1)',
            },
          },
          required: ['productId'],
        },
        handler: async (params: Record<string, unknown>): Promise<MCPToolResult> => {
          const productId = params.productId as number;
          const quantity = (params.quantity as number) || 1;

          // Mock adding to cart
          return {
            content: [
              {
                type: 'text',
                text: `Successfully added ${quantity} unit(s) of product ${productId} to your cart! 🛒`,
              },
            ],
          };
        },
      },
      {
        name: 'get_cart_status',
        description: 'Get current cart status and items',
        inputSchema: {
          type: 'object',
          properties: {},
          required: [],
        },
        handler: async (): Promise<MCPToolResult> => {
          // Mock cart data
          return {
            content: [
              {
                type: 'text',
                text: `Your cart contains:\n• 2x Wireless Headphones ($199.98)\n• 1x Coffee Mug ($14.99)\n\nTotal: $214.97`,
              },
            ],
          };
        },
      },
    ];
  }, []);

  // Chat configuration
  const chatConfig: ChatMcpConfig = {
    apiUrl: '/api/chat', // You'll need to create this API endpoint
    model: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
    tools: createShopTools(),
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        style={{ display: isOpen ? 'none' : 'block' }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-40 bg-white rounded-lg shadow-2xl transition-all duration-300 ${
            isMinimized ? 'h-16 w-80' : 'h-96 w-96'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <h3 className="font-semibold">Shop Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={isMinimized ? maximizeChat : minimizeChat}
                className="hover:bg-blue-700 p-1 rounded"
              >
                {isMinimized ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                )}
              </button>
              <button
                onClick={toggleChat}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <div className="h-80">
              <ChatMcp
                config={chatConfig}
                placeholder="Ask me about products, add items to cart, or get help..."
                showToolbar={false}
                maxHeight="100%"
                style={{ height: '100%', border: 'none', borderRadius: '0 0 8px 8px' }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ChatWidget; 