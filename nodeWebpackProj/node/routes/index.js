const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    ctx.body = 'this is the homepage'
})

module.exports = router;
