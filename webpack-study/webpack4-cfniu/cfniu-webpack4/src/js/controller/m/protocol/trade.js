require('../../../../scss/m/protocol/protocol.scss');

const tradeService = require('../../../service/tradeService');
const utilService = require('../../../service/utilService');

let trade = {
    pzType: utilService.getUrlParams().pzType,
    pzAmount: utilService.getUrlParams().pzAmount,
    cycle: utilService.getUrlParams().cycle,
    mutiple: utilService.getUrlParams().mutiple
}

tradeService.getTradeResult(trade).then(data => {
    // 中文
    trade.pzAmountCn = utilService.toChinaMoney(trade.pzAmount);
    trade.capitalAmountCn = utilService.toChinaMoney(data.trade.capitalAmount);
    utilService.setText('data-pzAmountCn', trade.pzAmountCn)
    utilService.setText('data-capitalAmountCn', trade.capitalAmountCn)
    utilService.setText('data-pzAmount', trade.pzAmount)
    utilService.setText('data-capitalAmount', data.trade.capitalAmount)
    utilService.setText('data-cycleTypeText', data.trade.cycleType == 0 ? '交易日' : data.trade.cycleType == 1 ? '月' : '周')
    utilService.setText('data-firstTradeDate', data.trade.firstTradeDate)
    utilService.setText('data-endTradeDate', data.trade.endTradeDate)
    utilService.setText('data-accountMgAmt', data.trade.accountMgAmt)
    utilService.setText('data-accountMgAmtAll', data.trade.accountMgAmt * trade.cycle)
    utilService.setText('data-accountMgAmtAll', data.trade.accountMgAmt * trade.cycle)
    utilService.setText('data-profitRate', 100 - data.trade.profitRate)
    if (data.trade.profitRate && data.trade.profitRate == 100) {
        $('.JS-discount').hide();
        $('.JS-discount-no').show();
    }
})
$('.JS-discount').show();
$('.JS-discount-no').hide();