/*
 * @Author: shixinghao 
 * @Date: 2018-07-13 14:28:13 
 * @Last Modified by:   shixinghao 
 * @Last Modified time: 2018-07-13 14:28:13 
 */
// 日志
var log4js = require('log4js');
var log = log4js.getLogger('user');
const router = require('koa-router')()
const interceptor = require('../util/interceptor');
const userService = require('../services/userService');
const utilService = require('../services/utilService');
router.prefix('/(user|member)');

router.use(interceptor.loginInterceptor);
router.use(interceptor.userLevelAccess);

// 登录
router.get('/login', async(ctx, next) => {
    await ctx.render('user/login', ctx.state);
});
// 注册
router.get('/register', async(ctx, next) => {
    await ctx.render('user/register', ctx.state);
});
// 忘记密码
router.get('/forgetpwd', async(ctx, next) => {
    await ctx.render('user/forgetpwd', ctx.state);
});
// 收益统计
router.get(['/assets', '/assets.html'], async(ctx, next) => {
    ctx.state.accountrpt = await userService.getaccountrpt(ctx);
    ctx.state.mybank = await userService.getmybank(ctx);
    ctx.state.extendinfo = await userService.getExtendInfo(ctx);
    await ctx.render('user/assets', ctx.state);
});
// 积分卡券
router.get('/coupon', async(ctx, next) => {
    ctx.state.coupon = (await userService.getMyCoupon(ctx)).coupons;
    ctx.state.couponList = (await userService.getCouponList(ctx)).coupons;
    ctx.state.couponType = utilService.couponType(ctx.state.couponList);
    await ctx.render('user/coupon', ctx.state);
});
// 资金流水
router.get('/flowing', async(ctx, next) => {
    await ctx.render('user/flowing', ctx.state);
});
// 消息中心
router.get('/message', async(ctx, next) => {
    ctx.state.index = await ctx.params;
    await ctx.render('user/message', ctx.state);
});

// 首页点击公告跳转
router.get('/message(\\d+)', async(ctx, next) => {
    ctx.state.noticeIndex = (await ctx.params)[0];
    await ctx.render('user/message', ctx.state);
})

// 赚的快-推广
router.get('/extend', async(ctx, next) => {
    ctx.state.trackinfo = await userService.getTrackInfo(ctx);
    ctx.state.extendinfo = await userService.getExtendInfo(ctx);
    let trackId = ctx.state.trackinfo.track.trackId;
    let redirectUrl = ctx.state.ACTIVITY_URL + '/node/share/extendShareWx?trackId=' + trackId;
    ctx.state.imgUrl = '/napi/share/qrcode?url=' + redirectUrl;
    ctx.state.shareUrl = ctx.state.ACTIVITY_URL + '/node/mobile/extendShareWx?trackId=' + trackId;
    ctx.state.remindUrl = '/napi/share/qrcode?url=' + ctx.state.ACTIVITY_URL + '/node/mobile/remindFriend';
    await ctx.render('user/extend', ctx.state);
});
// 充值
router.get('/recharge', async(ctx, next) => {
    ctx.state.banks = await userService.getmybank(ctx);
    await ctx.render('user/recharge', ctx.state);
});
// 提现
router.get('/drawing', async(ctx, next) => {
    ctx.state.banks = await userService.getmybank(ctx);
    await ctx.render('user/drawing', ctx.state);
});
// 绑定银行卡
router.get('/addBank', async(ctx, next) => {
    ctx.state.banks = await userService.getBanks(ctx);
    ctx.state.citys = await userService.getCitys(ctx);
    await ctx.render('user/addBank', ctx.state);
});
module.exports = router