const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		main: './src/index.js',
		vendor: [
			'lodash'
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Caching',
			filename: 'index.html',
		}),
		new CleanWebpackPlugin.HashedModuleIdsPlugin(),
		// webpack4.x 中已废弃
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'manifest'
		// })
	],
	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					chunks: "initial",
					name: "manifest",
				},
				vendor: {
					chunks: 'initial',
					name: 'vendor',
				}
			}
		}
	}
};