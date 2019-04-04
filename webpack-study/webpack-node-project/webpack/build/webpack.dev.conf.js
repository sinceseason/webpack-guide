const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });

const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../util/webpack.index');
const util = require('../util/webpack.util');

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin(config.systemEnv()),
        new CleanWebpackPlugin(config.build.cleanDirs, {
            root: path.resolve(__dirname, '../../')
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            loaders: [ 'style-loader', 'fast-css-loader' ]
        }),
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            loaders: ['style-loader', 'fast-css-loader', 'fast-sass-loader']
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: [{
                // ERROR: Cannot find module 'babel-loader\lib\index.js?cacheDirectory', move to options
                // loader: 'babel-loader?cacheDirectory',
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        ["@babel/preset-env", {
                            "useBuiltIns": "usage",
                        }]
                    ],
                }
            }]
        }),
    ].concat(util.createHtml({
        favicon: path.resolve(__dirname, '../../src/img/favicon.ico'),
        multipleEntry: config.mulitpleEntry.base,
        template: path.resolve(__dirname, '../../src/views/template/layout.html'),
        filepath: path.resolve(__dirname, '../../src/views/layout'),
        chunks: ['common', 'manifest'],
    })).concat(util.createHtml({
        favicon: path.resolve(__dirname, '../../src/img/favicon.ico'),
        splitWord: path.join('controller', 'm'),
        multipleEntry: config.mulitpleEntry.m,
        template: path.resolve(__dirname, '../../src/views/template/mlayout.html'),
        filepath: path.resolve(__dirname, '../../src/views/m/layout'),
        chunks: ['manifest'],
    })).concat([
        new HtmlWebpackHarddiskPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedModulesPlugin(),
        new CopyWebpackPlugin([{
            from: 'src/img/',
            to: 'images/'
        }])
    ]),
    optimization: {
        splitChunks: {
            cacheGroups: {
				manifest: {
                    name: "manifest",
                    chunks: 'initial',
                    minChunks: 2,
                },
                // TODO: entry vendor 指定 node_modules 中的引用内容
                // vendor: {
                //     test: /[\\/]node_modules[\\/]/,
                //     name: "vendor",
                //     chunks: "all",
                //     enforce: true,
                // }
			}
        },
    },
    devServer: {
        port: 8001,
        hot: true,
        proxy: {
            '/': 'http://localhost:3100'
        }
    }
})