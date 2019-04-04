const router = require('koa-router')()
const interceptor = require('../util/interceptor');
router.prefix('/protocol')

// 风险提示
router.get('/risk', async (ctx, next) => {
    await ctx.render('protocol/risk', ctx.state);
});

// 注册协议
router.get('/register', async (ctx, next) => {
    await ctx.render('protocol/register', ctx.state);
});

// 投资建议
router.get('/invest', async (ctx, next) => {
    await ctx.render('protocol/invest', ctx.state);
});

// 操盘
router.get('/trade', async (ctx, next) => {
    await ctx.render('protocol/trade', ctx.state);
});

// 只是作为测试
router.get('/test', async (ctx, next) => {
    await ctx.render('m/test', ctx.state);
});
module.exports = router