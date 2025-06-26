const { NxAppRspackPlugin } = require('@nx/rspack/app-plugin');
const { NxReactRspackPlugin } = require('@nx/rspack/react-plugin');
const {
  NxModuleFederationPlugin,
  NxModuleFederationDevServerPlugin,
} = require('@nx/module-federation/rspack');
const { join } = require('path');

// Use production config if available, otherwise fall back to dev config
const baseConfig = process.env.NODE_ENV === 'production' 
  ? require('./module-federation.config.prod')
  : require('./module-federation.config');

const prodConfig = baseConfig;

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    publicPath: 'auto',
  },
  devServer: {
    port: 4200,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
  },
  plugins: [
    new NxAppRspackPlugin({
      tsConfig: './tsconfig.app.json',
      main: './src/main.ts',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.css'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactRspackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
    new NxModuleFederationPlugin({ config: prodConfig }, { dts: false }),
    new NxModuleFederationDevServerPlugin({ config: prodConfig }),
  ],
};
