const router = require('koa-router')();
const noviceService = require('../services/noviceService');
const userService = require('../services/userService');
const cmsService = require('../services/cmsService');
const otherService = require('../services/otherService');
const utilService = require('../services/utilService');
const interceptor = require('../util/interceptor');
const log4js = require('log4js');
const log = log4js.getLogger('news');

router.prefix('/news');
router.use(interceptor.secondDomainSeo);
router.use(async(ctx, next) => {
    if (ctx.state.isSecondDomain) {
        await ctx.render('/error/404', ctx.state);
    } else {
        await next();
    }
})

router.use(interceptor.getHotSpecialNews);

//资讯首页
router.get('/', async(ctx, next) => {
    //资讯banner图
    ctx.state.banners = await cmsService.getAdsList(ctx, ctx.state.NEWS_ADSID);
    //资讯Tab
    ctx.state.jcContentDtos = await cmsService.getAllChannel(ctx, {
        flag: 0
    })
    for (let i = 0; i < ctx.state.jcContentDtos.length; i = i + 5) {
        ctx.state.jcContentDtos[i].flag = true;
        ctx.state.jcContentDtos[i].pic = Math.ceil(Math.random() * 20);
        ctx.state.jcContentDtos[i].des = ctx.state.jcContentDtos[i].description.substring(0, 20) + '...';
    }
    //最新资讯
    ctx.state.recentNews = await cmsService.getRecentContent(ctx, {
        flag: 0,
        limit: 10,
    })

    //最热资讯
    // ctx.state.hotNews = await cmsService.getHotContent(ctx, {
    //     flag: 0,
    //     limit: 10,
    // })
    ctx.state.contentItems = await cmsService.getChannelDuplicate(ctx.state.jcContentDtos);
    ctx.state.channelId = 'index'
    ctx.state.crumbs = await cmsService.buildCrumbs();
    //资讯右侧图片
    ctx.state.adList = await cmsService.getAdsList(ctx, ctx.state.NEWS_SIDE_ADSID);
    ctx.state.tdk = utilService.buildTdk('news');
    await ctx.render('news/index', ctx.state);
});

//资讯列表页
router.get('/c(\\d+)(|-\\d+)', async(ctx, next) => {
    let dataArray = await ctx.params;
    ctx.state.channelId = await Number(dataArray[0]);
    ctx.state.page = await dataArray[1] ? Number(dataArray[1].split('-')[1]) : 1;
    ctx.state.pageText = await ctx.state.page == 1 ? '' : '第' + ctx.state.page + '页';
    //资讯列表
    ctx.state.jcContentDtos = await cmsService.getByChannelId(ctx, {
        channelId: ctx.state.channelId,
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
        flag: 0
    })

    //最新资讯
    ctx.state.recentNews = await cmsService.getRecentContent(ctx, {
        flag: 0,
        limit: 10,
    })

    //最热资讯
    // ctx.state.hotNews = await cmsService.getHotContent(ctx, {
    //     flag: 0,
    //     limit: 10,
    // })

    //tab显示
    ctx.state.contentItems = cmsService.getChannelDuplicate(ctx.state.jcContentDtoss);
    ctx.state.crumbs = cmsService.buildCrumbs('channl', ctx.state.jcContentDtos.jcContentDtos[0]);
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
    ctx.state.crumbs = await cmsService.buildCrumbs('tag', ctx.state.jcContentDtos.jcContentDtos[0]);
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
    let dataArray = await ctx.params;
    ctx.state.contentId = await dataArray[0];

    // 文章详情
    ctx.state.content = await cmsService.getByChannelIdAndContentId(ctx, {
        channelId: ctx.state.NEWS_CHANNEL,
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
    ctx.state.crumbs = await cmsService.buildCrumbs('content', ctx.state.content);

    ctx.state.tdk = utilService.buildTdk('detail');
    ctx.state.tdk.description = (ctx.state.content.txt || '').replace(/<[^>]*>/g, '').replace(/(^\s*)/g, '').substring(0, 75);
    ctx.state.tdk.title = ctx.state.content.title + ctx.state.tdk.title;
    await ctx.render('news/newsDetail', ctx.state);
})

// 资讯专题
router.get('/special(\\d+)(|\\-\\d+)', async(ctx, next) => {
    const urlArray = ctx.path.split('special')[1];
    const channelId = urlArray.split('-')[0];
    ctx.state.page = urlArray.split('-')[1] || 1;

    // banner
    // ctx.state.adList = await cmsService.getAdsList(ctx, ctx.state.NEWS_SIDE_ADSID)

    // 头部图片
    ctx.state.bottomAdList = await cmsService.getAdsList(ctx, ctx.state.NEWS_SPECIAL_TOP_IMG);

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
    // 最新资讯(按照时间排序从最新依次往前)
    ctx.state.recentNews = await cmsService.getRecentContent(ctx, {
        limit: 8
    });
    // 最热资讯(按照浏览量从高到低排列)
    ctx.state.hotNews = await cmsService.getHotContent(ctx, {
        limit: 8
    });
    ctx.state.tdk = utilService.buildTdk(channelId);
    var hasContent = false;
    for (var contentObj of ctx.state.hotSpecials) {
        // 专题列表中的channelId==目前页面的专题channelId
        if (contentObj && contentObj.channelId == channelId) {
            ctx.state.crumbs = await cmsService.buildCrumbs('special', contentObj);
            var hasContent = true;
            // 查询文章
            ctx.state.content = await cmsService.getByChannelIdAndContentId(ctx, {
                contentId: contentObj.contentId,
                channelId: ctx.state.NEWS_SPECIAL_ID
            })
            ctx.state.tagList = {};
            if (ctx.state.content && ctx.state.content.contentTags) {
                // 没完，还要查询标签对应的列表，恶不恶心, 就是！
                ctx.state.tagList = await cmsService.getByTagId(ctx, {
                    tagId: ctx.state.content.contentTags[0].tagId,
                    page: ctx.state.page,
                    channelId: ctx.state.NEWS_CHANNEL,
                    limit: 10
                })
                if (ctx.state.tagList && ctx.state.tagList.totalCount) {
                    // 分页参数
                    ctx.state.pp = await utilService.generatePageInfo(ctx.state.page, ctx.state.tagList.totalCount, 10, Math.ceil(ctx.state.tagList.totalCount / 10))
                    ctx.state.pageChannel = 'special' + channelId;
                    ctx.state.pp.unit = 'special' + channelId + '-';
                    ctx.state.pp.news = true;
                }
            }
            await ctx.render('news/newsSpecial', ctx.state);
            break;
        }
    }

    if (!hasContent) {
        ctx.state.content = {};
        ctx.state.tagList = {};
        await ctx.render('news/newsSpecial', ctx.state);
    }
})

module.exports = router;