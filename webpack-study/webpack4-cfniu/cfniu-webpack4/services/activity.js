const HttpService = require('./httpService');
const constant = require('../util/constant');

const activityService = {
    getmatchstep: async(ctx, options = {}) => {
        let activity = await new HttpService().request({
            url: constant.API.match_getstep,
            data: {
                matchNo: options.matchNo || 'free',
                stepNo: options.stepNo || 'step1',
            }
        })(ctx);
        return activity;
    }
}

module.exports = activityService;