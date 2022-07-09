const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackCommon = require('./webpack.common');

module.exports = {
  ...webpackCommon,
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'build'),
    historyApiFallback: true,
    hot: true,
    port: 8080
  },
  plugins: [
    ...webpackCommon.plugins,
    // new HtmlWebpackPlugin({})
    new HtmlWebpackPlugin({
      title: 'GemWallet API',
      favicon: path.join(__dirname, './templates/logo192.png'),
      template: path.resolve(__dirname, './templates/index.html')
    }),
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin()
  ]
};
