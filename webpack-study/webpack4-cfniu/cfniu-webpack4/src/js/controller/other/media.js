require('../../../scss/other/other.scss');
const utilService = require('../../service/utilService');
const constant = require('../../util/constant');
const newsService = require('../../service/newsService');
const mediaListTemplate = require('../../../templates/other/mediaList.html');

utilService.selectedTab(constant.TABS.OTHER_LEFT_HEADER);

queryNews();

function queryNews(options = {}) {
    newsService.getList({
        type: '800002',
        pageSize: 5,
        page: options.page || 1
    }).then(data => {
        utilService.createHtml($('.JuicerAnchor-media'), mediaListTemplate, data);
        utilService.createPage($('.JS-page'), {
            totalPages: data.pageCount,
            startPage: data.page,
            cb: function(page) {
                queryNews({
                    page: page
                })
            }
        });
    }, err => {
        utilService.showTipDialog(err);
    })
}