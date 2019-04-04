require('../../../scss/tradeclient/index.scss');
const utilService = require('../../service/utilService');
const constant = require('../../util/constant');
const DialogService = require('../../service/dialogService');
const tradeclientService = require('../../service/tradeclientService');
const tradeService = require('../../service/tradeService');
const orderTemplate = require('../../../templates/tradeclient/order.html');
const stockPriceTemplate = require('../../../templates/tradeclient/stockPrice.html');
const positionTemplate = require('../../../templates/tradeclient/position.html');
const cancelTemplate = require('../../../templates/tradeclient/cancel.html');
const entrustTemplate = require('../../../templates/tradeclient/entrust.html');
const historyEntrustTemplate = require('../../../templates/tradeclient/historyEntrust.html');
const executionTemplate = require('../../../templates/tradeclient/execution.html');
const historyExecutionTemplate = require('../../../templates/tradeclient/historyExecution.html');
const capitalFlowTemplate = require('../../../templates/tradeclient/capitalFlow.html');
const historyCapitalFlowTemplate = require('../../../templates/tradeclient/historyCapitalFlow.html');
const queryTemplates = [
    entrustTemplate, historyEntrustTemplate, executionTemplate, historyExecutionTemplate, capitalFlowTemplate, historyCapitalFlowTemplate
]
// 买卖对象
let order = {
    orderSide: utilService.getUrlParams().type == 'S' ? 'S' : 'B',
    account: utilService.getUrlParams().tradeId,
    stockCode: utilService.getUrlParams().stockCode,
    stockName: '',
    orderType: '',
    price: 0,
    qty: 0,
    upperLimitPrice: 0,
    lowerLimitPrice: 0
}
let maxNum = 0; //最大可买卖
let account = {} //资金账户对象
let tradeId = order.account;
let stockPriceTimer; //买卖五档定时（用于区分首次）
let $orderForm = $('.JS-orderForm');
listentStockCode(order.stockCode);
init(order.orderSide == 'S' ? 2 : 1, true);
// 监听股票输入
$('.JS-stockCode').bind('input propertychange', function () {
    let stockCode = $(this).val();
    if (stockCode && stockCode.length == 6) {
        listentStockCode(stockCode);
    } else {
        initStockPrice();
        utilService.setText($('.JS-stock-name'), '');
    }
})
// 选择一级tab(买卖)
$('.JS-tab-tradeclient').click(function () {
    init($(this).attr('data-nav'));
})
// 选择二级tab(查询)
$('.JS-tab-query').click(function () {
    initQuery($(this).attr('data-nav'));
});
$('.JS-showTodayLimit').click(() => {
    tradeService.showTodayLimitStockDialog();
})
// 增减委托价格
$('.JS-operator-price').click(function () {
    let tempPrice = Number(utilService.getValue($orderForm, 'price'));
    // 减少
    if ($(this).hasClass('JS-minus')) {
        tempPrice = utilService.round(tempPrice - 0.01);
        order.price = tempPrice < order.lowerLimitPrice ? order.lowerLimitPrice : tempPrice;
    } else {
        tempPrice = utilService.round(tempPrice + 0.01);
        order.price = tempPrice > order.upperLimitPrice ? order.upperLimitPrice : tempPrice;
    }
    utilService.setValue($('.JS-price'), utilService.round(order.price));
    updateFrozenPrice();
    queryMaxNum();
})
// 增减股数
$('.JS-operator-qty').click(function () {
    let tempQty = Number(utilService.getValue($orderForm, 'qty'));
    // 减少
    if ($(this).hasClass('JS-minus')) {
        tempQty = utilService.round(tempQty - 100, 0);
        order.qty = tempQty < 0 ? 0 : tempQty;
    } else {
        tempQty = utilService.round(tempQty + 100, 0);
        order.qty = tempQty > maxNum ? maxNum : tempQty;
    }
    utilService.setValue($('.JS-qty'), utilService.round(order.qty, 0));
    updateFrozenPrice();
})
// 监听委托价格
$('.JS-price').on('input propertychange', function () {
    let tempPrice = utilService.round($(this).val());
    if (utilService.validate(['price'], {
            price: tempPrice
        }).status) {
        if (tempPrice >= order.lowerLimitPrice && tempPrice <= order.upperLimitPrice) {
            order.price = tempPrice;
            // 刷新冻结资金
            updateFrozenPrice();
            queryMaxNum();
        } else {
            order.price = 0;
            updateFrozenPrice();
            queryMaxNum();
        }
    } else {
        order.price = 0;
        updateFrozenPrice();
        queryMaxNum();
    }
})
// 监听股数
$('.JS-qty').on('input propertychange', function () {
    let tempQty = $(this).val();
    order.qty = '';
    if (order.orderSide == 'B' && utilService.validate(['qty'], {
            qty: tempQty
        }).status) {
        if (tempQty >= 0 && tempQty <= maxNum) {
            order.qty = tempQty;
            // 刷新冻结资金
            updateFrozenPrice();
        }
    }
    if (order.orderSide == 'S') {
        if (tempQty > 0 && tempQty <= maxNum) {
            order.qty = tempQty;
            // 刷新冻结资金
            updateFrozenPrice();
        }
    }
})
// 仓位选择
$('.JS-storage input').click(function () {
    let storageType = $(this).val();
    if (maxNum >= 100 && storageType && $('.JS-storage input:checked').length > 0) {
        order.qty = Math.floor(Number(maxNum / storageType / 100)) * 100;
        updateEnstrusQtyInfo();
        updateFrozenPrice();
    }
})
// 预交易提示框
$('.JS-order-submit').click(function () {
    // 验证
    let result = utilService.validate(['stockCode', 'price'], order);
    if (result.status) {
        if (order.price < order.lowerLimitPrice || order.price > order.upperLimitPrice) {
            utilService.showTipDialog(constant.ERROR.price);
        } else if (order.qty > maxNum || !order.qty) {
            utilService.showTipDialog(constant.ERROR.qty);
        } else if (order.orderSide == 'B' && !utilService.validate(['qty'], order).status) {
            NCow.showTipDialog(constant.ERROR.qty);
        } else {
            utilService.createHtml($('.JuicerAnchor-order'), orderTemplate, {
                order: order
            });
            new DialogService({
                id: 'JS-orderDialog'
            }).open();
        }
    } else {
        utilService.showTipDialog(result.msg);
    }
})
// 发送交易订单请求
$('#JS-orderDialog').on('click', '.JS-submit', function () {
    tradeclientService.sendOrder(order).then(function () {
        utilService.showTipDialog('交易成功');
        init(order.orderSide == 'S' ? 2 : 1);
    }, err => {
        utilService.showTipDialog(err);
        init(order.orderSide == 'S' ? 2 : 1);
    })
})
// 监听股票信息
function listentStockCode(stockCode) {
    if (utilService.validate(['stockCode'], {
            stockCode: stockCode
        }).status) {
        // 查询股票信息
        tradeclientService.queryStock(stockCode).then(function (data) {
            order.stockCode = data.stocks[0].stockCode;
            order.stockName = data.stocks[0].stockName;
            utilService.setValue($('.JS-stockCode'), stockCode);
            utilService.setText($('.JS-stock-name'), order.stockName);
            // 查询股价五档
            queryStockCodePrice();
        }, err => {
            initStockCode();
            initStockPrice();
            utilService.showTipDialog(err);
        })
    } else {
        initStockCode();
        initStockPrice();
        // utilService.showTipDialog('股票输入不正确');
    }
}
// 初始化买卖数据
function init(tabIndex, initStockCodeStatus) {
    // 实时买卖状态
    order.orderSide = tabIndex == 2 ? 'S' : 'B';
    // 选择client tab
    tradeclientService.chooseTab({
        tabIndex: tabIndex,
        contentIndex: order.orderSide == 'S' ? 1 : tabIndex, //买卖公用一个
        tabDom: 'JS-tab-tradeclient',
        contentDom: 'JS-tradeclient-content'
    });

    // 初始化查询tab分页
    utilService.initPage($('.JS-page-query'));
    utilService.initPage($('.JS-page-position'));
    // 根据不同tab查询数据
    if (tabIndex == 0) {
        // 持仓
        tradeclientService.queryAccount(tradeId).then(function (data) {
            account = data.account;
            queryPosition();
        }, err => {
            utilService.showTipDialog(err);
        })
    } else if (tabIndex == 3) {
        // 撤单
        queryCancelList()
    } else if (tabIndex == 4) {
        // 查询
        initQuery(0);
    } else if (tabIndex == 1 || tabIndex == 2) {
        queryPosition();
        // 初始化
        if (!initStockCodeStatus) {
            initStockCode();
            initStockPrice();
        }
        // 切换买卖文案
        tradeclientService.switchOrderSide(order.orderSide);
        tradeclientService.queryAccount(tradeId).then(function (data) {
            account = data.account;
            // 更新价格
            utilService.setText($('.JS-account-available'), utilService.money(account.available));
        }, err => {
            utilService.showTipDialog(err);
        })
    }
}
// 初始化股票信息
function initStockCode() {
    order.stockCode = null;
    order.stockName = null;
    utilService.setValue($('.JS-stockCode'), null);
    utilService.setText($('.JS-stock-name'), '');
}
// 初始化股票价格
function initStockPrice() {
    clearTimeout(stockPriceTimer);
    stockPriceTimer = null;
    utilService.createHtml($('.JuicerAnchor-StockPrice'), stockPriceTemplate, {
        stockPrice: {}
    })
    maxNum = 0;
    order.price = 0;
    order.qty = 0;
    order.lowerLimitPrice = 0;
    order.upperLimitPrice = 0;
    updateEnstrusPriceInfo();
    updateEnstrusQtyInfo();
    updateFrozenPrice();
    // 重置委托仓位
    $('.JS-storage input').attr('checked', false)
}
// 更新委托价格
function updateEnstrusPriceInfo() {
    utilService.setValue($('.JS-price'), utilService.round(order.price));
    utilService.setText($('.JS-upperLimitPrice'), utilService.round(order.upperLimitPrice));
    utilService.setText($('.JS-lowerLimitPrice'), utilService.round(order.lowerLimitPrice));
}
// 更新委托股数
function updateEnstrusQtyInfo() {
    utilService.setValue($('.JS-qty'), utilService.round(order.qty, 0));
    utilService.setText($('.JS-maxNum'), maxNum);
}
// 更新冻结资金
function updateFrozenPrice() {
    let frozenPrice = utilService.round(order.price * order.qty);
    utilService.setText($('.JS-frozenPrice'), frozenPrice);
}
// 查询买卖五档
function queryStockCodePrice() {
    tradeclientService.queryStockPrice({
        account: tradeId,
        stockCode: order.stockCode
    }).then(data => {
        // 渲染页面五档
        utilService.createHtml($('.JuicerAnchor-StockPrice'), stockPriceTemplate, {
            stockPrice: data.stockPrice
        })
        // 首次查询股票价格，刷新委托价格、涨跌停
        if (!stockPriceTimer) {
            order.price = utilService.round((order.orderSide == 'B' ? data.stockPrice.sellPrice1 : data.stockPrice.buyPrice1) || data.stockPrice.lastPrice);
            order.upperLimitPrice = data.stockPrice.upperLimitPrice;
            order.lowerLimitPrice = data.stockPrice.lowerLimitPrice;
            updateEnstrusPriceInfo();
            queryMaxNum();
        }
        // 开始循环遍历
        refreshStockPrice();
    }, err => {
        // 错误不用提示
    })
}
// 轮询查询股票价格
function refreshStockPrice() {
    stockPriceTimer = setTimeout(function () {
        queryStockCodePrice();
    }, 3000);
}
// 查询最大可买卖数量
function queryMaxNum() {
    if (order.price) {
        if (order.orderSide == 'B' && (order.price >= order.lowerLimitPrice && order.price <= order.upperLimitPrice)) {
            // maxNum = Math.floor(account.available / order.price / 100) * 100;
            tradeclientService.queryQty(order).then(function (data) {
                maxNum = data.buyQty;
                utilService.setText($('.JS-maxNum'), maxNum);
            }, function (err) {
                maxNum = 0;
                utilService.setText($('.JS-maxNum'), maxNum);
            })
        } else {
            // 卖出查询持仓
            tradeclientService.queryPosition({
                account: tradeId,
                page: 1,
                pageSize: 1000
            }).then(function (data) {
                for (let i = 0; i < data.list.length; i++) {
                    if (data.list[i].stockCode == order.stockCode) {
                        maxNum = data.list[i].availableQty;
                        utilService.setText($('.JS-maxNum'), maxNum);
                        break;
                    }
                }
            })

        }
    } else {
        maxNum = 0;
        utilService.setText($('.JS-maxNum'), maxNum);
    }
}
// 持仓列表
function queryPosition(options = {}) {
    tradeclientService.queryPosition({
        account: tradeId,
        page: options.page,
        pageSize: options.pageSize
    }).then(function (data) {
        // 渲染买卖底部持仓
        if ($('.JS-tab-tradeclient.selected').attr('data-nav') != 0) {
            utilService.createHtml($('.JuicerAnchor-order-position'), positionTemplate, {
                list: data.list,
                account: account
            })
            utilService.createPage($('.JS-page-order-position'), {
                totalPages: data.pageCount,
                startPage: data.page,
                cb: function (page) {
                    queryPosition({
                        account: tradeId,
                        page: page,
                        pageSize: options.pageSize
                    })
                }
            })
        } else {
            utilService.createHtml($('.JuicerAnchor-position'), positionTemplate, {
                list: data.list,
                account: account
            });
            utilService.createPage($('.JS-page-position'), {
                totalPages: data.pageCount,
                startPage: data.page,
                cb: function (page) {
                    queryPosition({
                        account: tradeId,
                        page: page,
                        pageSize: options.pageSize
                    })
                }
            })
        }

    }, err => {
        utilService.showTipDialog(err);
    })
}
// 撤单
function queryCancelList(options = {}) {
    tradeclientService.queryCancelOrder({
        account: tradeId,
        page: options.page,
        pageSize: options.pageSize
    }).then(function (data) {
        utilService.createHtml($('.JuicerAnchor-noneExecution'), cancelTemplate, {
            list: data.list
        })
        utilService.createPage($('.JS-page-cancel'), {
            totalPages: data.pageCount,
            startPage: data.page,
            cb: function (page) {
                queryCancelList({
                    account: tradeId,
                    page: page,
                    pageSize: options.pageSize
                })
            }
        })
    }, err => {
        utilService.showTipDialog(err);
    })
}
// 确认撤单
$('.JuicerAnchor-noneExecution').on('click', '.JS-cancelOrder', function () {
    let pcId = $(this).attr('data-pcId');
    new DialogService({
        callback: function () {
            // 撤单
            tradeclientService.cancelOrder({
                account: tradeId,
                orderId: pcId
            }).then(function (data) {
                utilService.showTipDialog('撤单成功');
                // 刷新列表
                queryCancelList({
                    account: tradeId
                })
            }, err => {
                utilService.showTipDialog(err);
            })
        }
    }).open({
        header: '撤单确认',
        content: '确认对您选择的委托进行撤单操作？'
    });
})

