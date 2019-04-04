require('../../../scss/protocol/protocol.scss');

const tradeService = require('../../service/tradeService');
const utilService = require('../../service/utilService');

// /app/protocol/trade.html?pzType=0&pzAmount=2000&accountMgAmt=3.0&tzAmount=667&username=aaaa&firstTradeDate=2018-03-08
// &telephone=18512135202&idCard=310105199201140000&cycleType=0&mutiple=3&cycle=2&mgAmtAll=6.0&endTradeDate=2018-03-09

let $protocol = $('.JS-protocol');

let trade = {
    pzType: utilService.getUrlParams().pzType,
    pzAmount: utilService.getUrlParams().pzAmount,
    cycle: utilService.getUrlParams().cycle,
    mutiple: utilService.getUrlParams().mutiple,
    capitalAmountCn: 0,
    pzAmountCn: 0,
    capitalAmount: 0
}
tradeService.getTradeResult(trade).then(data => {
    // 中文
    trade.pzAmountCn = utilService.toChinaMoney(trade.pzAmount);
    trade.capitalAmountCn = utilService.toChinaMoney(data.trade.capitalAmount);
    trade.capitalAmount = data.trade.capitalAmount;
    utilService.setText('data-pzAmountCn', trade.pzAmountCn)
    utilService.setText('data-capitalAmountCn', trade.capitalAmountCn)
    utilService.setText('data-pzAmount', trade.pzAmount)
    utilService.setText('data-capitalAmount', trade.capitalAmount)
    utilService.setText('data-cycleTypeText', data.trade.cycleType == 0 ? '交易日' : data.trade.cycleType == 1 ? '月' : '周')
    utilService.setText('data-firstTradeDate', data.trade.firstTradeDate)
    utilService.setText('data-endTradeDate', data.trade.endTradeDate)
    utilService.setText('data-accountMgAmt', data.trade.accountMgAmt)
    utilService.setText('data-accountMgAmtAll', data.trade.accountMgAmt * trade.cycle)
    utilService.setText('data-profitRate', 100 - data.trade.profitRate)
    if (data.trade.profitRate && data.trade.profitRate == 100) {
        $('.JS-discount').hide();
        $('.JS-discount-no').show();
    }
})
$('.JS-discount').show();
$('.JS-discount-no').hide();