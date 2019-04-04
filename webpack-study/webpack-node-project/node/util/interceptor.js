const log4js = require('log4js');
const log = log4js.getLogger('interceptor');
const userService = require('../services/userService');

module.exports = {
    validateLoginState: async (ctx) => {
        let result = await userService.getbalance(ctx);
    }
}