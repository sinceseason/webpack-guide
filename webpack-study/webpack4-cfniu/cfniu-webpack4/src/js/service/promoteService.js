const utilService = require('./utilService');
const HttpService = require('./httpService');
const constant = require('../util/constant');
const promoteService = {
    action: function (options) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.promote_action,
            data: {
                code: options.code,
                actionName: options.actionName
            }
        })
    },
    // 签到
    signIn: function (options = {}) {
        return this.action({
            code: 'signIn',
            actionName: 'signIn'
        });
    },
    // 领取本金券
    getCash: function (options = {}) {
        return this.action({
            code: 'tradeCash',
            actionName: 'recPrincipal'
        });
    },
    // 抽奖
    toLottery: function (options = {}) {
        return this.action({
            code: 'invite',
            actionName: 'lottery'
        });
    },
    toDraw: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.promote_action,
            data: {
                code: 'invite',
                actionName: 'draw'
            }
        })
    },
    // 签到
    getSignInInfo: function (options = {}) {
        return new HttpService().request({
            url: constant.API.promote_signIn
        })
    },
    // 操盘返现
    getTradeCash: function (options = {}) {
        return new HttpService().request({
            url: constant.API.promote_tradeCash
        })
    },
    // 邀请现金
    getInvite: function (options = {}) {
        return new HttpService().request({
            url: constant.API.promote_invite
        })
    }
}

module.exports = promoteService;