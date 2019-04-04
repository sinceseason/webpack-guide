const router = require('koa-router')();
const log4js = require('log4js');
const log = log4js.getLogger('news');
const cmsService = require('../../services/cmsService');
const utilService = require('../../services/utilService');

router.prefix('/m/news');

router.get('/c(\\d+)', async (ctx, next) => {
    ctx.state.pageTitle = '资讯中心';
    ctx.state.channelId = ctx.path.split('c')[1];
    ctx.state.allChannel = await cmsService.getAllChannel(ctx, {
        flag: 0
    })
    ctx.state.contentItems = await cmsService.getChannelDuplicate(ctx.state.allChannel);
    ctx.state.jcContentDtos = await cmsService.getByChannelId(ctx, {
        channelId: ctx.state.channelId,
        page: 1,
    });
    await ctx.render('m/news/list', ctx.state);
})

router.get('/d(\\d+).html', async (ctx, next) => {
    ctx.state.pageTitle = '资讯中心';
    // { '0': 'm', '1': '58356' }
    ctx.state.contentId = ctx.params[0];
    //文章详情
    ctx.state.content = await cmsService.getByChannelIdAndContentId(ctx, {
        channelId: ctx.state.NEWS_CHANNEL,
        contentId: ctx.state.contentId,
    })
    // 热门专题
    ctx.state.jcContentDtos = await cmsService.getAllChannel(ctx, {
        flag: 0,
        channelId: ctx.state.NEWS_SPECIAL_ID
    });
    ctx.state.hotSpecials = await cmsService.getChannelDuplicate(ctx.state.jcContentDtos);
    ctx.state.recentNews = await cmsService.getRecentContent(ctx, {
        limit: 8
    });
    ctx.state.tdk = utilService.buildTdk('detail');
    ctx.state.tdk.description = (ctx.state.content.txt || '').replace(/<[^>]*>/g, '').replace(/(^\s*)/g, '').substring(0, 75);
    ctx.state.tdk.title = ctx.state.content.title + ctx.state.tdk.title;
    console.log(ctx.params[0], ctx.path);
    await ctx.render('m/news/detail', ctx.state);
})

router.get('/tag(\\d+)', async (ctx, next) => {
    ctx.state.pageTitle = '资讯中心';
    ctx.state.channelId = ctx.path.split('tag')[1];
    ctx.state.allChannel = await cmsService.getAllChannel(ctx, {
        flag: 0
    })
    ctx.state.contentItems = await cmsService.getChannelDuplicate(ctx.state.allChannel);
    ctx.state.tagList = await cmsService.getByTagId(ctx, {
        tagId: ctx.state.channelId,
        page: 1,
        channelId: ctx.state.NEWS_CHANNEL,
        limit: 10
    })
    ctx.state.tagName = ctx.state.tagList.jcContentDtos[0].tagName;
    ctx.state.tdk = utilService.buildTdk(ctx.state.channelId);
    await ctx.render('m/news/tagList', ctx.state);
});

router.get('/special(\\d+)', async (ctx, next) => {
    ctx.state.pageTitle = '资讯中心';
    ctx.state.special = true;
    const channelId = ctx.path.split('special')[1];
    // 热门专题
    ctx.state.jcContentDtos = await cmsService.getAllChannel(ctx, {
        flag: 0,
        channelId: ctx.state.NEWS_SPECIAL_ID
    });
    ctx.state.hotSpecials = await cmsService.getChannelDuplicate(ctx.state.jcContentDtos);
    ctx.state.tdk = utilService.buildTdk();
    var hasContent = false;
    for (var contentObj of ctx.state.hotSpecials) {
        // 专题列表中的channelId==目前页面的专题channelId
        if (contentObj && contentObj.channelId == channelId) {
            // ctx.state.crumbs = await cmsService.buildCrumbs('special', contentObj);
            var hasContent = true;
            // 查询文章
            ctx.state.content = await cmsService.getByChannelIdAndContentId(ctx, {
                contentId: contentObj.contentId,
                channelId: ctx.state.NEWS_SPECIAL_ID
            })
            ctx.state.tagList = {};
            if (ctx.state.content && ctx.state.content.contentTags) {
                // 没完，还要查询标签对应的列表，恶不恶心
                // log.debug(ctx.state.content.contentTags);
                ctx.state.tagList = await cmsService.getByTagId(ctx, {
                    tagId: ctx.state.content.contentTags[0].tagId,
                    page: 1,
                    channelId: ctx.state.NEWS_CHANNEL,
                    limit: 10
                })
            }
            ctx.state.tdk = utilService.buildTdk(channelId);
            await ctx.render('m/news/special', ctx.state)
            break;
        }
    }
    if (!hasContent) {
        ctx.state.content = {};
        ctx.state.tagList = {};
        await ctx.render('m/news/special', ctx.state)
    }
})

module.exports = router;