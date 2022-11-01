const path = require('path');
const webpack = require('webpack');
const VersionFile = require('webpack-version-file');
const packageJSON = require('./package.json');

module.exports = {
    mode: 'production',
    entry: {
        otDnsScript1: './src/js/ot-dns-script-1.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false,
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: (version) => {
                return `version: ${packageJSON.version}`;
            },
        }),
    ],
};
