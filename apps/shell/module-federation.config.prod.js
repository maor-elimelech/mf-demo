/**
 * Production module federation config for shell app
 * Update the chart URL to match your Vercel deployment URL
 */
module.exports = {
  name: 'shell',
  remotes: [
    // Chart app deployed to Vercel
    ['chart', 'https://chart-mf-demo-3mvpukjuv-maor700s-projects.vercel.app/']
  ],
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