const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'webpack-number.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'webpackNumbers',
		libraryTarget: 'umd',
	},
	externals: {
		lodash: 'lodash'
	}
};