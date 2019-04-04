require('../../../scss/user/addBank.scss');
const userService = require('../../service/userService');
const utilService = require('../../service/utilService');
const DialogService = require('../../service/dialogService');

const cityListTemplte = require('../../../templates/user/cityList.html');

const $addBankForm = $('.JS-addBank-form');
const $confirmBtn = $('.JS-confirm-btn');

let addBank = {};

// 市级的联动选择
$('.JS-select-pro').change(function() {
    userService.getcity({
        parentId: $(this).find('option:selected').data('id'),
    }).then(data => {
        utilService.createHtml($('.JuicerAnchor-city'), cityListTemplte, {
            list: data.city,
        });
    }, err => {
        utilService.showTipDialog(err);
    })
});

// 银行卡号增加空格
$addBankForm.find("input[name*='cardNo']").bind('input propertychange', function() {
    let $this = $(this);
    let cardNo = $this.val().replace(/\s+/g, '');
    $this.val(utilService.splitBySpace(cardNo));
})

// 提交
$confirmBtn.click(function() {
    addBank.phone = utilService.getValue($addBankForm, 'phone');
    addBank.bankName = utilService.getValue($addBankForm, 'bankName');
    addBank.bankId = addBank.bankName;
    addBank.cardNo = $.trim(utilService.getValue($addBankForm, 'cardNo'));
    addBank.cardNo = addBank.cardNo ? addBank.cardNo.replace(/\s+/g, '') : addBank.cardNo;
    addBank.proName = utilService.getValue($addBankForm, 'proName');
    addBank.cityName = utilService.getValue($addBankForm, 'cityName');
    addBank.outletsName = utilService.getValue($addBankForm, 'outletsName');
    let result = utilService.validate(['bankName', 'proName', 'cityName', 'cardNo', 'phone'], addBank)
    if (result.status) {
        userService.savebank(addBank).then(function(data) {
            new DialogService({
                href: '/user/assets'
            }).open({
                content: '绑定成功'
            });
        }, err => {
            utilService.showTipDialog(err);
        })
    } else {
        utilService.showTipDialog(result.msg);
    }
});