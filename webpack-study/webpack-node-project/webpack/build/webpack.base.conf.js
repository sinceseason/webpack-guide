const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = require('../util/webpack.index');
const util = require('../util/webpack.util');

module.exports = {
    mode: process.env.NODE_ENV,
    entry: () => {
        let entry = util.mergeEntry(config.mulitpleEntry);
        entry['common'] = path.resolve(__dirname, '../../src/js/lib/common.js');
        return entry;
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: 'js/[name].js',
    },
    resolve: {
        alias: {
            Service: path.resolve(__dirname, '../../src/js/service') 
        },
        modules:[path.resolve(__dirname, '../../src',), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: ['happypack/loader?id=babel']
                // use: {
                    // loader: 'happypack/loader?id=babel',
                    // loader: 'babel-loader?cacheDirectory',
                    // options: {
                    //     presets: [
                    //         ["@babel/preset-env", {
                    //             "useBuiltIns": "usage",
                    //         }]
                    //     ],
                    // }
                // },
            },{
                test: /\.(woff|woff2|eot|ttf|otf)\??.*$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        publicPath: config.build.asstesStaticPath,
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                    }
                }
            },{
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 1,
                        context: path.resolve(__dirname, '..', 'src'),
                        name: '[path][name].[ext]',
                        fallback: 'file-loader',
                    }
                }]
            },{
                test: /\.css$/,
                use: process.env.NODE_ENV === 'production'
                ? [MiniCssExtractPlugin.loader, 'fast-css-loader']
                : 'happypack/loader?id=css'
            },{
                test: /\.scss$/,
                use: process.env.NODE_ENV === 'production'
                ? [MiniCssExtractPlugin.loader, 'fast-css-loader', 'fast-sass-loader']
                : 'happypack/loader?id=scss'
            }
        ]
    }
}