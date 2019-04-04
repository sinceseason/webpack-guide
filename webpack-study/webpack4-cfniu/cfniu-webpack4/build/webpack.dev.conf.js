// development
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const util = require('../config/webpack.util');
const config = require('../config/webpack.index');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
    size: 4
});

const devWebpackConfig = merge(baseWebpackConfig, {
    devtool: config.build.sourceMap,
    performance: {
        hints: false
    },
    plugins: [
        // new webpack.DefinePlugin(config.systemEnv()),
        new CleanWebpackPlugin(config.build.cleanDirs, {
            root: path.resolve(__dirname, '..')
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
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: [
                        ["@babel/preset-env", {
                            "useBuiltIns": "usage",
                        }]
                    ],
                },
            }]
        })
    ].concat(util.createHtmlWebpackPlugin({
        chunks: ['manifest', 'vendor'],
        mulitpleEntry: config.mulitpleEntry.pc,
        template: path.resolve(__dirname, '..', 'src/templates/layout.html'),
        filename: path.resolve(__dirname, '..', 'views/layout')
    })).concat(util.createHtmlWebpackPlugin({
        splitWord: path.join('controller', 'm'),
        chunks: ['manifest'],
        mulitpleEntry: config.mulitpleEntry.m,
        template: path.resolve(__dirname, '..', 'src/templates/m/layout.html'),
        filename: path.resolve(__dirname, '..', 'views/m/layout')
    })).concat([
        new HtmlWebpackHarddiskPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        // new webpack.NamedModulesPlugin(),
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
    },
    devServer: {
        port: process.env.WEBCAT_ENV == 'webcat' ? 80 : 4000,
        host: process.env.WEBCAT_ENV == 'webcat' ? 'www.cfniu.com' : 'localhost',
        hot: true,
        index: '/',
        proxy: {
            '/dm': {
                target: 'http://139.199.49.71',
                pathRewrite: {
                    '^/dm': ''
                }
            },
            '/image.cfniu.com': {
                target: 'http://47.96.280.187:8103',
                pathRewrite: {
                    '^/image.cfniu.com': ''
                }
            },
            '/**/*.api': "http://47.96.230.187:34534",
            '/**/*.cms': "http://47.110.120.169:8081",
            '/u/cms/www/*': "http://47.110.120.169:8081",
            '/static': "http://47.96.230.187:9100",
            '/': 'http://localhost:3000'
        }
    },
    
})

module.exports = devWebpackConfig;