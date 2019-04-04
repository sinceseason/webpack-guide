var path = require('path');
var config = require('../config/webpack.index');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mergeEntry: (entry) => {
        let entrys = {};
        for (let i in entry) {
            entrys = {...entrys, ...entry[i]}
        }
        return entrys;
    },
    /**
     * 创建多页面build方法
     * options.template
     * options.filename
     * optiosn.chunks
     * options.ext 文件后缀
     */
    createHtmlWebpackPlugin: function (options) {
        return Object.keys(options.mulitpleEntry).map(entry => {
            let entryPath = options.mulitpleEntry[entry];
            let splitWord = options.splitWord || 'controller';
            let defaultSplitWord = 'src\\js';
            let ext = options.ext || '.html';
            let entryDir = '';
            if (entryPath.split(splitWord).length > 1) {
                entryDir = entryPath.split(splitWord)[1];
            } else {
                entryDir = entryPath.split(defaultSplitWord)[1];
            }
            entryDir = './' + entryDir.replace('.js', ext);
            return new HtmlWebpackPlugin({
                favicon: path.resolve(__dirname, '..', 'src/images/favicon.ico'),
                template: options.template,
                filename: path.join(options.filename, entryDir),
                alwaysWriteToDisk: true,
                chunks: (options.chunks || []).concat([entry])
            })
        })
    }
}