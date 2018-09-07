const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		index: './src/index.js',
		another: './src/another-module.js',
	},
	plugins: [
		new HTMLWebpackPlugin({
			title: 'Code Splitting',
		}),
		// ERROE: webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead
		// new webpack.optimize.CommonsChunkPlugin({
		// 	// 指定公共的 bundle 名称
		// 	name: 'common',
		// })
		new webpack.optimize.Split
	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
};