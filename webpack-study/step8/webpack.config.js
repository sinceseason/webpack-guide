const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'webpack-number.js',
		path: path.resolve(__dirname, 'dist')
	},
	externals: {
		lodash: {
			commonjs: 'lodash',
			commonjs2: 'lodash',
			amd: 'lodash',
			root: '_',
		}
	}
};