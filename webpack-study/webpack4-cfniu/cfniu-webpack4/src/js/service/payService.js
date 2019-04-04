const HttpService = require('./httpService');
const constant = require('../util/constant');
const payService = {
    transfer: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.pay_transfer,
            data: {
                amount: options.amount,
                remark: options.remark,
                terminal: options.terminal,
                tempAttachment: options.tempAttachment
            }
        });
    }
}

module.exports = payService;