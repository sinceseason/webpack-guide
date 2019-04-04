require('../../../scss/trade/tradeDetail.scss');

const utilService = require('../../service/utilService');
const constant = require('../../util/constant.js');
const tradeService = require('../../service/tradeService');
const userService = require('../../service/userService');
const tradeclientService = require('../../service/tradeclientService');
const DialogService = require('../../service/dialogService');
const tradeDetailHtml = require('../../../templates/trade/_tradeDetail.html');
const flowListHtml = require('../../../templates/trade/_flowList.html');
const positionTemplate = require('../../../templates/trade/_tradePositionList.html');
const tingpaiHtml = require('../../../templates/trade/_tingpai.html');
const tradeProfitHtml = require('../../../templates/trade/_tradeProfit.html');
const tradeNoBalanceHtml = require('../../../templates/trade/_tradeNoBalance.html');
const delaySaleHtml = require('../../../templates/trade/_delaySale.html');
let tradeId = utilService.getUrlParams().tradeId;
let trade = {};
let account = {};
let balance = 0;
let ioType = '201010';
let profit = {
    fetchProfit: 0, //可提取金额
    maxFtechProfit: 0
}
let tingpai = {
    amount: 0,
    balance: 0,
    order: {}
};
let extension = {};
let multiples = [];
initTradeDetail();
userService.getbalance().then(data => {
    balance = data.member.account.balance;
})
// 合约流水
$('.JuicerAnchor-tradeDetail').on('click', '.JS-tradeFlowList', function () {
    getTradeFlowDetail(1, ioType);
})
// 合约流水Tab选择
$('#JS-tradeFlowListDialog').on('click', '.JS-flowIoType', function () {
    getTradeFlowDetail(1, utilService.getAttrValue($(this), 'data-ioType'));
})

// 提取利润
$('.JuicerAnchor-tradeDetail').on('click', '.JS-profit', function () {
    utilService.createHtml($('.JuicerAnchor-profit'), tradeProfitHtml, {
        profit: profit
    })
    new DialogService({
        id: 'JS-profitDialog'
    }).open();
})
// do提取利润
$('#JS-profitDialog .JS-submit').click(function () {
    let profitAmount = Number(utilService.getValue($('#JS-profitDialog'), 'profitAmount'));
    let result = utilService.validate(['profitAmount'], {
        profitAmount: profitAmount
    });
    if (!result.status) {
        utilService.setError($('#JS-profitDialog'), {
            name: 'profit',
            msg: constant.ERROR.profitAmount
        })
    } else if (profitAmount > profit.maxFtechProfit) {
        utilService.setError($('#JS-profitDialog'), {
            name: 'profit',
            msg: '最高可提取' + profit.maxFetchProfit + '元'
        })
    } else {
        tradeService.tradeFetchProfit({
            id: tradeId,
            profitAmount: profitAmount
        }).then(data => {
            utilService.showTipDialog(constant.SUCCESS.profit);
        }, (err) => {
            utilService.showTipDialog(err);
        })
    }
})
// 追加保证金
$('.JuicerAnchor-tradeDetail').on('click', '.JS-addCapital', function () {
    $('.JS-balance').text(utilService.money(balance));
    $('.JS-addMin').text(utilService.money(utilService.round(trade.wfPercent * 0.01)));
    new DialogService({
        id: 'JS-addCapitalDialog'
    }).open();
})
$('#JS-addCapitalDialog .JS-confirm').on('click', function () {
    trade.fxAmount = Number(utilService.getValue($('#JS-addCapitalDialog'), 'fxAmount'));
    let result = utilService.validate(['fxAmount'], trade);
    if (!result.status) {
        utilService.setError($('#JS-addCapitalDialog'), {
            msg: constant.ERROR.fxAmount,
            name: 'fxAmount'
        })
    } else if (trade.fxAmount < trade.wfPercent * 0.01) {
        utilService.setError($('#JS-addCapitalDialog'), {
            msg: constant.ERROR.minFxAmount,
            name: 'fxAmount'
        })
    } else if (trade.fxAmount > balance) {
        $('.JS-noBalance-money').text(utilService.money(trade.fxAmount));
        $('.JS-difference').text(utilService.money(trade.fxAmount - balance));
        new DialogService({
            id: 'noBalanceModal'
        }).open();
        $('#noBalanceModal .JS-confirm').click(function () {
            location.href = '/user/recharge?diff=' + utilService.round(trade.fxAmount - balance)
        })
    } else {
        tradeService.addCapital({
            fxAmount: trade.fxAmount,
            id: trade.id
        }).then(data => {
            new DialogService({
                reload: true
            }).open({
                content: constant.SUCCESS.addCapital
            });
        }, err => {
            utilService.showTipDialog(err);
        })
    }
})
// 停牌股
$('.JuicerAnchor-tradeDetail').on('click', '.JS-stopTrade', function () {
    if (trade.ArrearsCost) {
        utilService.showTipDialog(constant.ERROR.arrearsCost);
    } else {
        tradeService.getStopStockMultiple().then(data => {
            multiples = data.multiple;
            getCalc(multiples[0]);
            new DialogService({
                id: 'JS-stopTradeDialog'
            }).open();
        }, err => {
            utilService.showTipDialog(err);
        })
    }
})
//选择杠杆
$('#JS-stopTradeDialog').on('change', 'select', function () {
    getCalc($('#JS-stopTradeDialog select option:selected').val());
})
$('#JS-stopTradeDialog .JS-confirm').click(function () {
    if (tingpai.amount > tingpai.balance) {
        utilService.createHtml($('.JuicerAnchor-tradeNoBalance'), tradeNoBalanceHtml, {
            balance: tingpai.balance,
            investAmount: tingpai.amount,
            mgtAmount: tingpai.order.accountMgAmt
        });
        new DialogService({
            id: 'JS-tradeNoBalanceDialog',
            href: '/user/recharge?diff=' + utilService.round(tingpai.order.accountMgAmt + tingpai.amount - tingpai.balance, 2)
        }).open();
    } else {
        tradeService.stopTrade({
            tradeId: tradeId,
            multiple: $('#JS-stopTradeDialog select option:selected').val()
        }).then(function (data) {
            location.href = '/trade/list'
        }, (err) => {
            utilService.showTipDialog(err);
        })
    }

})

