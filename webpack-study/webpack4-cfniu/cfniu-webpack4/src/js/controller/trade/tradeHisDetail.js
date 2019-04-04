require('../../../scss/trade/tradeHisDetail.scss');
const transHisListHtml = require('../../../templates/trade/_transHisList.html');
const utilService = require('../../service/utilService');
const tradeService = require('../../service/tradeService');

var id = utilService.getUrlParams().tradeId;

gethistrasbill(1);

function gethistrasbill(page) {
    tradeService.gethistrasbill({
        page: page,
        tradeId: id
    }).then(function (data) {
        utilService.createHtml($('.JuicerAnchor-tradeHisList'), transHisListHtml, data);
        utilService.createPage($('.JS-page'), {
            startPage: page,
            totalPages: data.pageCount,
            cb: function (page) {
                gethistrasbill(page);
            }
        })
    })
}