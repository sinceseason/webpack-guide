const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../util/webpack.index');
const util = require('../util/webpack.util');

module.exports = merge(baseWebpackConfig, {
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin(config.build.cleanDirs, {
            root: path.resolve(__dirname, '../../')
        }),
        // new ExtractTextPlugin('style/[name].css')
    ].concat(util.createHtml({
        favicon: path.resolve(__dirname, '../../src/img/favicon.ico'),
        multipleEntry: config.mulitpleEntry.base,
        template: path.resolve(__dirname, '../../src/views/template/layout.html'),
        filepath: path.resolve(__dirname, '../../src/views/layout'),
        chunks: ['common']
    })).concat(util.createHtml({
        favicon: path.resolve(__dirname, '../../src/img/favicon.ico'),
        splitWord: path.join('controller', 'm'),
        multipleEntry: config.mulitpleEntry.m,
        template: path.resolve(__dirname, '../../src/views/template/mlayout.html'),
        filepath: path.resolve(__dirname, '../../src/views/m/layout'),
    })).concat([
        new HtmlWebpackHarddiskPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin([{
            from: 'src/img/',
            to: 'images/'
        }])
    ]),
    devServer: {
        port: 8001,
        hot: true,
        proxy: {
            '/': 'http://localhost:3100'
        }
    }
})