$orderForm.on('click', '.JS-order-showstock', function () {
    order.stockCode = $(this).find('.JS-position-stockCode').text();
    listentStockCode(order.stockCode);
})

// 根据tabIndex选择查询类型
function queryTypeByTabIndex(tabIndex, options = {}) {
    tradeclientService.queryTypeByTabIndex(tabIndex, {
        account: tradeId,
        page: options.page,
        pageSize: options.pageSize
    }).then(function (data) {
        // .JuicerAnchor-entrust
        utilService.createHtml($('.JuicerAnchor-' + tradeclientService.getQueryType(tabIndex)), queryTemplates[tabIndex], {
            list: data.list,
            account: account
        })
        utilService.createPage($('.JS-page-query'), {
            totalPages: data.pageCount,
            startPage: data.page,
            cb: function (page) {
                queryTypeByTabIndex(tabIndex, {
                    account: tradeId,
                    page: page,
                    pageSize: options.pageSize
                })
            }
        })
    }, err => {
        utilService.showTipDialog(err);
    })
}
// 初始化查询列表
function initQuery(tabIndex) {
    tradeclientService.chooseTab({
        tabIndex: tabIndex,
        contentIndex: tabIndex,
        tabDom: 'JS-tab-query',
        contentDom: 'JS-query-content'
    });
    // 初始化查询tab分页
    utilService.initPage($('.JS-page-query'));
    // 查询列表
    tradeclientService.queryAccount(tradeId).then(function (data) {
        account = data.account;
        queryTypeByTabIndex(tabIndex)
    }, err => {
        utilService.showTipDialog(err);
    })
}