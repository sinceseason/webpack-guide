require('../../../scss/trade/tradeHisList.scss');
const utilService = require('../../service/utilService');
const tradeService = require('../../service/tradeService');
const tradeHisListHtml = require('../../../templates/trade/_tradeHisList.html');

let tradeListQuery = {
    page: 1,
    pageSize: 10,
    type: -2
}

tradeList(1);
tradeService.chooseTab({
    tabDom: 'JS-tradeList-tab',
    tabIndex: 1
});
// 查询当前列表
function tradeList(page) {
    tradeListQuery.page = page;
    tradeService.getTradeList(tradeListQuery).then(function (data) {
        var resultList = data.tradeList.resultList;
        for (let i = 0; i < resultList.length; i++) {
            resultList[i].tradeTotal = tradeService.getTradeTotal(resultList[i]);
        }
        utilService.createHtml($('.JuicerAnchor-tradeList'), tradeHisListHtml, {
            list: resultList
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

$('.JuicerAnchor-tradeList').on('click', '.JS-hisDetail', function () {
    var id = utilService.getAttrValue($(this), 'data-tradeId');
    location.href = `/trade/hisdetail?tradeId=${id}`
})