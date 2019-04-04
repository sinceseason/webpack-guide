const router = require('koa-router')();
const log4js = require('log4js');
const interceptor = require('../util/interceptor');
router.prefix('/other');

router.use(interceptor.userLevelAccess);

router.get('/aboutus', async(ctx, next) => {
    await ctx.render('other/aboutUs', ctx.state);
});
router.get('/contactus', async(ctx, next) => {
    await ctx.render('other/contactUs', ctx.state);
});
router.get('/joinus', async(ctx, next) => {
    await ctx.render('other/joinUs', ctx.state);
});
router.get('/safe', async(ctx, next) => {
    await ctx.render('other/safe', ctx.state);
});
// router.get('/helpcenter', async (ctx, next) => {
//     ctx.state.tabs = otherService.getHelpTabs();
//     ctx.state.questions = questions;
//     await ctx.render('other/helpCenter', ctx.state);
// });
router.get('/media', async(ctx, next) => {
    await ctx.render('other/media', ctx.state);
});
router.get('/mediaDetail', async(ctx, next) => {
    await ctx.render('other/mediaDetail', ctx.state);
});
module.exports = router;