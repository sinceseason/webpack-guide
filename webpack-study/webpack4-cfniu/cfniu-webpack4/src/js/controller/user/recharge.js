require('../../../scss/user/recharge.scss');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const DialogService = require('../../service/dialogService');
const payService = require('../../service/payService');
const rechargeListTemplate = require('../../../templates/user/rechargeList.html');

const $payTypeBtn = $('.JS-pay-type-btn');
const $rechargeForm = $('.JS-recharge-Form');
const $recharge = $('.JS-recharge');
const $transfer = $('.JS-transfer');

let amount = 0;
let deltaTypeId = 0;
let transfer = {};
let member = {};

selectTab(0);
userService.getbalance().then(data => {
    member = data.member;
});

// 头部tab切换
$('.JS-tab-recharge').click(function() {
    selectTab($(this).index());
})

function selectTab(tabIndex) {
    utilService.addTabSelected({
        tabDom: 'JS-tab-recharge',
        index: tabIndex,
    });
    utilService.showContent({
        contentDom: 'JS-cotent-recharge',
        index: tabIndex,
    });
    if (tabIndex == 2) {
        queryRechargeList({
            page: 1,
            pageSize: 10
        });
    }
};

// 充值方式
$payTypeBtn.click(function() {
    $payTypeBtn.addClass('btn-disabled');
    $(this).removeClass('btn-disabled');
    deltaTypeId = $(this).data('type');
    utilService.setValue($rechargeForm.find('input[name="deltaTypeId"]'), deltaTypeId);
})

// 在线充值表单提交
$('.JS-recharge-btn').click(function() {
    amount = utilService.getValue($recharge, 'amount');
    let result = utilService.validate(['amount'], {
        amount: amount
    });
    if (result.status) {
        if (amount < 100)
            utilService.showTipDialog('金额不得小于100元');
        else {
            utilService.setValue($rechargeForm.find('input[name="deltaTypeId"]'), deltaTypeId);
            utilService.setValue($rechargeForm.find('input[name="deltaAmount"]'), amount);
            utilService.setValue($rechargeForm.find('input[name="deltaTotalAmount"]'), amount);
            $rechargeForm.submit();
        }
    } else {
        utilService.showTipDialog(result.msg);
    }
})

// 线下转账
// 文件凭证上传
$transfer.find('input[type=file]').fileupload({
    autoUpload: true, //是否自动上传  
    url: "/upload.api", //上传地址  
    dataType: 'json',
    change: function(e, data) {
        transfer.tempAttachment = null;
        $.each(data.files, function(index, file) {
            if (file.size > 20480000) {
                utilService.showTipDialog('请上传不大于20M的图片');
                return;
            }
            if (!/\.jpg$|\.png$|\.jpeg$|\.gif$/g.test(file.name.toLowerCase())) {
                utilService.showTipDialog('请上传图片格式为*.jpg;*.png;*.jpeg;*.gif的图片');
                return;
            }
            // 图片预览 createObjectURL
            transfer.prelook = window.URL.createObjectURL(file);
            if (file && window.URL) {
                $('.JS-prelook').show();
                // 设置弹出对话框的图片 src
                $('#JS-offline-prelook-Dialog img').attr({
                    'src': transfer.prelook
                });
                $('.JS-first-upload').hide();
            }
        })
    },
    done: function(e, data) {
        let repObj = data.result;
        if (repObj.status) {
            let filePath = repObj.filePath;
            if (/\.jpg$|\.png$|\.jpeg$|\.gif$/g.test(filePath.toLowerCase())) {
                transfer.tempAttachment = filePath;
                $('.JS-is-uploaded').show();
                $('.JS-file-name').text(filePath);
            }
            // else {
            //     utilService.showTipDialog('请上传不大于20M的*.jpg;*.png;*.jpeg;*.gif图片');
            //     $('.JS-first-upload').show();
            // }
        }
    },
    fail: function(e, data) {
        utilService.showTipDialog(e.message);
    },
})

// 图片预览
$('.JS-prelook').click(function() {
    new DialogService({
        id: 'JS-offline-prelook-Dialog'
    }).open();
})

// 线下转账确认
$('.JS-transfer-btn').click(function() {
    transfer.amount = utilService.getValue($transfer, 'amount');
    transfer.remark = transfer.remarkRecharge = $('.JS-transfer-select option:selected').val();
    transfer.terminal = 0;
    let result = utilService.validate(['amount', 'remarkRecharge', 'tempAttachment'], transfer);
    // 判断实名，绑卡
    if (!member.validated) {
        new DialogService({
            href: '/user/assets'
        }).open({
            content: '请先完成实名认证信息',
            btn: '立即前往'
        })
    } else if (!member.bindCard) {
        new DialogService({
            href: '/user/addBank'
        }).open({
            content: '请先绑定银行',
            btn: '立即前往'
        })
    } else if (result.status) {
        payService.transfer(transfer).then(data => {
            transfer.tempAttachment = null;
            new DialogService({
                href: '/user/assets'
            }).open({
                content: '上传成功'
            });
        }, err => {
            transfer.tempAttachment = null;
            utilService.showTipDialog(err);
        })
    } else {
        transfer.tempAttachment = null;
        utilService.showTipDialog(result.msg);
    }
})

// 图片示例
$('.JS-img-example').click(function() {
    new DialogService({
        id: 'JS-img-example-dialog'
    }).open();
})

// 充值记录
function queryRechargeList(option) {
    userService.getRechargeList(option)
        .then(data => {
            utilService.createHtml($('.JuicerAnchor-rechargeList'), rechargeListTemplate, {
                list: data.result.resultList
            });
            utilService.createPage($('.JS-page-recharge-list'), {
                totalPages: data.result.totalPage,
                startPage: data.result.currentPage,
                cb: function(page) {
                    queryRechargeList({
                        page: page,
                    })
                },
            });
        }, err => {
            utilService.showTipDialog(err);
        })
}

// 查看凭证
$('.JS-cotent-recharge').on('click', '.JS-show-attachment', function() {
    $('.JS-attachment-src').attr('src', utilService.getAttrValue($(this), 'data-attachment'));
    new DialogService({
        id: 'JS-show-attachment',
    }).open();
})