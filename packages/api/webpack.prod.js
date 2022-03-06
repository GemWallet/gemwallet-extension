const path = require('path');
const webpackCommon = require('./webpack.common');

module.exports = {
  ...webpackCommon,
  mode: 'production',
  output: {
    filename: 'gemwallet-api.js',
    library: 'gemWalletApi',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../..', 'dist')
  }
};
