/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
module.exports = {
  name: 'chart',
  exposes: {
    './Module': './src/remote-entry.ts',
    './CartModal': './src/app/app.tsx',
    './CartPage': './src/app/app.tsx',
  },
  shared: (libraryName, defaultConfig) => {
    // Share all our workspace packages
    if (libraryName === '@mf-demo/chat-mcp-lib' || libraryName === '@mf-demo/store' || libraryName === '@mf-demo/cart-components') {
      return {
        singleton: true,
        requiredVersion: false,
      };
    }
    
    // Return default configuration for other packages
    return defaultConfig;
  },
};
