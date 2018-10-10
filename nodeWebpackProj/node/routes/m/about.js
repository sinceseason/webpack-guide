const router = require('koa-router')();
router.prefix('/m/about');

// 关于我们
router.get('/', async(ctx, next) => {
    await ctx.render('m/about', ctx.state);
});

module.exports = router