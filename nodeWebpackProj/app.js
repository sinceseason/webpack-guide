const Koa = require('koa');
const app = new Koa();
const path = require('path');
const views = require('koa-views');
const log4js = require('log4js');
const log = log4js.getLogger('app');
const bodyParser = require('koa-bodyparser');
const koaJson = require('koa-json');
const koaStatic = require('koa-static');
// services
// ERROE: node 无法使用 import
// import nunjucksService from './node/services/nunjucksService';
const nunjucksService = require('./node/services/nunjucksService');
const interceptor = require('./node/util/interceptor');

// 引入routes
// ERROE: node 无法使用 import
// import user from './routes/user';
const user = require('./node/routes/user');
const index = require('./node/routes/index');

// log4js 配置
log4js.configure(require('./node/log4js/log4js'));

app.proxy = true;
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(koaJson());
// TODO: public 为打包所在的目录
app.use(koaStatic(
    path.join(__dirname, 'public')
));

// 配置handlebars模板
// CHANGE: 改为 nunjucks
// app.use(views(path.join(__dirname, './src/views'), {
//     map: {hbs: 'handlebars'},
//     extension: 'hbs'
// }))

// 配置 nunjucks 模板
const env = nunjucksService.createEnvironment(path.join(__dirname, './src/views'), {
    autoescape: true
});
nunjucksService.setFilter(env);
app.use(nunjucksService.createMiddleware(env, path.join(__dirname, './src/views'), '.html'));

// handle error request use handlebars
app.use(async (ctx, next) => {
    try {
        await next();
        if (ctx.status == 404) {
            log.error('404Url:' + ctx.path);
            await ctx.render('error/404', ctx.state);
        } else if (ctx.status == 500) {
            log.error('500Url:' + ctx.path);
            await ctx.render('error/500', ctx.state);
        }
    } catch (err) {
        log.error(err);
        ctx.state.err = err;
        await ctx.render('error/500', ctx.state);
    }
})

// 定义变量
app.use(async (ctx, next) => {
    ctx.state.tdk = {title: 'custom', keywords: 'money', description: 'much money'};
    await next();
})

// 全局拦截器
app.use(async (ctx, next) => {
    // 登录拦截器
    // await interceptor.validateLoginState(ctx);
    await next();
})

// allowedMethods处理的业务是当所有路由中间件执行完成之后,若ctx.status为空或者404的时候,丰富response对象的header头
app.use(index.routes(), index.allowedMethods());
app.use(user.routes(), user.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
    log.error(err);
});

// 转为 www.js 中监听
// app.listen(3000);

module.exports = app;