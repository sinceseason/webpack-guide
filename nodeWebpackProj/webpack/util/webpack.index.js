const path = require('path');

module.exports = {
    build: {
        // output path
        assetsRoot: path.resolve(__dirname, '../../public'),
        assetsPublicPath: process.env.NODE_ENV == 'development' ? '/' : '/static.cfniu.com',
        // 字体 图片 路径
        asstesStaticPath: process.env.NODE_ENV == 'development' ? '/' : '/static.cfniu.com/',
        // clean dirs 移到Clean-webpack-plugin root选项中
        cleanDirs: ['public/js', 'public/images', 'public/fonts', 'src/views/layout', 'views/m/layout'],
    },
    // webpack entrys
    mulitpleEntry: {
        base: {
            // 公共 js 移动到 base.conf 中
            // common: path.resolve(__dirname, '../../src/js/lib/common.js'),
            // 登录注册
            login: path.resolve(__dirname, '../../src/js/controller/user/login.js'),
            register: path.resolve(__dirname, '../../src/js/controller/user/register.js'),
        },
        m: {
            mabout: path.resolve(__dirname, '../../src/js/controller/m/about/about.js'),
        }
    }
}