const router = require('koa-router')()
const tradeService = require('../services/tradeService');
const utilService = require('../services/utilService');
const interceptor = require('../util/interceptor');
const log4js = require('log4js');
const logger = log4js.getLogger('tradeRouter');
router.prefix('/trade');
router.use(interceptor.loginInterceptor);
router.use(interceptor.userLevelAccess);
router.use(interceptor.secondDomainSeo);
// 申请操盘
router.get('/(\\d+)', async(ctx, next) => {
    /**
     * 0：天
     * 1：月
     * 5：免息T+4
     * 9：免息T+1
     * 2：月 极惠配资
     * 900005：特惠抢购
     * 15：周
     * 6：vip 月
     * 12：vip 天
     */
    let pzTypes = ['0', '1', '5', '9', '2'];
    let pzType = ctx.params[0];
    var pass = pzTypes.map(function(params) {
        if (params === pzType) {
            return true
        } else {
            return false
        }
    })
    if (pass) {
        ctx.state.pzType = ctx.params[0];
        ctx.state.product = (await tradeService.advert(ctx, 0)).adverts;
        ctx.state.freeProduct = utilService.freeProduct(ctx.state.product);
        logger.debug(ctx.state.freeProduct);
        ctx.state.tdk = utilService.buildTdk('pzType' + pzType);
        await ctx.render('trade/applyTrade', ctx.state);
    } else {
        throw new Error('配资产品错误');
    }
})
router.get('/flashsale', async(ctx) => {
    ctx.state.flashsale = true; //限时抢购标识，控制和普通操盘页的区别
    ctx.state.promotions = (await tradeService.getPromotion(ctx)).promotions;
    await ctx.render('trade/applyTrade', ctx.state);
})
router.get('/list', async(ctx, next) => {
    await ctx.render('trade/tradeList', ctx.state);
});
router.get('/hislist', async(ctx, next) => {
    await ctx.render('trade/tradeHisList', ctx.state);
});
router.get('/detail', async(ctx, next) => {
    await ctx.render('trade/tradeDetail', ctx.state);
});
router.get('/hisdetail', async(ctx, next) => {
    let data = await tradeService.getTradeInfo(ctx);
    ctx.state.trade = data.trade;
    ctx.state.usedDay = data.usedDay;
    ctx.state.manageCost = data.manageCost;
    await ctx.render('trade/tradeHisDetail', ctx.state);
});

module.exports = router