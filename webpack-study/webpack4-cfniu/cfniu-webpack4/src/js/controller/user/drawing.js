require('../../../scss/user/drawing.scss');
require('./_userDrawPwd');
const utilService = require('../../service/utilService');
const DialogService = require('../../service/dialogService');
const userService = require('../../service/userService');
const drawListTemplate = require('../../../templates/user/drawList.html');

const $drawingForm = $('.JS-draw-form');
const $outletDialog = ('#JS-open-bank-Dialog');

selectTab(0);

let draw = {
    drawBankCard: utilService.getValue($drawingForm, 'drawBankCard'),
    outletsName: utilService.getValue($drawingForm, 'outletsName'),
    bankId: utilService.getValue($drawingForm, 'bankId'),
};
let outletData = {};

// 头部tab切换
$('.JS-tab-draw').click(function() {
    selectTab($(this).index());
})

function selectTab(tabIndex) {
    utilService.addTabSelected({
        tabDom: 'JS-tab-draw',
        index: tabIndex,
    });
    utilService.showContent({
        contentDom: 'JS-cotent-draw',
        index: tabIndex,
    });
    if (tabIndex == 1) {
        queryDrawList({
            page: 1,
            pageSize: 10
        });
    }
};

// 确认提现
$('.JS-confirm-draw-btn').click(function() {
    draw.drawAmount = utilService.getValue($drawingForm, 'drawAmount');
    draw.drawPwd = utilService.getValue($drawingForm, 'drawPwd');
    let balance = utilService.getValue($drawingForm, 'balance');
    let result = utilService.validate(['drawAmount', 'drawBankCard', 'drawPwd'], draw)
    if (result.status) {
        if (balance < 100 && draw.drawAmount < balance) {
            utilService.showTipDialog('提款金额少于100元，需全额提款');
        } else if (balance >= 100 && draw.drawAmount < 100) {
            utilService.showTipDialog('提款金额不能小于100元');
        } else if (draw.drawAmount > 49000) {
            utilService.showTipDialog('单笔提款金额最高49000，如需大额提款请分多笔操作');
        } else {
            // 判断开户行信息
            userService.getmybank()
                .then(data => {
                    if (data.banks && data.banks.length > 0) {
                        draw.outletsName = data.banks[0].outletsName;
                        if (draw.outletsName) {
                            // 提现
                            userService.toDraw(draw)
                                .then(data => {
                                    new DialogService({
                                        href: window.location.href
                                    }).open({
                                        content: "您申请的提款已成功，工作日10:00-15:00提款当日结算；15:00以后提款第2日结算；具体到账时间以银行为准。"
                                    })
                                }, err => {
                                    utilService.showTipDialog(err);
                                })
                        } else {
                            new DialogService({
                                id: 'JS-open-bank-Dialog'
                            }).open()
                        }
                    }
                }, err => {
                    utilService.showTipDialog(err);
                })
        }
    } else {
        utilService.showTipDialog(result.msg);
    }
})

// 开户行信息确认
$('.JS-confirm-open-bank-btn').click(function() {
    outletData.outletsName = utilService.getValue($('#JS-open-bank-Dialog'), 'outletsName');
    outletData.bankId = draw.bankId;
    let result = utilService.validate(['outletsName'], outletData);
    if (result.status) {
        userService.setOutletsName(outletData).then(data => {
            utilService.showTipDialog('设置成功');
        }, err => {
            utilService.setError($outletDialog, err);
        })
    } else {
        utilService.setError($outletDialog, result);
    }
})

// 忘记提现密码弹框
$('.JS-forget-draw-pwd').click(function() {
    new DialogService({
        id: 'JS-forget-draw-pwd-Dialog',
    }).open();
})

// 提现记录
function queryDrawList(option) {
    userService.getDrawingList(option)
        .then(data => {
            utilService.createHtml($('.JuicerAnchor-drawList'), drawListTemplate, {
                list: data.result.resultList
            });
            utilService.createPage($('.JS-page-draw-list'), {
                totalPages: data.result.totalPage,
                startPage: data.result.currentPage,
                cb: function(page) {
                    queryDrawList({
                        page: page,
                    })
                },
            });
        }, err => {
            utilService.showTipDialog(err);
        })
}

$('.JS-cotent-draw').on('click', '.JS-cancle', function() {
    let id = $('.JS-cancle').data('id');
    new DialogService({
        callback: function() {
            userService.cancelDraw({
                id: id,
            }).then(() => {
                new DialogService({
                    reload: true
                }).open({
                    content: '撤销成功'
                })
            }, err => {
                utilService.showTipDialog(err);
            })
        }
    }).open({
        content: '确认撤销该笔提款申请'
    })
})