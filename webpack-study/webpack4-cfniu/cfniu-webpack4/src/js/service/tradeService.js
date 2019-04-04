const utilService = require('./utilService');
const HttpService = require('./httpService');
const DialogService = require('./dialogService');
const constant = require('../util/constant');
const todayLimitTemplate = require('../../../src/templates/trade/_todayLimit.html');
const tradeService = {
    getTradeTotal: function (trade = {}) {
        return trade.wfCurrPercent || trade.currPercent.assetValue || trade.wfPercent;
    },
    stopTrade: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_order,
            data: {
                tradeId: data.tradeId,
                multiple: data.multiple
            }
        })
    },
    addCapital: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_addfxamount,
            data: {
                fxAmount: data.fxAmount,
                id: data.id
            }
        })
    },
    tradeFetchProfit: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_fetchprofit,
            data: {
                id: data.id,
                profitAmount: data.profitAmount
            }
        })
    },
    tradeCancel: function (data) {
        return new HttpService().request({
            url: constant.API.trade_quittrans,
            data: {
                id: data.id
            }
        })
    },
    getStopStockMultiple: function () {
        return new HttpService().request({
            url: constant.API.trade_multiple
        })
    },
    calStopStockOrder: function (data) {
        return new HttpService().request({
            url: constant.API.trade_cacl,
            data: {
                tradeId: data.tradeId,
                multiple: data.multiple
            }
        })
    },
    applyDelay: function (data) {
        return new HttpService().request({
            url: '/trade/' + data.tradeId + '/renewCost',
            data: {
                cycle: data.cycle
            }
        })
    },
    extension: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_extension,
            data: {
                cycle: data.cycle,
                tradeId: data.tradeId
            }
        })
    },
    getstocklimit: function () {
        return new HttpService().request({
            url: constant.API.trade_getstocklimit
        })
    },
    tradeFlowDetail: function (data) {
        return new HttpService().request({
            url: constant.API.trade_tradeFlowDetail,
            data: {
                page: data.page,
                pageSize: 5,
                ioType: data.ioType,
                tradeId: data.tradeId
            }
        })
    },
    gethistrasbill: (data) => {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_gethistrasbill,
            data: {
                page: data.page,
                pageSize: 5,
                tradeId: data.tradeId
            }
        });
    },
    getProduct: function (data) {
        return new HttpService().request({
            url: constant.API.trade_getProduct,
            data: {
                pzType: data.pzType
            }
        })
    },
    getinterest: function (data) {
        return new HttpService().request({
            url: constant.API.trade_getinterest,
            data: {
                pzType: data.pzType
            }
        })
    },
    getTradeResult: function (data) {
        return new HttpService().request({
            url: constant.API.trade_get,
            data: {
                pzType: data.pzType,
                pzAmount: data.pzAmount,
                cycle: data.cycle,
                mutiple: data.mutiple
            }
        })
    },
    draw: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_draw,
            data: data
        })
    },
    getCoupons: function (data) {
        return new HttpService().request({
            url: constant.API.trade_coupon,
            data: data
        })
    },
    getCouponList: function (data) {
        return new HttpService().request({
            url: constant.API.trade_couponList
        })
    },
    tradeDeal: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_deal,
            data: {
                pzType: data.pzType,
                pzAmount: data.pzAmount,
                cycle: data.cycle,
                mutiple: data.mutiple,
                couponCode: data.couponCode
            }
        })
    },
    promotionTradeDeal: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: '/promotion/' + data.detailId + '/order',
            data: {
                pzType: data.pzType,
                pzAmount: data.pzAmount,
                cycle: data.cycle,
                mutiple: data.mutiple,
                couponCode: data.couponCode
            }
        })
    },
    getTradeInfo: function (data) {
        return new HttpService().request({
            url: constant.API.trade_gettradeinfo,
            data: {
                transId: data.transId
            }
        })
    },
    // tab切换
    chooseTab: function (options) {
        utilService.addTabSelected({
            tabDom: options.tabDom,
            index: options.tabIndex
        });
    },
    freeTab: function (options) {
        utilService.addTabSelected({
            tabDom: options.tabDom,
            index: options.tabIndex
        });
    },
    getmybank: function () {
        return new HttpService().request({
            url: constant.API.agent_getmybank
        })
    },
    notice: function (data) {
        return new HttpService().request({
            url: '/user/notice/' + data.flag
        })
    },
    getAgreement: function (data) {
        return new HttpService({
            httpSuffix: '.cms',
            contentType: 'text/plain',
            method: 'post'
        }).request({
            url: constant.API.cms_findByAdspaceId,
            data: JSON.stringify(data)
        })
    },
    postNotice: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: '/user/notice',
            data: {
                flag: data.flag
            }
        })
    },
    // 获取当前操盘列表
    getTradeList: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_tradelist,
            data: {
                page: data.page,
                pageSize: data.pageSize || 5,
                type: data.type // 当前-1,历史 -2
            }
        })
    },
    showTodayLimitStockDialog: function () {
        this.getstocklimit().then(function (data) {
            utilService.createHtml($('.JuicerAnchor-TodayLimit'), todayLimitTemplate, {
                limit: data.limit
            })
        })
        new DialogService({
            id: 'JS-todayLimitDialog'
        }).open();
    },
    // 获取当前操盘列表
    getPromotionDetail: function (data) {
        return new HttpService().request({
            url: '/promotion/' + data.id + '/current'
        })
    }
}

module.exports = tradeService;