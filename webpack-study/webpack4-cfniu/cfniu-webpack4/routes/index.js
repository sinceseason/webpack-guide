const router = require('koa-router')();
const userService = require('../services/userService');
const cmsService = require('../services/cmsService')
const interceptor = require('../util/interceptor');
const utilService = require('../services/utilService');
router.use(interceptor.userLevelAccess);
router.use(interceptor.secondDomainSeo);
router.get('/', async(ctx, next) => {
    // 新手必看
    // ctx.state.questions = otherService.getQuestionList(ctx, 0);
    // 免费体验
    // ctx.state.activities = (await noviceService.getExperienceList(ctx)).activities;
    // 轮播图
    ctx.state.banners = await cmsService.getAdsList(ctx, ctx.state.NEWS_ADSID_INDEX);
    // 资讯栏目
    ctx.state.jcContentDtos = await cmsService.getAllChannel(ctx, {
        flag: 1,
        limit: 7
    })

    // 资讯图片
    ctx.state.imgSrc = function(val) {
        return Math.ceil(Math.random() * val);
    }

    // 资讯栏目去重
    ctx.state.contentItems = cmsService.getChannelDuplicate(ctx.state.jcContentDtos);
    // 公告
    ctx.state.newsList = (await userService.getNoticeList(ctx)).list;
    // 友情链接
    ctx.state.friendLinks = await cmsService.getFriendLinks(ctx, ctx.state.NEWS_FRIENDLINK);
    // 热门专题
    ctx.state.specialList = await cmsService.getAllChannel(ctx, {
        flag: 0,
        channelId: ctx.state.NEWS_SPECIAL_ID
    });
    ctx.state.isFooter = true;
    ctx.state.tdk = utilService.buildTdk('index');
    await ctx.render('index', ctx.state)
})

router.get('/healthcheck', async(ctx, next) => {
    ctx.body = {
        success: true
    };
})

router.post('/test', async(ctx, next) => {
    // ctx.state.test = ctx.requset.body;
    console.log(ctx.requset)
})
module.exports = router