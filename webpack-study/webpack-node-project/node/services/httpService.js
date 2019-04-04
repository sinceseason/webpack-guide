// const log4js = require('log4js');
// const log = log4js.getLogger('httpService');
// const BlueBird  = require('bluebird');
// const request = require('request');
// const constant = require('../util/constant');

// module.exports = class HttpService {
//     constructor(options = {}) {
//         this.method = options.method || 'get';
//         this.envType = options.envType || '';
//         this.error = typeof(options.error) == 'boolean' ? options.error : true;
//         this.headers = options.headers || constant.HEADERS.DEFAULT;
//         this.requestAjax = (ctx, options) => {
//             return new BlueBird((resolve, reject) => {
//                 request(options, (err, response, body) => {
//                     try {
//                         if (!err && response.statusCode == 200) {
//                             this.setCookiesToResponse.call(this, ctx, response);
//                             const data = JSON.parse(body);
//                             if (this.error) {
//                                 if (data.success || data.status == 'true') {
//                                     resolve(data);
//                                 } else {
//                                     reject(new Error(data.resultMsg));
//                                 }
//                             } else {
//                                 resolve(data || {});
//                             }
//                         } else {
//                             // 第三方环境，不会reject，影响主站
//                             if (!this.envType && !this.error) {
//                                 resolve({});
//                             } else {
//                                 reject(err || new Error(response.statusCode));
//                             }
//                         }
//                     } catch (err) {
//                         reject(err);
//                     }
//                 })
//             })
//         }
//     }

//     request(options = {}) {
//         return async(ctx) => {
//             log.debug('ctx host>>' + ctx.host);
//             this.headers["user-domain"] = ctx.host.split(':')[0];
//             options.headers = this.headers;
//             options.method = this.method;
//             // cookie
//             // options.jar = this.getCookiesJar(this.getCookies(ctx.headers.cookie))
//             return await this.requestAjax(ctx, options);
//         }
//     }

//     getCookies(sourceCookies) {
//         let cookies = {};
//         if (sourceCookies) {
//             // log.debug('浏览器获取到的cookies>>');
//             let cookiesArr = sourceCookies.split(';');
//             for (let cooStr of cookiesArr) {
//                 const coo = cooStr.split('=');
//                 if (coo.length > 1) {
//                     // log.debug(coo[0] + ':' + coo[1]);
//                     cookies[coo[0]] = coo[1];
//                 }
//             }
//         }
//         return cookies;
//     }

//     setCookiesToResponse(ctx, response) {
//         let cookieArr = response.headers['set-cookie'] || [];
//         // log.debug("response.headers['set-cookie']>>" + cookieArr);
//         // [ 'uid=46466517220509; Domain=127.0.0.1; Path=/',...]
//         for (let cooStr of cookieArr) {
//             const cookieStr = cooStr.split(';');
//             if (cookieStr && cookieStr.length > 0) {
//                 const coo = cookieStr[0].split('=');
//                 log.debug(coo[0] + ':' + coo[1]);
//                 ctx.cookies.set(coo[0], coo[1]);
//             }
//         }
//     }
// }