/*
 * @Author: shixinghao 
 * @Date: 2018-07-13 14:28:40 
 * @Last Modified by:   shixinghao 
 * @Last Modified time: 2018-07-13 14:28:40 
 */
const log4js = require('log4js');
const log = log4js.getLogger('wxRouter');
const router = require('koa-router')();
const userService = require('../services/userService');
router.prefix('/wx');

// pc端跳转微信二维码登录地址
router.get('/', async (ctx, next) => {
    ctx.response.redirect(_buildQRUrl());
});
/*微信绑定 */
router.get('/wxBind', async (ctx, next) => {
    await ctx.render('wx/wxBind', ctx.state);
});
// 验证用户微信账号状态
// http://www.cfniu.com/wx/OAuth?code=001sHBId26PZnE04KJJd2xcgId2sHBIO&state=1524202414169
router.get('/OAuth', async (ctx, next) => {
    log.info('code:' + ctx.query.code);
    await userService.wxlogin(ctx, {
        code: ctx.query.code,
        useOpen: 'useOpen'
    }).then(data => {
        log.info(data);
        if (data.success) {
            if (data.status) {
                // 1.授权失败
                ctx.body = data.resultMsg || '微信授权失败';
            } else if (!data.acountBind) {
                // 2.未绑定，需要绑定
                ctx.response.redirect('http://www.cfniu.com/wx/wxBind?openid=' + data.openid || '');
            } else {
                // 3.已绑定，直接跳转
                ctx.response.redirect('/');
            }
        } else {
            ctx.body = data.resultMsg || '微信授权错误'
        }
    }).catch(err => {
        log.error(err);
        ctx.status = 500;
        next(err);
    })
})

// 做测试，换取code
router.get('/getCode', async (ctx, next) => {
    log.info('code>> ' + ctx.query.code);
    ctx.body = {
        code: ctx.query.code
    }
})

// 授权过渡- 普通（公众号，处理非www域名）
router.get('/redirect', async (ctx, next) => {
    let backUrl = ctx.url.split('redirect?backUrl=')[1];
    log.info('backUrl>> ' + backUrl);
    ctx.response.redirect(backUrl);
})

// 授权过渡（公众号，处理非www域名）
router.get('/redirectOAuth', async (ctx, next) => {
    let backUrl = _getBackUrl(ctx);
    log.info('url>>' + ctx.url);
    log.info('code>> ' + ctx.query.code);
    log.info('backUrl>> ' + backUrl);
    await userService.wxlogin(ctx, {
        code: ctx.query.code
    }).then(data => {
        log.info(data);
        if (data.success) {
            if (data.status) {
                // 1.授权失败
                ctx.body = data.resultMsg || '微信授权失败';
            } else {
                ctx.response.redirect(backUrl);
            }
        } else {
            ctx.body = data.resultMsg || '微信授权错误'
        }
    }).catch(err => {
        log.error(err);
        ctx.status = 500;
        next(err);
    })
})

// 授权过渡- 获取授权信息（公众号，处理非www域名）
router.get('/redirectOAuthInfo', async (ctx, next) => {
    let backUrl = _getBackUrl(ctx);
    log.info('url>>' + ctx.url);
    log.info('code>> ' + ctx.query.code);
    log.info('backUrl>> ' + backUrl);
    await userService.wxlogin(ctx, {
        code: ctx.query.code
    }).then(data => {
        log.info(data);
        if (data.success) {
            if (data.status) {
                // 1.授权失败
                ctx.body = data.resultMsg || '微信授权失败';
            } else if (!data.acountBind) {
                // 未绑定
                if (backUrl && backUrl.indexOf('?') != -1) {
                    backUrl = backUrl + '&weixinId=' + data.weixinId + '&openId=' + data.openid;
                } else {
                    backUrl = backUrl + '?weixinId=' + data.weixinId + '&openId=' + data.openid;
                }
                ctx.response.redirect(backUrl);
            } else {
                if (backUrl && backUrl.indexOf('?') != -1) {
                    backUrl = backUrl + '&weixinId=' + data.weixinId;
                } else {
                    backUrl = backUrl + '?weixinId=' + data.weixinId;
                }
                ctx.response.redirect(backUrl);
            }
        } else {
            ctx.body = data.resultMsg || '微信授权错误'
        }
    }).catch(err => {
        log.error(err);
        ctx.status = 500;
        next(err);
    })
});

function _buildQRUrl() {
    // 微信开放平台配置地址域名
    var path = 'http://www.cfniu.com/wx/OAuth';
    var redirectRri = encodeURIComponent(path);
    var state = Date.now();
    var appid = process.env.WX_OPEN_APPID;
    var getQRcodeUrl = 'https://open.weixin.qq.com/connect/qrconnect?' +
        'appid=' + appid +
        '&redirect_uri=' + redirectRri +
        '&response_type=code&scope=snsapi_login&state=' + state +
        '#wechat_redirect';
    return getQRcodeUrl;
}

// 获取回调地址
function _getBackUrl(ctx) {
    let backUrl = decodeURIComponent(ctx.query.backUrl || ctx.query.backurl);
    // 微信重定向链接不允许出现#，SPA push方式，特殊处理还原链接
    if (backUrl && backUrl.indexOf('@') != -1) {
        return backUrl.replace('@', '#');
    }
    return backUrl;
}
module.exports = router;