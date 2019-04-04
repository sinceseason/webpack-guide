// development
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const util = require('../config/webpack.util');
const config = require('../config/webpack.index');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
    size: 4
});
let devWebpackConfig = merge(baseWebpackConfig, {
    devtool: config.build.sourceMap,
    plugins: [
        // new webpack.DefinePlugin(config.systemEnv()),
        new CleanWebpackPlugin(config.build.cleanDirs, {
            root: path.resolve(__dirname, '..')
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
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),
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
    ].concat(util.createHtmlWebpackPlugin({
        chunks: ['manifest', 'vendor'],
        mulitpleEntry: config.mulitpleEntry.pc,
        template: path.resolve(__dirname, '..', 'src/templates/layout.html'),
        filename: path.resolve(__dirname, '..', 'views/layout')
    }))
    .concat(util.createHtmlWebpackPlugin({
        splitWord: path.join('controller', 'm'),
        chunks: ['manifest'],
        mulitpleEntry: config.mulitpleEntry.m,
        template: path.resolve(__dirname, '..', 'src/templates/m/layout.html'),
        filename: path.resolve(__dirname, '..', 'views/m/layout')
    })).concat([
        new HtmlWebpackHarddiskPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin([{
            from: 'src/images/',
            to: 'images/'
        }]),
    ]),
    optimization: {
        splitChunks: {
            cacheGroups: {
				manifest: {
                    name: "manifest",
                    chunks: 'initial',
                    minChunks: 2,
                },
			}
        },
        minimizer: [new OptimizeCSSAssetsPlugin()]
    },
})

module.exports = devWebpackConfig;