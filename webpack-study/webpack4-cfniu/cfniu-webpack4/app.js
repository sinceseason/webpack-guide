const Koa = require('koa')
const app = new Koa();
const path = require('path');
const nunjucks = require('nunjucks')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const log4js = require('log4js');
const log = log4js.getLogger('app');
const index = require('./routes/index')
const activity = require('./routes/activity')
const user = require('./routes/user')
const trade = require('./routes/trade')
const tradeclient = require('./routes/tradeclient')
const other = require('./routes/other')
const agent = require('./routes/agent')
const news = require('./routes/news')
const agentNews = require('./routes/agentNews')
const protocol = require('./routes/protocol')
const wx = require('./routes/wx')
// 移动端
const mProtocol = require('./routes/m/protocol');
const mAbout = require('./routes/m/about');
// const mHelp = require('./routes/m/help');
const mNews = require('./routes/m/news');
// const mTest = require('./routes/m/test');
// node 接口
const napiApp = require('./routes/napi/app');
const napiShare = require('./routes/napi/share')
// 服务
const nunjucksService = require('./services/nunjucksService');
const userService = require('./services/userService');
const utilService = require('./services/utilService');
const loggerService = require('./services/loggerService');
const interceptor = require('./util/interceptor');
const moment = require('moment');
// error handler
// onerror(app)
app.proxy = true;
// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// logger
app.use(async (ctx, next) => {
    // server time
    ctx.state.serveTime = moment().format('YYYY-MM-DD hh:mm:ss');
    const start = new Date();
    await next()
    const ms = new Date() - start
    loggerService.recordAccessLogger(ctx, 'access', {
        response_time: ms
    });
})
app.use(require('koa-static')(__dirname + '/public'))

// hander error page
app.use(async (ctx, next) => {
    try {
        await next();
        if (ctx.status == 404) {
            log.error('404url:' + ctx.path);
            await ctx.render('error/404', ctx.state);
        } else if (ctx.status == 500) {
            await ctx.render('error/500', ctx.state);
        }
    } catch (err) {
        log.error(err);
        ctx.state.err = err;
        await ctx.render('error/500', ctx.state);
    }
})

// template
const env = nunjucksService.createEnvironment(path.join(__dirname, 'views'), {});
nunjucksService.setFilter(env);
app.use(nunjucksService.createMiddleware({
    env: env,
    ext: '.html',
    path: path.join(__dirname, 'views')
}));

// 变量定义
app.use(async (ctx, next) => {
    ctx.state.NODE_ENV = process.env.NODE_ENV;
    ctx.state.BASE_URL = process.env.BASE_URL;
    ctx.state.IMAGE_PUBLIC_URL = process.env.IMAGE_PUBLIC_URL;
    ctx.state.IMAGE_INNER_URL = process.env.IMAGE_INNER_URL;
    ctx.state.COOKIE_URL = process.env.COOKIE_URL;
    ctx.state.API_URL = process.env.API_URL;
    ctx.state.ACTIVITY_URL = process.env.ACTIVITY_URL;
    ctx.state.MOBILE_URL = process.env.MOBILE_URL;
    ctx.state.LIANG_URL = process.env.LIANG_URL;
    ctx.state.CMS_URL = process.env.CMS_URL;
    ctx.state.NEWS_CHANNEL = process.env.NEWS_CHANNEL;
    ctx.state.NEWS_ADSID_INDEX = process.env.NEWS_ADSID_INDEX;
    ctx.state.NEWS_FRIENDLINK = process.env.NEWS_FRIENDLINK;
    ctx.state.CMS_IMGURL = process.env.CMS_IMGURL;
    ctx.state.NIU_CN = process.env.NIU_CN;
    ctx.state.NIU_EN = process.env.NIU_EN;
    ctx.state.TEL_NUM = process.env.TEL_NUM;
    ctx.state.COMPONY_INFO = process.env.COMPONY_INFO;
    ctx.state.NEWS_ADSID = process.env.NEWS_ADSID;
    ctx.state.NEWS_SIDE_ADSID = process.env.NEWS_SIDE_ADSID;
    ctx.state.NEWS_CONTENT_BOTTOM_ADSID = process.env.NEWS_CONTENT_BOTTOM_ADSID;
    ctx.state.NEWS_SPECIAL_TOP_IMG = process.env.NEWS_SPECIAL_TOP_IMG;
    ctx.state.PAY_URL = process.env.PAY_URL;
    ctx.state.APP_URL = process.env.APP_URL;
    ctx.state.APP_PC_URL = process.env.APP_PC_URL;
    ctx.state.WX_OPEN_APPID = process.env.WX_OPEN_APPID;
    ctx.state.WX_APPID = process.env.WX_APPID;
    ctx.state.tdk = utilService.buildTdk();
    ctx.state.NEWS_SPECIAL_ID = process.env.NEWS_SPECIAL_ID;
    ctx.state.MOBILE_PROXY_URL = process.env.MOBILE_PROXY_URL;
    ctx.state.AGENT_SHARE_URL = process.env.AGENT_SHARE_URL;
    ctx.state.NEWS_AGENT_CHANNEL = process.env.NEWS_AGENT_CHANNEL;
    log.debug('current env： ' + ctx.state.NODE_ENV);
    await next()
})

// 用户信息全局化
app.use(async (ctx, next) => {
    // 验证登录状态
    await interceptor.validateLoginState(ctx);
    // 非强制登录，next
    await next();
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(activity.routes(), activity.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(trade.routes(), trade.allowedMethods())
app.use(tradeclient.routes(), tradeclient.allowedMethods())
app.use(other.routes(), other.allowedMethods())
app.use(agent.routes(), agent.allowedMethods())
app.use(news.routes(), news.allowedMethods())
app.use(agentNews.routes(), agentNews.allowedMethods())
app.use(protocol.routes(), protocol.allowedMethods())
app.use(mProtocol.routes(), mProtocol.allowedMethods())
app.use(mAbout.routes(), mAbout.allowedMethods())
// app.use(mHelp.routes(), mHelp.allowedMethods())
app.use(mNews.routes(), mNews.allowedMethods())
// app.use(mTest.routes(), mTest.allowedMethods())
app.use(napiApp.routes(), napiApp.allowedMethods())
app.use(napiShare.routes(), napiShare.allowedMethods())
app.use(wx.routes(), wx.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    log.error(err);
});

module.exports = app