require('../../../scss/other/other.scss');
const utilService = require('../../service/utilService');
const newsService = require('../../service/newsService');
const constant = require('../../util/constant');
const mediaDetailTemplate = require('../../../templates/other/mediaDetailList.html');

utilService.selectedTab(constant.TABS.OTHER_LEFT_HEADER);

queryNewsDetail();

function queryNewsDetail(options = {}) {
    newsService.newsDetail({
        id: utilService.getUrlParams().id
    }).then(data => {
        utilService.createHtml($('.JuicerAnchor-news-detail'), mediaDetailTemplate, {
            mediaDetail: data.news
        });
    }, err => {
        utilService.showTipDialog(err);
    })
}