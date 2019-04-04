const router = require('koa-router')();
const noviceService = require('../services/noviceService');
const userService = require('../services/userService');
const cmsService = require('../services/cmsService');
const otherService = require('../services/otherService');
const utilService = require('../services/utilService')
const log4js = require('log4js');
const log = log4js.getLogger('news');
const interceptor = require('../util/interceptor');

router.prefix('/agentNews');
router.use(interceptor.secondDomainSeo);

//资讯列表页
router.get('/c(\\d+)(|-\\d+)', async(ctx, next) => {
    ctx.state.isAgentNews = true;
    let dataArray = await ctx.params;
    ctx.state.channelId = await Number(dataArray[0]);
    ctx.state.page = await dataArray[1] ? Number(dataArray[1].split('-')[1]) : 1;
    ctx.state.pageText = await ctx.state.page == 1 ? '' : '第' + ctx.state.page + '页';
    //资讯列表
    ctx.state.jcContentDtos = await cmsService.getByChannelId(ctx, {
        channelId: ctx.state.channelId,
        parentId: ctx.state.NEWS_AGENT_CHANNEL,
        page: ctx.state.page,
    })
    for (let i = 0; i < ctx.state.jcContentDtos.jcContentDtos.length; i++) {
        ctx.state.jcContentDtos.jcContentDtos[i].pic = Math.ceil(Math.random() * 20);
    }
    //右侧图片
    ctx.state.adList = await cmsService.getAdsList(ctx, ctx.state.NEWS_SIDE_ADSID)
    ctx.state.pageMsg = await cmsService.findAdsList(ctx, ctx.state.NEWS_SIDE_ADSID)

    //资讯Tab
    ctx.state.jcContentDtoss = await cmsService.getAllChannel(ctx, {
        channelId: ctx.state.NEWS_AGENT_CHANNEL,
        flag: 5
    })

    //最新资讯
    ctx.state.recentNews = await cmsService.getRecentContent(ctx, {
        flag: 0,
        limit: 10,
        channelId: ctx.state.NEWS_AGENT_CHANNEL
    })

    //最热资讯
    // ctx.state.hotNews = await cmsService.getHotContent(ctx, {
    //     flag: 0,
    //     limit: 10,
    // })

    //tab显示
    ctx.state.contentItems = cmsService.getChannelDuplicate(ctx.state.jcContentDtoss);
    ctx.state.crumbs = cmsService.buildCrumbs('channl', ctx.state.jcContentDtos.jcContentDtos[0], ctx.state.isAgentNews);
    //分页参数
    ctx.state.pp = utilService.generatePageInfo(ctx.state.page, ctx.state.jcContentDtos.totalCount, 10, Math.ceil(ctx.state.jcContentDtos.totalCount / 10))
    ctx.state.pageChannel = 'c' + ctx.state.channelId;
    ctx.state.pp.unit = 'c' + ctx.state.channelId + '-';
    ctx.state.pp.news = true;
    ctx.state.tdk = utilService.buildTdk(ctx.state.channelId);
    await ctx.render('news/newsList', ctx.state);
})

