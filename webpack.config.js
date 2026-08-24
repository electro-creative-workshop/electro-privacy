const path = require('path');
const webpack = require('webpack');
const packageJSON = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    otDnsScript1: './src/js/ot-dns-script-1.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `version: ${packageJSON.version}`,
    }),
    new webpack.DefinePlugin({
      ELECTRO_PRIVACY_VERSION: JSON.stringify(packageJSON.version),
    }),
    new CopyPlugin({
      patterns: [{ from: 'src/language', to: 'lang' }],
    }),
  ],
};