// 延期卖出
$('.JuicerAnchor-tradeDetail').on('click', '.JS-delaySale', function () {
    if (trade.product.maxDuration <= trade.wfDuration) {
        utilService.showTipDialog(constant.ERROR.extension);
    } else {
        extension.optionCycle = [];
        for (var i = 1; i <= (trade.product.maxDuration - trade.wfDuration); i++) {
            extension.optionCycle.push(i);
        }
        if (!extension.cycle) {
            extension.cycle = extension.optionCycle[0];
        }
        applyDelay();
    }
})
$('#JS-delaySaleDialog .JS-confirm').on('click', function () {
    if (extension.cost > balance) {
        $('#JS-noBalance-delayDialog .JS-balance').text(balance);
        $('#JS-noBalance-delayDialog .JS-noBalance-money').text(extension.cost);
        $('#JS-noBalance-delayDialog .JS-difference').text(utilService.money(extension.cost - balance));
        new DialogService({
            id: 'JS-noBalance-delayDialog',
            href: '/user/recharge?diff=' + utilService.round(extension.cost - balance)
        }).open();
    } else {
        tradeService.extension({
            cycle: extension.cycle,
            tradeId: tradeId
        }).then(function () {
            new DialogService({
                reload: true
            }).open({
                content: constant.SUCCESS.extension
            })
        }, (err) => {
            utilService.showTipDialog(err);
        })
    }
})

