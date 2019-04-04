const HttpService = require('./httpService');
const constant = require('../util/constant');
const newsService = {
    /**
     * 公告列表
     * type=800001:消息中心
     */
    getList: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.news_list,
            data: {
                type: options.type || '800001',
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    newsDetail: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.news_read,
            data: {
                id: options.id
            }
        })
    }
}

module.exports = newsService;