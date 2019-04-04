const router = require('koa-router')();

router.prefix('/m/protocol');

router.get('/trade', async (ctx, next) => {
    await ctx.render('m/protocol/trade', ctx.state);
})

module.exports = router;