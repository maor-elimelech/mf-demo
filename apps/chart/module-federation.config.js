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
};
