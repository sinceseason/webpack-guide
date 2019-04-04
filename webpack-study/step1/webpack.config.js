const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,
                        fallback: 'file-loader',
                        name: '[name].[hash:7].[ext]',
                        outputPath: 'image/'
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.md$/,
                use: ['markdown-loader']
            }
        ]
    }
};