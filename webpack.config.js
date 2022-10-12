const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        otDnsScript1: './src/js/ot-dns-script-1.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false,
    },
};
