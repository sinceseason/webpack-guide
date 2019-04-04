const router = require('koa-router')()
const appUrls = require('../../util/appUrls');
const log4js = require('log4js');
const log = log4js.getLogger('napi-app');
router.prefix('/napi/(m|app)')

// 获取可用链接
router.get('/getUrls', async (ctx, next) => {
    // 测试
    let ipReg = /(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])|(:[0-9]+)/;
    log.debug(ipReg.test(ctx.host));
    if (ipReg.test(ctx.host)) {
        for (let appUrl of appUrls) {
            // 判断测试环境
            if (appUrl.source == 'h5') {
                appUrl.url = 'http://192.168.1.65:8200' + appUrl.uri
            } else if (appUrl.source == 'pc') {
                appUrl.url = 'http://192.168.1.65:8201' + appUrl.uri
            } else {
                appUrl.url = 'http://' + ctx.host + appUrl.uri
            }
        }
    } else {
        let topDomains = ctx.host.split('.');
        let topDomain = topDomains.length >= 2 ? '.' + topDomains[topDomains.length - 2] + '.' + topDomains[topDomains.length - 1] : '.' + ctx.host;
        for (let appUrl of appUrls) {
            appUrl.url = 'http://' + appUrl.SLD + topDomain + appUrl.uri
        }
    }
    ctx.body = {
        success: true,
        urls: appUrls
    }
});
module.exports = router