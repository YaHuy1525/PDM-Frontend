const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/'
    },
    watchFiles: ['./src/index.html'],
    hot: true,
    open: true,
    port: 5000,
    proxy: [{
      context: ['/api'],
      target: 'http://localhost:8080',
      secure: false,
      changeOrigin: true
    }]
  }
});
