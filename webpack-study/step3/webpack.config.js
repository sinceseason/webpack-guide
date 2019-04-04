const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    devtool: 'inline-source-map',
    // 将该设置放置到server.js 中
    // -devServer: {
    //     -contentBase: path.join(__dirname, 'dist'),
    //     -port: 9000,
    //     -hot: true,
    // -},
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // 清理文件
        new CleanWebpackPlugin(['dist']),
        // 将js引入到html文件中
        new HtmlWebpackPlugin({
            title: 'output management',
            filename: 'index.html'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};