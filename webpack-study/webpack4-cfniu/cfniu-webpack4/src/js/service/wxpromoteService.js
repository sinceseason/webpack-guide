const utilService = require('./utilService');
const HttpService = require('./httpService');
const constant = require('../util/constant');
const validator = require('../util/validator');
const wxpromoteService = {
    /**
     * 获取活动列表
     * code：活动编码worldCup
     * wxId：微信id	1
     * page：1
     * pageSize：50
     */
    getWxpromoteList: function (data = {}) {
        return new HttpService().request({
            url: constant.API.wxpromote_list + '/' + data.code,
            data: {
                wxId: data.wxId,
                page: data.page || 1,
                pageSize: data.pageSize || 50
            }
        })
    }
}
module.exports = wxpromoteService;