const router = require('koa-router')();
const log4js = require('log4js');
const activityService = require('../services/activity');
const interceptor = require('../util/interceptor');

router.prefix('/activity');
router.use(interceptor.secondDomainSeo);

router.get('/', async(ctx, next) => {
    ctx.state.activity = (await activityService.getmatchstep(ctx)).activity;
    await ctx.render('activity', ctx.state);
});

module.exports = router;