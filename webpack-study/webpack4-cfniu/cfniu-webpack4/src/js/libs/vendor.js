require('./thrids');
const utilService = require('../service/utilService');
const userService = require('../service/userService');
const agentService = require('../service/agentService');
const constant = require('../util/constant');
const DialogService = require('../service/dialogService');

// 注册input聚焦时间
$('input[name]').on('focus', function() {
    $('li.focus').removeClass('focus');
    $(this).parent('li').addClass('focus');
});

// trackId
let tid = utilService.getUrlParams().trackId;
utilService.saveCookie('tid', tid);

// header tab选中
utilService.selectedTab(constant.TABS.HEADER);
// 操盘tab
utilService.selectedTab(constant.TABS.TRADE_HEADER);
// 个人中心
utilService.selectedTab(constant.TABS.USER_CENTER_HEADER);
// 退出
$('.JS-login-out').on('click', function() {
    userService.loginOut();
})

//退出登录  居间商
$('.JS-agentOut').on('click', function() {
    agentService.loginOut();
})

// 侧边栏二维码显示
$('.JS-float-menu .JS-menu-icon').hover(function() {
    $(this).find('.JS-menu-animate-wrap').removeClass('ewm-content-hide').addClass('ewm-content').show();
}, function() {
    $(this).find('.JS-menu-animate-wrap').removeClass('ewm-content').addClass('ewm-content-hide').hide();
})

// 投诉建议
$('.JS-suggest').click(function() {
    $('#JS-suggest-Dialog').find('textarea').val('');
    new DialogService({
        id: 'JS-suggest-Dialog',
    }).open();
})

let $suggestForm = $('#JS-suggest-Dialog');
let suggest = {};

// 选择投诉类型
$suggestForm.find('.JS-select-suggest').click(function() {
    suggest.msgType = $(this).val();
})
$suggestForm.find('.JS-submit').click(function() {
        suggest.msgType = utilService.getValue($suggestForm, 'msgType');
        suggest.phone = utilService.getValue($suggestForm, 'phone');
        suggest.content = suggest.contentNum = utilService.getValue($suggestForm, 'content');
        let result = utilService.validate(['msgType', 'phone', 'contentNum'], suggest);
        if (result.status) {
            userService.savemsg(suggest).then(data => {
                utilService.showTipDialog("提交成功");
            }, err => {
                utilService.setError($suggestForm, err);
            })
        } else {
            utilService.setError($suggestForm, result);
        }
    })
    // 智齿客服
$('.JS-kf').click(function() {
    userService.getbalance().then(data => {
        // 处理搬迁用户
        var removeFlagCNArr = ['搬迁用户', '非搬迁用户', '新用户'];
        var remark = removeFlagCNArr[data.member.moveFlag];
        var zhichiUrl = 'https://www.sobot.com/chat/pc/index.html?sysNum=8700782baaa64316b68e5dadac561639&robotFlag=2&partnerId=' +
            $.cookie('uid') + '&uname=' + data.member.userName + '&tel=' + data.member.telephone + '&remark=财富牛 ' + remark;
        window.open(zhichiUrl);
    }, err => {
        var zhichiUrl = 'https://www.sobot.com/chat/pc/index.html?sysNum=8700782baaa64316b68e5dadac561639&robotFlag=2';
        window.open(zhichiUrl);
    })
});

// 点击回到顶部
$('.JS-float-menu').find('.JS-back-to-top').click(function() {
    $('html, body').animate({
        scrollTop: '0px'
    }, 800);
});