let path = require('path');
let ExtractTextPlugin = require("extract-text-webpack-plugin");

let config = require('../config/webpack.index');
let util = require('../config/webpack.util');

console.log('process.env.ENV:' + process.env.ENV);
console.log('process.env.NODE_ENV:' + process.env.NODE_ENV);
console.log(process.env.NODE_ENV == 'development');
console.log('process.env.WEBCAT_ENV:' + process.env.WEBCAT_ENV);

module.exports = {
    mode: process.env.NODE_ENV,
    context: path.resolve(__dirname, '../'),
    entry: function () {
        let entry = util.mergeEntry(config.mulitpleEntry);
        entry['vendor'] = './src/js/libs/vendor.js';
        return entry;
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: 'js/[name].js',
    },
    resolve: {
        alias: {
            Service: path.resolve(__dirname, '../src/js/service'),
        },
        modules: [path.resolve(__dirname, '../src'), 'node_modules']
    },
    externals: {
        jquery: 'jQuery',
        $: 'jQuery',
        juicer: 'juicer',
        numeral: 'numeral',
        moment: 'moment',
        'jquery-mousewheel': 'jquery-mousewheel',
        echarts: 'echarts'
        // nunjucks: 'nunjucks'
    },
    module: {
        rules: [{
            test: /.(html)$/,
            loader: 'html-loader'
        }, {
            test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
            use: {
                loader: 'file-loader',
                options: {
                    publicPath: config.build.asstesFontPath,
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }
        }, {
            test: /\.js$/,
            enforce: 'post',
            exclude: /(node_modules|bower_components)/,
            use: ['happypack/loader?id=babel']
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024 * 1, //nkb
                    publicPath: config.build.asstesFontPath,
                    context: path.resolve(__dirname, '..', 'src'), //处理path和context相对地址
                    name: '[path][name].[ext]', //文件路径
                    fallback: 'file-loader'
                }
            }]
        }, {
            test: /\.scss$/,
            use: process.env.NODE_ENV === 'production'
            ? [MiniCssExtractPlugin.loader, 'fast-css-loader', 'fast-sass-loader']
            : 'happypack/loader?id=scss'
        }]
    }
}