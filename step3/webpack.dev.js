const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const webpack = require('webpack');

const config = require('./webpack.index');
const util = require('./webpack.util');

module.exports = {
    // 提取为方法改写
    // entry: {
    //     login: './src/js/login.js',
    //     user: './src/js/user.js',
    //     common: './src/lib/common.js'
    // },
    entry: () => {
        let entry = config.mulitpleEntry;
        entry['common'] = './src/lib/common.js';
        return entry;
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.html$/,
            loader: 'html-loader'
        }]
    },
    plugins: [
        // 清理文件
        new CleanWebpackPlugin(['dist', 'views/layout']),
        // 将js引入到html文件中 => 提取为公用方法
        // new HtmlWebpackPlugin({
        //     filename: path.resolve(__dirname, 'views/layout/user.html'),
        //     template: './views/template/layout.html',
        //     chunks: ['common', 'user']
        // }),
        // new HtmlWebpackPlugin({
        //     filename: path.resolve(__dirname, 'views/layout/login.html'),
        //     template: './views/template/layout.html',
        //     chunks: ['common', 'login'],
        //     alwaysWriteToDisk: true
        // }),
        // new HtmlWebpackHarddiskPlugin()
    ]
    .concat(util.createHtml({
        multipleEntry: config.mulitpleEntry,
        filepath: path.resolve(__dirname, './views/layout'),
        template: path.resolve(__dirname, './views/template/layout.html'),
        chunks: ['common']
    })).concat([
        new HtmlWebpackHarddiskPlugin()
    ])
};