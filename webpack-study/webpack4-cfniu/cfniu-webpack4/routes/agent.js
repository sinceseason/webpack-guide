const router = require('koa-router')();
const interceptor = require('../util/interceptor');
const agentService = require('../services/agentService');
const cmsService = require('../services/cmsService');

router.prefix('/agent');

router.use(interceptor.getAgentLoginInfo);
router.use(interceptor.secondDomainSeo);

router.get('/', async(ctx, next) => {
    ctx.state.jcContentDtos = await cmsService.getAllChannel(ctx, {
        flag: 1,
        limit: 8,
        channelId: ctx.state.NEWS_AGENT_CHANNEL
    });
    ctx.state.contentItems = cmsService.getChannelDuplicate(ctx.state.jcContentDtos);
    await ctx.render('agent/agentIndex', ctx.state);
});
router.get('/myPartner', async(ctx, next) => {
    ctx.state.partner = await agentService.getmypartner(ctx);
    await ctx.render('agent/myPartner', ctx.state);
});
router.get('/detail', async(ctx, next) => {
    await ctx.render('agent/agentDetail', ctx.state);
});
router.get('/draw', async(ctx, next) => {
    await ctx.render('agent/agentDraw', ctx.state);
});
router.get('/forgetPwd', async(ctx, next) => {
    await ctx.render('agent/agentForget', ctx.state);
});

module.exports = router;