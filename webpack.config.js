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
      'process.env.AZURE_STORAGE_ACCOUNT_NAME': JSON.stringify(process.env.AZURE_STORAGE_ACCOUNT_NAME),
      'process.env.AZURE_STORAGE_SAS_TOKEN': JSON.stringify(process.env.AZURE_STORAGE_SAS_TOKEN),
      'process.env.AZURE_STORAGE_TABLE_NAME': JSON.stringify(process.env.AZURE_STORAGE_TABLE_NAME),
      'process.env.AZURE_STORAGE_COMMENT_TABLE_NAME': JSON.stringify(process.env.AZURE_STORAGE_COMMENT_TABLE_NAME)
    })
  );

  return config;
};
