const HttpService = require('./httpService');
const constant = require('../util/constant');

const activityService = {
    getmatchstep: function(options = {}) {
        return new HttpService().request({
            url: constant.API.match_getstep,
            data: {
                matchNo: options.matchNo || 'free',
                stepNo: options.stepNo || 'step1',
            }
        })
    },
    joinActivity: function(data) {
        return new HttpService({
            method: 'post',
        }).request({
            url: constant.API.match_join_weekmatch,
            data: data,
        })
    }
}

module.exports = activityService;