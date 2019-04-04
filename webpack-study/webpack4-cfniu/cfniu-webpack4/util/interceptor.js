// 日志
var log4js = require('log4js');
var log = log4js.getLogger('interceptor');
const userService = require('../services/userService');
const agentService = require('../services/agentService');
const cmsService = require('../services/cmsService');

const interceptor = {
    validateLoginState: async function(ctx) {
        let data = await userService.getbalance(ctx);
        log.debug('登录状态>>' + data.status);
        // 忽略链接
        let ignoreUrls = [/^wx/, '/user/register', '/user/login', '/user/forgetpwd', /napi\/(.*)/, /trade\/(\d+)/];
        ctx.state.skipState = false;
        let uri = ctx.path;
        for (let ignore of ignoreUrls) {
            // 正则
            if (typeof ignore == 'object') {
                if (ignore.test(uri)) {
                    log.debug('非登录链接>>' + uri);
                    ctx.state.skipState = true;
                    break;
                }
            } else {
                if (uri === ignore) {
                    log.debug('非登录链接>>' + uri);
                    ctx.state.skipState = true;
                    break;
                }
            }
        }
        // 登录状态
        let forceLogin = data.errCode == '700001' ? true : false;
        let loginState = data.success || data.status == "true" || false;
        // 用户等级
        ctx.state.userLevel = ctx.cookies.get('userLever') || 1;
        // 0-vip
        // 1,2,3 - A B C
        log.debug('当前用户等级：' + ctx.state.userLevel);

        // 是否已登录
        ctx.state.isLogin = loginState;
        if (loginState) {
            ctx.state.coupons = data.coupons;
            ctx.state.grade = data.grade;
            ctx.state.integral = data.integral;
            ctx.state.member = data.member;
            ctx.state.memberProperties = data.memberProperties;
        } else {
            ctx.state.coupons = [];
            ctx.state.grade = {};
            ctx.state.integral = {};
            ctx.state.member = {};
            ctx.state.memberProperties = {};
        }
        // 强制登录
        if (forceLogin && !ctx.state.skipState) {
            log.debug('强制登录状态>>' + forceLogin);
            ctx.redirect('/user/login?backUrl=' + decodeURIComponent(ctx.path));
        }
    },
    loginInterceptor: async(ctx, next) => {
        if (!ctx.state.isLogin && !ctx.state.skipState) {
            ctx.redirect('/user/login?backUrl=' + encodeURIComponent(ctx.path));
        } else {
            await next();
        }
    },
    getAgentLoginInfo: async(ctx, next) => {
        let data = await agentService.getmypartner(ctx);
        let ignoreUrls = ['/agent', '/agent/forgetPwd'];
        let isLogin = !data.success ? false : true
        let uri = ctx.path;
        let skipState = false;
        for (let ignore of ignoreUrls) {
            if (uri === ignore) {
                log.debug('非登录链接>>' + ctx.url);
                skipState = true;
                break;
            }
        }
        if (!isLogin && skipState) {
            ctx.state.isAgentLogin = false;
            ctx.state.agent = {};
            await next();
        } else if (!isLogin && !skipState) {
            ctx.state.isAgentLogin = false;
            ctx.state.agent = {};
            ctx.redirect('/agent');
        } else if (isLogin) {
            ctx.state.isAgentLogin = true;
            ctx.state.agent = data.agent;
            ctx.state.amount = data.amount;
            await next();
        }
    },
    userLevelAccess: async(ctx, next) => {
        let data = await userService.zoneLimit(ctx, {
            ip: ctx.request.ip
        });
        if (data.limit && ctx.headers && ctx.headers['user-agent'] && ctx.headers['user-agent'].indexOf('spider') == -1 || ctx.state.userLevel == 3) {
            log.info('ip:' + ctx.request.ip);
            await ctx.render('indexInhibit', ctx.state);
        } else {
            await next();
        }
    },
    getHotSpecialNews: async(ctx, next) => {
        ctx.state.isNews = true;
        ctx.state.specialList = await cmsService.getAllChannel(ctx, {
            flag: 0,
            channelId: ctx.state.NEWS_SPECIAL_ID
        });
        await next();
    },
    secondDomainSeo: async(ctx, next) => {
        let ipReg = /(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])|(:[0-9]+)/;
        if (ctx.host && !ctx.host.includes('www') && !ipReg.test(ctx.host)) {
            ctx.state.isSecondDomain = true;
        } else {
            ctx.state.isSecondDomain = false;
        }
        await next();
    }
}
module.exports = interceptor;