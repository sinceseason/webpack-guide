require('../../../scss/trade/tradeList.scss');
const utilService = require('../../service/utilService');
const tradeService = require('../../service/tradeService');
const constant = require('../../util/constant');
const userService = require('../../service/userService');
const tradeListHtml = require('../../../templates/trade/_tradeList.html');
const DialogService = require('../../service/dialogService');
// init
let balance;
let userLevel;
let trade = {};
let qrcodeUrl = '/napi/share/qrcode?url=';
let shareUrl = 'http://activity.cfniu.com.cn/wx/sharetrade?share=';
let tradeListQuery = {
    page: 1,
    pageSize: 5,
    type: -1
}
tradeService.chooseTab({
    tabDom: 'JS-tradeList-tab',
    tabIndex: 0
});
userService.getbalance().then(data => {
    balance = data.member.account.balance;
    userLevel = data.member.level;
    tradeList(1);
})

// 分享战绩
$('.JuicerAnchor-tradeList').on('click', '.JS-wxShare', function () {
    new DialogService({
        id: 'JS-wx-share-Dialog'
    }).open();
    var shareVal = $(this).attr('data-share');
    $('#JS-wx-share-Dialog').find('.JS-qrcode-url img').attr('src',
        qrcodeUrl + shareUrl + shareVal)
})
//追加保证金
$('.JuicerAnchor-tradeList').on('click', '.JS-addCapital', function () {
    trade.capital = Number(utilService.getAttrValue($(this), 'data-addcapital'));
    trade.id = Number(utilService.getAttrValue($(this), 'data-tradeId'));
    $('.JS-balance').text(utilService.money(balance));
    $('.JS-addMin').text(utilService.money(utilService.round(trade.capital)));
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
    } else if (trade.fxAmount < trade.capital) {
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
// 查询当前列表
function tradeList(page) {
    tradeListQuery.page = page;
    tradeService.getTradeList(tradeListQuery).then(function (data) {
        var resultList = data.tradeList.resultList;
        for (let i = 0; i < resultList.length; i++) {
            resultList[i].tradeTotal = tradeService.getTradeTotal(resultList[i]);
            resultList[i].balance = balance;
        }
        utilService.createHtml($('.JuicerAnchor-tradeList'), tradeListHtml, {
            list: resultList,
            userLevel: userLevel
        })
        utilService.createPage($('.JS-page'), {
            startPage: page,
            totalPages: resultList.length > 0 ? data.tradeList.totalPage : 1,
            cb: function (page) {
                tradeList(page);
                $('html, body').scrollTop(0);
            }
        })
    })
}