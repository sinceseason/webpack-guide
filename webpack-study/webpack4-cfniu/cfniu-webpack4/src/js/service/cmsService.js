const HttpService = require('./httpService');
const constant = require('../util/constant');
const cmsService = {
    findByChannelId: function (options = {}) {
        return new HttpService({
            httpSuffix: '.cms',
            contentType: 'application/json',
            method: 'post',
            dataType: "json"
        }).request({
            url: constant.API.cms_findByChannelId,
            data: JSON.stringify(options.data)
        })
    },
    findByTagId: function (options = {}) {
        return new HttpService({
            httpSuffix: '.cms',
            contentType: 'application/json',
            method: 'post',
            dataType: "json"
        }).request({
            url: constant.API.cms_findByTagId,
            data: JSON.stringify(options.data)
        })
    }
}

module.exports = cmsService;