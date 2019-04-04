require('../../../scss/user/extend.scss');
require('./_userHead');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const DialogService = require('../../service/dialogService');
const trackListTemplate = require('../../../templates/user/trackList.html');
const trackListUserTemplate = require('../../../templates/user/trackUserList.html');

const $phoneForm = $('.JS-phone-form');

selectTab(0);

let phoneMsg = {};

// tab页切换
$('.JS-extend-tab').click(function() {
    selectTab($(this).index());
})

function selectTab(tabIndex) {
    utilService.addTabSelected({
        tabDom: 'JS-extend-tab',
        index: tabIndex,
    });
    utilService.showContent({
        contentDom: 'JS-extend-content',
        index: tabIndex,
    });
    if (tabIndex == 1) {
        trackList({
            page: 1,
            pageSize: 10,
        });
    }
    if (tabIndex == 2)
        trackUserList({
            page: 1,
            pageSize: 10,
        });
};

// 微信分享
$('.JS-wx-link').click(function() {
    new DialogService({
        id: 'JS-wx-share-Dialog'
    }).open();
})

// 短信链接
$('.JS-phone-link').click(function() {
    new DialogService({
        id: 'JS-url-phone-Dialog'
    }).open();
})

$('.JS-url-phone-btn').click(function() {
    phoneMsg.ivc = utilService.getValue($phoneForm, 'ivc');
    phoneMsg._ = utilService.getValue($phoneForm, 'key');
    let result = utilService.validate(['ivc'], phoneMsg);

    if (result.status) {
        userService.getShareMsg(phoneMsg).then(data => {
            utilService.showTipDialog('短信将发送至您在平台绑定的手机号码中');
        }, err => {
            utilService.setError($phoneForm, err);
        })
    } else {
        utilService.setError($phoneForm, result);
    }
})

// 复制链接
$('.JS-copy-link').click(function() {
    new DialogService({
        id: 'JS-copy-link-Dialog'
    }).open();
})

// 复制到剪贴板
$('.JS-copy-link-btn').click(function() {
    let e = document.getElementById('JS-copy-link-textarea');
    e.select();
    let tag = document.execCommand("copy");
    if (tag) {
        utilService.showTipDialog('链接已复制到剪贴板');
    } else {
        utilService.showTipDialog('该浏览器不支持自动复制，请手动复制');
    }
})

// 收益明细
function trackList(options = {}) {
    userService.getMyTrackList(options).then(data => {
        utilService.createHtml($('.JuicerAnchor-trackList'), trackListTemplate, {
            list: data.list
        });
        utilService.createPage($('.JS-page-track-list'), {
            totalPages: data.pageCount,
            startPage: data.page,
            cb: function(page) {
                trackList({
                    page: page
                })
            }
        })
    }, err => {
        utilService.showTipDialog(err);
    })
}

//用户明细
function trackUserList(options = {}) {
    userService.getMyTrackUserList(options).then(data => {
        utilService.createHtml($('.JuicerAnchor-trackUserList'), trackListUserTemplate, {
            list: data.list
        });
        utilService.createPage($('.JS-page-track-user-list'), {
            totalPages: data.pageCount,
            startPage: data.page,
            cb: function(page) {
                trackUserList({
                    page: page
                })
            }
        })
    }, err => {
        utilService.showTipDialog(err);
    })
}

// 用户明细--去提醒
$('.JuicerAnchor-trackUserList').on('click', '.JS-remind', function() {
    new DialogService({
        id: 'JS-remind-friend-Dialog'
    }).open()
})