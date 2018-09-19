const router = require('koa-router')();

router.prefix('/(user|member)');

router.get('/', async (ctx, next) => {
    ctx.body = 'this is the userpage'
})

router.get('/login', async (ctx, next) => {
    await ctx.render('user/login', ctx.state);
})

router.get('/async', async (ctx, next) => {
    const sleep = async (ms) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true)
            }, ms)
        })
    }
    await sleep(1000)
    ctx.body = `this is the async page`
})

module.exports = router;