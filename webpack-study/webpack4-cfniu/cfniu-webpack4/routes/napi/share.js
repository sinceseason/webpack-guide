const router = require('koa-router')();
const qr = require('qr-image');
const log4js = require('log4js');
const log = log4js.getLogger('napi-share');

router.prefix('/napi/share');

router.get('/qrcode', async (ctx, next) => {
    log.info(ctx.request.querystring);
    let query = ctx.request.querystring.split('url=')[1];
    query = decodeURIComponent(query);
    try {
        let img = qr.image(query, {
            type: 'png'
        });
        ctx.response.type = 'image/png'
        ctx.body = img;
    } catch (e) {
        log.error(e);
        ctx.response.status = 414;
        ctx.response.body = {
            'Content-Type': 'text/html'
        }
    }
});

module.exports = router;