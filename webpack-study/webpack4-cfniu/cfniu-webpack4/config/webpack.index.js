const path = require('path');
const dotenv = require('dotenv');
const processEnv = dotenv.config({
    path: './config/env.' + process.env.ENV + '.conf'
});
module.exports = {
    build: {
        // output
        assetsRoot: path.resolve(__dirname, '../public'),
        assetsPublicPath: process.env.NODE_ENV == 'development' ? '/' : '/static.cfniu.com',
        assetsPublicImagePath: '/',
        // file-loader问题
        asstesFontPath: process.env.NODE_ENV == 'development' ? '/' : '/static.cfniu.com/',
        // plugins
        cleanDirs: ['public/js', 'public/css', 'public/images', 'views/layout', 'views/m/layout'],
        sourceMap: process.env.NODE_ENV == 'development' ? 'cheap-source-map' : 'source-map'
    },
    systemEnv: function () {
        let systemConfig = processEnv.parsed;
        for (let key in systemConfig) {
            systemConfig[key] = JSON.stringify(systemConfig[key])
        }
        return systemConfig;
    },
    // webpack entry
    mulitpleEntry: {
        pc: {
            index: path.resolve(__dirname, '../src/js/controller/index.js'),
            error: path.resolve(__dirname, '../src/js/controller/error.js'),
            // 免费体验
            activity: path.resolve(__dirname, '../src/js/controller/activity.js'),
            // 微信绑定
            wxBind: path.resolve(__dirname, '../src/js/controller/wx/wxBind.js'),
            // 登录注册
            login: path.resolve(__dirname, '../src/js/controller/user/login.js'),
            register: path.resolve(__dirname, '../src/js/controller/user/register.js'),
            forgetpwd: path.resolve(__dirname, '../src/js/controller/user/forgetpwd.js'),
            // 用户
            assets: path.resolve(__dirname, '../src/js/controller/user/assets.js'),
            coupon: path.resolve(__dirname, '../src/js/controller/user/coupon.js'),
            extend: path.resolve(__dirname, '../src/js/controller/user/extend.js'),
            flowing: path.resolve(__dirname, '../src/js/controller/user/flowing.js'),
            message: path.resolve(__dirname, '../src/js/controller/user/message.js'),
            recharge: path.resolve(__dirname, '../src/js/controller/user/recharge.js'),
            drawing: path.resolve(__dirname, '../src/js/controller/user/drawing.js'),
            addBank: path.resolve(__dirname, '../src/js/controller/user/addBank.js'),
            // 操盘
            applyTrade: path.resolve(__dirname, '../src/js/controller/trade/applyTrade.js'),
            tradeList: path.resolve(__dirname, '../src/js/controller/trade/tradeList.js'),
            tradeHisList: path.resolve(__dirname, '../src/js/controller/trade/tradeHisList.js'),
            tradeDetail: path.resolve(__dirname, '../src/js/controller/trade/tradeDetail.js'),
            tradeHisDetail: path.resolve(__dirname, '../src/js/controller/trade/tradeHisDetail.js'),
            tradeclient: path.resolve(__dirname, '../src/js/controller/tradeclient/index.js'),
            // 资讯
            news: path.resolve(__dirname, '../src/js/controller/news/index.js'),
            // 其他
            other: path.resolve(__dirname, '../src/js/controller/other/other.js'),
            helpCenter: path.resolve(__dirname, '../src/js/controller/other/helpCenter.js'),
            media: path.resolve(__dirname, '../src/js/controller/other/media.js'),
            mediaDetail: path.resolve(__dirname, '../src/js/controller/other/mediaDetail.js'),
            // 协议
            protocolTrade: path.resolve(__dirname, '../src/js/controller/protocol/trade.js'),
            protocol: path.resolve(__dirname, '../src/js/controller/protocol/protocol.js'),
            // 居间商
            agentIndex: path.resolve(__dirname, '../src/js/controller/agent/agentIndex.js'),
            agentPartner: path.resolve(__dirname, '../src/js/controller/agent/agentPartner.js'),
            agentDetail: path.resolve(__dirname, '../src/js/controller/agent/agentDetail.js'),
            agentDraw: path.resolve(__dirname, '../src/js/controller/agent/agentDraw.js'),
            agentForget: path.resolve(__dirname, '../src/js/controller/agent/agentForget.js')
        },
        // 移动端mobile,entry需要以m开头特殊区分
        m: {
            mabout: path.resolve(__dirname, '../src/js/controller/m/about/about.js'),
            mcompany: path.resolve(__dirname, '../src/js/controller/m/about/company.js'),
            msafe: path.resolve(__dirname, '../src/js/controller/m/about/safe.js'),
            mtrade: path.resolve(__dirname, '../src/js/controller/m/protocol/trade.js'),
            mNewsList: path.resolve(__dirname, '../src/js/controller/m/news/list.js'),
            mNewsDetail: path.resolve(__dirname, '../src/js/controller/m/news/detail.js'),
            mNewsTagList: path.resolve(__dirname, '../src/js/controller/m/news/tagList.js'),
            mNewsSpecialList: path.resolve(__dirname, '../src/js/controller/m/news/special.js'),
        }
    }
}