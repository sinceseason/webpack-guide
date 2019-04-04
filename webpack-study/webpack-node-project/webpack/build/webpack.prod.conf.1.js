const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const baseWebpackConfig = require('./webpack.base.conf');
const config = require('../util/webpack.index');
const util = require('../util/webpack.util');

module.exports = merge(baseWebpackConfig, {
    plugins: [
        new CleanWebpackPlugin(config.build.cleanDirs, {
            root: path.resolve(__dirname, '../../')
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            loaders: [{
                loader: 'css-loader',
                options: {
                    minimize: true
                }
            }]
        }),
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            loaders: [
                'css-loader',
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                    outputStyle: 'compressed'
                }
            }]
        }),
        new HappyPack({
            id: 'babel',
            threadPool: happyThreadPool,
            loaders: [{
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
        new ExtractTextPlugin('style/[name].css'),
        new ParallelUglifyPlugin({
            cache: true,
            uglifyJS: {
                output:{
                    beautify: false,
                    comments: false,
                },
                compress: {
                    warnings: false,
                    drop_console: true,
                    collapse_vars: true,
                    reduce_vars: false,
                }
            }
        })
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
        new webpack.HashedModuleIdsPlugin(),
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
    }
})