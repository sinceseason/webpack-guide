const router = require('koa-router')();
router.prefix('/m/about');

// 关于我们
router.get('/', async(ctx, next) => {
    await ctx.render('m/about/about', ctx.state);
});

// 公司简介
router.get('/company', async(ctx, next) => {
    await ctx.render('m/about/company', ctx.state);
})

router.get('/safe', async(ctx, next) => {
    await ctx.render('m/about/safe', ctx.state);
})

module.exports = router