const router = require('koa-router')()
const interceptor = require('../util/interceptor');
router.prefix('/tradeclient');

// router.use(interceptor.loginInterceptor);
router.use(interceptor.userLevelAccess);

router.get('/', async (ctx, next) => {
    await ctx.render('tradeclient/index', ctx.state);
});

module.exports = router