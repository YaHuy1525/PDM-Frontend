const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  devServer: {
    watchFiles: ['./src/index.html'], // Use single quotes
    hot: true, // Add hot module replacement
    open: true, // Auto-open browser
    port: 8080 // Specify port explicitly
  }
});
