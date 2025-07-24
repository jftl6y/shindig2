const webpack = require('webpack');

module.exports = (config, options) => {
  // Add Node.js polyfills for browser environment
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "process": require.resolve("process/browser"),
    "buffer": require.resolve("buffer"),
    "util": require.resolve("util"),
    "url": require.resolve("url"),
    "stream": require.resolve("stream-browserify")
  };

  // Add plugins for Node.js globals
  config.plugins = config.plugins || [];
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      global: 'globalThis',
    })
  );

  return config;
};
