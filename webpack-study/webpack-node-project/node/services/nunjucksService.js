const path = require('path');
const bluebird = require('bluebird');
// ERROE: 
// import nunjucks from 'nunjucks';
const nunjucks = require('nunjucks');

module.exports = {
    createMiddleware: (env, folder, ext) => {
        // env.renderAsync = new Promise(env.render);
        env.renderAsync = bluebird.promisify(env.render);
        return async (ctx, next) => {
            ctx.render = async (view, data) => {
                view += ext || '.html';
                return env.renderAsync(path.resolve(folder, view), data).then(html => {
                    ctx.type = 'html';
                    ctx.body = html;
                });
            }
            await next();
        }
    },
    createEnvironment: (loaders, envOpts = {}, fileOpts = {}) => {
        return new nunjucks.Environment(new nunjucks.FileSystemLoader(loaders, fileOpts), envOpts);
    },
    setFilter: (env) => {
        env.addFilter('openStatusText', function (openStatus) {
            return openStatus ? (openStatus == 1 ? '进行中' : '已结束') : '未开放';
        });
    }
}

// ERROE: 
// export default nunjucksService;