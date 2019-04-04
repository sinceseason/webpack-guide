const HttpService = require('./httpService');

const noviceService = {
    // 获取体验活动
    getExperienceList: function (ctx) {
        return new HttpService().request({
            url: '/novice/experience',
            data: {
                matchNo: 'novice'
            }
        })(ctx)
    }
}
module.exports = noviceService;