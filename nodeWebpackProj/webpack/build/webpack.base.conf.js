const path = require('path');
const config = require('../util/webpack.index');
const util = require('../util/webpack.util');

module.exports = {
    entry: () => {
        let entry = util.mergeEntry(config.mulitpleEntry);
        entry['common'] = path.resolve(__dirname, '../../src/js/lib/common.js');
        return entry;
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /.html$/,
                loader: 'html-loader'
            },{
                test: /\.(woff|woff2|eot|ttf|otf)\??.*$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        // publicPath: config.build.asstesStaticPath,
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
                        name: '[name].[ext]',
                        fallback: 'file-loader',
                        outputPath: 'images/'
                    }
                }]
            }
        ]
    }
}