require('../../../scss/user/coupon.scss');
require('./_userHead');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const DialogService = require('../../service/dialogService');
const constant = require('../../util/constant');

const $baseDialog = $('#JS-base-Dialog');
const $addCouponDialog = $('#JS-add-coupon-Dialog');
let coupon = {};

selectTab(0);

// 头部tab切换
$('.JS-tab-coupon').click(function() {
    selectTab($(this).index());
})

function selectTab(tabIndex) {
    utilService.addTabSelected({
        tabDom: 'JS-tab-coupon',
        index: tabIndex,
    });
    utilService.showContent({
        contentDom: 'JS-cotent-coupon',
        index: tabIndex,
    });
};

// 添加优惠券弹框
$('.JS-add-coupon').click(function() {
    new DialogService({
        id: 'JS-add-coupon-Dialog',
    }).open();
})

// 确认添加优惠券
$('.JS-confirm-add-coupon-btn').click(function() {
    let code = utilService.getValue($addCouponDialog, 'code');
    if (!code) {
        utilService.setError($addCouponDialog, {
            msg: constant.ERROR.couponCode,
            name: 'code',
        })
    } else {
        userService.addCoupon({
            couponCode: code
        }).then(data => {
            utilService.showTipDialog(constant.SUCCESS.coupon);
        }, err => {
            err.name = 'code';
            utilService.setError($addCouponDialog, err);
        })
    }
})

// 兑换优惠券
$('.JS-exchange-coupon-btn').click(function() {
    coupon.id = utilService.getAttrValue($(this), 'data-couponid');
    $baseDialog.find('.JS-base-tip-text').text('是否兑换该优惠券？');
    new DialogService({
        id: 'JS-base-Dialog',
    }).open();
})

// 确认兑换
$baseDialog.find('.JS-base-confirm-btn').click(function() {
    userService.checkCoupon({
        id: coupon.id
    }).then(data => {
        new DialogService({
            reload: true,
        }).open({
            content: '您已成功添加一张' + data.coupon.balance + '元' + data.coupon.couponType.refDictName
        })
    }, err => {
        utilService.showTipDialog(err);
    })
})