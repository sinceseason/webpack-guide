require('../../../scss/user/message.scss');
require('./_userHead');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const constant = require('../../util/constant');
const noticeListTemplate = require('../../../templates/user/noticeList.html');
const systemListTemplate = require('../../../templates/user/systemNews.html');
const promotionListTemplate = require('../../../templates/user/promotionNews.html');

let message = {
    page: 1,
    pageSize: 10,
}

const hrefUrl = new Map()
    .set(11, '/user/coupon')
    .set(12, '/user/message')
    .set(13, '/user/extend')
    .set(14, '/user/recharge')
    .set(15, '/user/flowing')
    .set(16, '/user/assets')
    .set(17, '/trade/list')
    .set(18, '/trade/hislist');

// 首页公告跳转功能
let index = Number($('.JS-notice-index').val());
if (index) {
    utilService.addTabSelected(constant.TABS.USER_CENTER_HEADER[5])
}

selectTab(0);

// tab页切换
$('.JS-message-tab').click(function() {
    selectTab($(this).index());
})

function selectTab(tabIndex) {
    utilService.addTabSelected({
        tabDom: 'JS-message-tab',
        index: tabIndex,
    });
    utilService.showContent({
        contentDom: 'JS-message-content',
        index: tabIndex,
    });
    if (tabIndex == 0) {
        getNoticeList(message);
    }
    if (tabIndex == 1) {
        getSystemList(message);
    }
    if (tabIndex == 2) {
        getPromotionList(message);
    }
};

//公告信息
function getNoticeList(params) {
    userService.getNoticeList(params).then(data => {
        utilService.createHtml($('.JuicerAnchor-noticeList'), noticeListTemplate, {
            list: data.list,
            showIndex: index,
        });
        index = false;
        utilService.createPage($('.JS-page-message-list'), {
            totalPages: Math.ceil(data.totalCount / 10) === 0 ? 1 : Math.ceil(data.totalCount / 10),
            startPage: params.page,
            cb: function(page) {
                message.page = page;
                getNoticeList(message);
            }
        }, err => {
            utilService.showTipDialog(err);
        })
    })
}

// 系统消息
function getSystemList(params) {
    userService.getSystemList(params).then(data => {
        for (let i = 0; i < data.list.length; i++) {
            let id = data.list[i].id = Number(data.list[i].extras.split('action:')[1].split(',')[0])
            data.list[i].href = hrefUrl.get(id);
        }
        utilService.createHtml($('.JuicerAnchor-systemList'), systemListTemplate, {
            list: data.list
        });
        utilService.createPage($('.JS-page-system-list'), {
            totalPages: Math.ceil(data.totalCount / 10) === 0 ? 1 : Math.ceil(data.totalCount / 10),
            startPage: params.page,
            cb: function(page) {
                message.page = page;
                getSystemList(message);
            }
        })
    })
}

//活动精选
function getPromotionList(params) {
    userService.getPromotionList(params).then(data => {
        utilService.createHtml($('.JuicerAnchor-promotionList'), promotionListTemplate, {
            list: data.list
        });
        utilService.createPage($('.JS-page-promotion-list'), {
            totalPages: Math.ceil(data.totalCount / 10) === 0 ? 1 : Math.ceil(data.totalCount / 10),
            startPage: params.page,
            cb: function(page) {
                message.page = page;
                getPromotionList(message);
            }
        })
    })
}

// 事件委托
$('.JS-message-content').on('click', '.JS-msg-detail', function() {
    $(this).find('.message-detail').toggle();
    $(this).siblings().find('.message-detail').hide();
})