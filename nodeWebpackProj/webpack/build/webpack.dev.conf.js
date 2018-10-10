const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../util/webpack.index');
const util = require('../util/webpack.util');

module.exports = merge(baseWebpackConfig, {
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(config.build.cleanDirs),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin()
    ].concat(util.createHtml({
        favicon: path.resolve(__dirname, '../../src/img/favicon.ico'),
        multipleEntry: config.mulitpleEntry.base,
        template: path.resolve(__dirname, '../../src/views/template/layout.html'),
        filepath: path.resolve(__dirname, '../../src/views/layout'),
        chunks: ['common']
    })).concat(util.createHtml({
        splitWord: path.join('controller', 'm'),
        multipleEntry: config.mulitpleEntry.m,
        template: path.resolve(__dirname, '../../src/views/template/mlayout.html'),
        filepath: path.resolve(__dirname, '../../src/views/m/layout'),
    })),
    devServer: {
        port: 8001,
    }
})