const utilService = require('./utilService');
const HttpService = require('./httpService');
const constant = require('../util/constant');
const tradeclientService = {
    // 买卖tab切换
    chooseTab: function (options = {}) {
        utilService.addTabSelected({
            tabDom: options.tabDom,
            index: options.tabIndex
        });
        utilService.showContent({
            contentDom: options.contentDom,
            index: options.contentIndex
        });
    },
    // 切换买卖文案
    switchOrderSide: function (orderSide) {
        let orderSideData = {
            B: [{
                $dom: $('.JS-dj'),
                hide: false
            }, {
                $dom: $('.JS-text-max'),
                text: '最高可买'
            }, {
                $dom: $('.JS-storage'),
                hide: false
            }],
            S: [{
                $dom: $('.JS-dj'),
                hide: true
            }, {
                $dom: $('.JS-text-max'),
                text: '最高可卖'
            }, {
                $dom: $('.JS-storage'),
                hide: true
            }]
        }
        let types = orderSideData[orderSide];
        for (let i = 0; i < types.length; i++) {
            // 隐藏
            if (types[i].hide) {
                types[i].$dom.hide();
            } else {
                types[i].$dom.show();
                types[i].$dom.text(types[i].text);
            }
        }
    },
    queryAccount: function (account) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryAccount,
            data: {
                account: account
            }
        })
    },
    queryPosition: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryPosition,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    queryCancelOrder: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryNoneExecution,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    cancelOrder: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_cancelOrder,
            data: {
                account: options.account,
                orderId: options.orderId
            }
        })
    },
    queryExecution: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryExecution,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    queryEntrust: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryEntrust,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    queryHistoryExecution: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryHistoryExecution,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    queryHistoryEntrust: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryHistoryEntrust,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    queryCapitalFlow: function (options = {}) {
        return new HttpService({
            method: 'get'
        }).request({
            url: constant.API.tradeclient_queryCapFlw,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    queryHistoryCapitalFlow: function (options = {}) {
        return new HttpService({
            method: 'get'
        }).request({
            url: constant.API.tradeclient_queryHisCapFlw,
            data: {
                account: options.account,
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    queryTypeByTabIndex: function (tabIndex, options = {}) {
        if (tabIndex == 0) {
            return this.queryEntrust(options)
        } else if (tabIndex == 1) {
            return this.queryHistoryEntrust(options)
        } else if (tabIndex == 2) {
            return this.queryExecution(options)
        } else if (tabIndex == 3) {
            return this.queryHistoryExecution(options)
        } else if (tabIndex == 4) {
            return this.queryCapitalFlow(options)
        } else if (tabIndex == 5) {
            return this.queryHistoryCapitalFlow(options)
        }
    },
    // 获取查询类型
    getQueryType: function (index) {
        return ['entrust', 'historyEntrust', 'execution', 'historyExecution', 'capitalFlow', 'historyCapitalFlow'][index]
    },
    queryStock: function (stockCode) {
        return new HttpService().request({
            url: constant.API.tradeclient_queryStock,
            data: {
                stockCode: stockCode
            }
        })
    },
    queryStockPrice: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_queryStockPrice,
            data: {
                account: options.account,
                stockCode: options.stockCode
            }
        })
    },
    sendOrder: function (options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.tradeclient_sendOrder,
            data: {
                account: options.account,
                stockCode: options.stockCode,
                price: options.price,
                qty: options.qty,
                orderSide: options.orderSide,
                orderType: options.orderType
            }
        })
    },
    queryQty: function (options = {}) {
        return new HttpService({
            method: 'get'
        }).request({
            url: constant.API.tradeclient_queryQty,
            data: {
                account: options.account,
                stkCd: options.stockCode,
                delgtPrc: options.price,
                orderType: options.orderType
            }
        })
    }
}

module.exports = tradeclientService;