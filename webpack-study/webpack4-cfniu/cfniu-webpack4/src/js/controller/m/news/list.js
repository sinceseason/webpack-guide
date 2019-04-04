require('../../../../scss/m/news/list.scss');
const newsListTemplate = require('../../../../templates/m/news/list.html');
const utilService = require('../../../service/utilService');
const cmsService = require('../../../service/cmsService');
import Pagination from './_common';
var pagination = new Pagination({
    $loading: $('.JS-pagination-loading'),
    $el: document.getElementById('JS-pagination'),
    startY: 0, //touch 点击开始Y坐标
    currentY: 0, //touch 移动中Y坐标
    startScrollTop: 0,
    scrollEventTarget: null,
    translate: 0,
    allowFetch: true,
    distanceIndex: 1, //拖动比例
    maxDistance: 50 //最大拖动距离
});
var buss = {
    data: {
        page: 2,
        limit: 10,
        channelId: window.location.href.split('news/c')[1],
        parentId: 79
    }
}
pagination.callbackFn = function () {
    pagination.allowFetch = false;
    cmsService.findByChannelId(buss).then(function (data) {
        if (data.totalCount && data.totalCount > buss.data.page * buss.data.limit) {
            buss.data.page = buss.data.page + 1;
            utilService.createHtml($('.JuicerAnchor-list'), newsListTemplate, {
                list: data.jcContentDtos
            }, true)
            pagination.allowFetch = true;
        }
    })
}

// 分页初始化
pagination.init();