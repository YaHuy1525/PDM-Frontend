const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: './dist'
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 3000,
    proxy: [{
      context: ['/api'],
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false
    }]
  }
});