//资讯标签页
router.get('/tag(\\d+)(|-\\d+)', async(ctx, next) => {
    ctx.state.isAgentNews = true;
    let dataArray = await ctx.params;
    ctx.state.tagId = await dataArray[0];
    ctx.state.page = await dataArray[1] ? Number(dataArray[1].split('-')[1]) : 1;
    ctx.state.pageText = await ctx.state.page == 1 ? '' : '第' + ctx.state.page + '页';
    // 标签列表
    ctx.state.jcContentDtos = await cmsService.getByTagId(ctx, {
        tagId: ctx.state.tagId,
        page: ctx.state.page,
    });
    // 图片
    for (let i = 0; i < ctx.state.jcContentDtos.jcContentDtos.length; i++) {
        ctx.state.jcContentDtos.jcContentDtos[i].pic = Math.ceil(Math.random() * 20);
    }

    // 最热资讯
    // ctx.state.hotNews = await cmsService.getHotContent(ctx, {
    //     flag: 0,
    //     limit: 10,
    // })

    // 最新资讯
    // ctx.state.recentNews = await cmsService.getRecentContent(ctx, {
    //     flag: 0,
    //     limit: 10,
    // })
    ctx.state.crumbs = await cmsService.buildCrumbs('tag', ctx.state.jcContentDtos.jcContentDtos[0], ctx.state.isAgentNews);
    // 右侧图片
    ctx.state.adList = await cmsService.getAdsList(ctx, ctx.state.NEWS_SIDE_ADSID)

    // 分页参数
    ctx.state.pageMsg = await cmsService.findAdsList(ctx, ctx.state.NEWS_SIDE_ADSID)
    ctx.state.pp = await utilService.generatePageInfo(ctx.state.page, ctx.state.jcContentDtos.totalCount, 10, Math.ceil(ctx.state.jcContentDtos.totalCount / 10))
    ctx.state.pageChannel = 'tag' + ctx.state.tagId;
    ctx.state.pp.unit = 'tag' + ctx.state.tagId + '-';
    ctx.state.pp.news = true;
    ctx.state.tdk = utilService.buildTdk('tag');
    ctx.state.tdk.title = (ctx.state.jcContentDtos ? ctx.state.jcContentDtos.jcContentDtos[0].tagName : '') + ctx.state.tdk.title;
    await ctx.render('news/newsTag', ctx.state);
})

//资讯详情页
router.get('/d(\\d+).html', async(ctx, next) => {
    ctx.state.isAgentNews = true;
    let dataArray = await ctx.params;
    ctx.state.contentId = await dataArray[0];

    // 文章详情
    ctx.state.content = await cmsService.getByChannelIdAndContentId(ctx, {
        channelId: ctx.state.NEWS_AGENT_CHANNEL,
        contentId: ctx.state.contentId,
    })

    // 文章标签
    ctx.state.jcContentTagRelationDtos = await cmsService.getByContentId(ctx, {
        contentId: ctx.state.contentId,
    })

    // 资讯tab
    ctx.state.jcContentDtos = await cmsService.getAllChannel(ctx, {
        flag: 0
    })

    // 右侧图片
    ctx.state.adList = await cmsService.getAdsList(ctx, ctx.state.NEWS_SIDE_ADSID)

    // 最新资讯
    ctx.state.recentNews = await cmsService.getRecentContent(ctx, {
        flag: 0,
        limit: 10,
    })

    // 最热资讯
    ctx.state.hotNews = await cmsService.getHotContent(ctx, {
        flag: 0,
        limit: 10,
    })

    // 最新专题
    ctx.state.mostClickSpecialNews = await cmsService.getRecentContent(ctx, {
        channelId: ctx.state.NEWS_SPECIAL_ID,
        limit: 8
    });
    // 热门专题
    ctx.state.jcContentDtos = await cmsService.getAllChannel(ctx, {
        flag: 0,
        channelId: ctx.state.NEWS_SPECIAL_ID
    });
    ctx.state.hotSpecials = await cmsService.getChannelDuplicate(ctx.state.jcContentDtos);

    // 相关资讯
    // ctx.state.relativeNews = await cmsService.getRelInfoByTag(ctx, {
    //     contentId: ctx.state.contentId,
    // })

    ctx.state.bottomAdList = await cmsService.getAdsList(ctx, ctx.state.NEWS_CONTENT_BOTTOM_ADSID);

    // tab显示
    // ctx.state.contentItems = await cmsService.getChannelDuplicate(ctx.state.jcContentDtos);
    // ctx.state.channelId = await ctx.state.content.channelId
    ctx.state.crumbs = await cmsService.buildCrumbs('content', ctx.state.content, ctx.state.isAgentNews);

    ctx.state.tdk = utilService.buildTdk('detail');
    ctx.state.tdk.description = (ctx.state.content.txt || '').replace(/<[^>]*>/g, '').replace(/(^\s*)/g, '').substring(0, 75);
    ctx.state.tdk.title = ctx.state.content.title + ctx.state.tdk.title;
    await ctx.render('news/newsDetail', ctx.state);
})

module.exports = router;