function applyDelay() {
    tradeService.applyDelay({
        tradeId: tradeId,
        cycle: extension.cycle
    }).then(data => {
        extension.cost = data.cost;
        utilService.createHtml($('.JuicerAnchor-delaySale'), delaySaleHtml, {
            cost: data.cost,
            optionCycle: extension.optionCycle,
            wfDuration: trade.wfDuration
        })
        new DialogService({
            id: 'JS-delaySaleDialog'
        }).open();
    }, err => {
        utilService.showTipDialog(err);
    })
}
//选择延期时间
$('#JS-delaySaleDialog').on('change', 'select', function () {
    extension.cycle = $('#JS-delaySaleDialog select option:selected').val();
    applyDelay();
})
// 结算
$('.JuicerAnchor-tradeDetail').on('click', '.JS-tradeCancel', function () {
    let tradeText = '确认结算当前合约？';
    // 按月、周合约，替换提示文案
    if (trade.cycleType === 1 && trade.ArrearsCost || trade.cycleType === 2 && trade.ArrearsCost) {
        let time = trade.endTradeDate.split(' ')[0].split('-');
        tradeText = `合约到期时间：${time[0]}年${time[1]}月${time[2]}日，若提前结算不退还剩余管理费！`;
    }
    $('#JS-tradeCancelDialog').find('.JS-content').text(tradeText);

    new DialogService({
        id: 'JS-tradeCancelDialog'
    }).open();
})
// 去结算
$('#JS-tradeCancelDialog .JS-confirm').click(function () {
    tradeService.tradeCancel({
        id: tradeId
    }).then(data => {
        new DialogService({
            href: '/trade/hislist'
        }).open({
            content: '结算成功'
        })
    }, err => {
        utilService.showTipDialog(err);
    });
})

function getCalc(multiple) {
    tradeService.calStopStockOrder({
        tradeId: tradeId,
        multiple: multiple
    }).then(data => {
        tingpai.amount = data.amount;
        tingpai.order = data.order;
        tingpai.balance = data.balance;
        utilService.createHtml($('.JuicerAnchor-tingpai'), tingpaiHtml, {
            multiple: multiples,
            amount: tingpai.amount,
            order: tingpai.order,
            chooseMultiple: multiple
        });
    }, err => {
        utilService.showTipDialog(err);
    })
}

function getTradeFlowDetail(page, ioType) {
    tradeService.tradeFlowDetail({
        page: page,
        ioType: ioType,
        tradeId: tradeId
    }).then(function (data) {
        utilService.createHtml($('.JucierAnchor-flowList'), flowListHtml, {
            flow: data,
            ioType: ioType
        })
        utilService.addTabSelected({
            tabDom: 'JS-flowIoType',
            index: $('.JucierAnchor-flowList [data-ioType="' + ioType + '"]').attr('data-nav')
        });
        utilService.createPage($('.JS-page-flowList'), {
            startPage: page,
            totalPages: data.pageCount,
            cb: function (page) {
                getTradeFlowDetail(page, ioType);
                $('html, body').scrollTop(0);
            }
        })
        new DialogService({
            id: 'JS-tradeFlowListDialog'
        }).open();
    })
}

function initTradeDetail() {
    tradeclientService.queryAccount(tradeId).then(data => {
        account = data.account;
        // 持仓
        queryPosition();
        // 查询操盘详情
        return tradeService.getTradeInfo({
            transId: tradeId
        })
    }).then(data => {
        trade = data.trade;
        // 利润提取
        profit.fetchProfit = tradeService.getTradeTotal(data.trade) < trade.wfPercent ? '0' : utilService.round(trade.tradeTotal - trade.wfPercent, 2);
        profit.maxFetchProfit = Math.min(trade.currPercent.current_cash, profit.fetchProfit);
        utilService.createHtml($('.JuicerAnchor-tradeDetail'), tradeDetailHtml, {
            trade: trade,
            account: account,
            usedDay: data.usedDay
        })
    }, err => {
        utilService.showTipDialog(err);
    })
}

function queryPosition() {
    tradeclientService.queryPosition({
        account: tradeId,
        page: 1
    }).then(data => {
        utilService.createHtml($('.JuicerAnchor-positionList'), positionTemplate, {
            list: data.list,
            account: account,
            tradeId: tradeId
        })
        utilService.createPage($('.JS-page'), {
            totalPages: data.pageCount,
            startPage: data.page,
            cb: function (page) {
                queryPosition({
                    account: tradeId,
                    page: page
                })
            }
        })
    }, err => {
        utilService.showTipDialog(err);
    })
}