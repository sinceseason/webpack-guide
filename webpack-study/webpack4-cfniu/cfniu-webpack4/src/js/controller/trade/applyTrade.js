require('../../../scss/trade/applyTrade.scss');
const constant = require('../../util/constant.js');
const tradeService = require('../../service/tradeService');
const userService = require('../../service/userService');
const utilService = require('../../service/utilService');
const DialogService = require('../../service/dialogService');
// template
//申请资金
const applyAmountTemplate = require('../../../templates/trade/_applyAmount.html');
//投入资金
const tradeInvestAmountTemplate = require('../../../templates/trade/_tradeInvestAmount.html');
const tradeCouponTemplate = require('../../../templates/trade/_tradeCoupon.html');
const tradeResultTemplate = require('../../../templates/trade/_tradeResult.html');
const flashsaleCountDownHtml = require('../../../templates/trade/_flashsaleCountDown.html');
const tradeNoBalanceHtml = require('../../../templates/trade/_tradeNoBalance.html');

// init
let promotionId;
let trade = {
    originAmount: 0,
    pzType: getPzType()
};
let sale_timer;
let detail = {}
let tradeCoupon = {
    totalCanUse: 0,
    mgAgtCoupons: [],
    cashCoupons: []
};
let product = {};
let member = {
    account: {
        balance: 0
    }
};
let couponChoosedArr = [{
        couponTypeCode: '310001',
        couponCode: '',
        originAmount: 0
    },
    {
        couponTypeCode: '310002',
        couponCode: '',
        originAmount: 0
    }
];
init();

// 产品Tab选中效果
tradeService.chooseTab({
    tabDom: 'JS-product-tab',
    tabIndex: isNaN(trade.pzType) ? 0 : trade.pzType === '9' ? 5 : trade.pzType
});
tradeService.freeTab({
    tabDom: 'JS-freeProduct',
    tabIndex: trade.pzType
});

function init() {
    resetDealButton();
    trade.originAmount = 0;
    sale_timer;
    detail = {}
    tradeCoupon = {
        totalCanUse: 0,
        mgAgtCoupons: [],
        cashCoupons: []
    };
    product = {};
    member = {
        account: {
            balance: 0
        }
    };
    couponChoosedArr = [{
            couponTypeCode: '310001',
            couponCode: '',
            originAmount: 0
        },
        {
            couponTypeCode: '310002',
            couponCode: '',
            originAmount: 0
        }
    ];
    // 1.获取产品
    getProduct(trade.pzType);
    userService.getbalance().then(data => {
        member = data.member;
    })
}

$('.JS-dayLimitDialog').click(function () {
    tradeService.showTodayLimitStockDialog();
});
$('.JS-sale-tab').click(function () {
    trade.pzType = $(this).attr('data-pzType');
    initPromotion($(this).attr('data-id'));
    init();
    tradeService.chooseTab({
        tabDom: 'JS-product-tab',
        tabIndex: $(this).attr('data-nav')
    });
})
// 申请合约
$('.JS-deal').click(() => {
    if (!utilService.isLogin()) {
        utilService.toLoginUrl();
        return;
    }
    calculateHtml();
    // 操盘风险揭示
    tradeService.notice({
        flag: 'tradeFlag'
    }).then(function (data) {
        if (!data.list.length) {
            tradeService.getAgreement({
                adspaceId: 76
            }).then(function (data) {
                $('.JS-adName').text(data.jDtos[0].adName);
                $('.JS-test').html(data.jDtos[0].target);
                new DialogService({
                    id: 'agreementDialog'
                }).open()
            }, (err) => {
                new DialogService({
                    id: 'agreementDialog'
                }).open()
            })
        } else {
            preTradeDeal();
        }
    })
})
$('#agreementDialog .JS-confirm').on('click', function () {
    tradeService.postNotice({
        flag: 'tradeFlag'
    }).then(function () {
        preTradeDeal();
    })
})
$('#JS-tradeDialog .JS-submit').on('click', function () {
    // 余额不足
    if (trade.diff > 0) {
        utilService.createHtml($('.JuicerAnchor-tradeNoBalance'), tradeNoBalanceHtml, {
            balance: member.account.balance,
            investAmount: utilService.round(trade.investAmount, 2),
            mgtAmount: utilService.round(trade.accountMgAmt, 2) * trade.cycle
        });
        new DialogService({
            id: 'JS-tradeNoBalanceDialog'
        }).open();
    } else {
        var arrCode = [];
        for (var i = 0; i < couponChoosedArr.length; i++) {
            couponChoosedArr[i].couponCode && arrCode.push(couponChoosedArr[i].couponCode)
        }
        trade.couponCode = arrCode;
        tradeDeal();
    }
})

$('#JS-tradeNoBalanceDialog .JS-confirm').click(function () {
    location.href = '/user/recharge?diff=' + utilService.round(utilService.round(trade.investAmount, 2) + utilService.round(trade.accountMgAmt, 2) * trade.cycle - member.account.balance, 2);
})
// 选择优惠券tab
$('.JuicerAnchor-tradeResult,#JS-tradeDialog').on('click', '.JS-tab-tradeCoupon', function () {
    chooseCouponTab($(this).attr('data-nav'));
})
// 打开优惠券列表
$('.JuicerAnchor-tradeResult,#JS-tradeDialog').on('click', '.JS-coupon-switch', function () {
    switchFlag($(this).parent().parent().parent());
    let $parent = $(this).parents('#JS-tradeDialog').length > 0 ? $('#JS-tradeDialog') : $('.JuicerAnchor-tradeResult');
    udpateChoosedCouponTemplate($parent);
    updateCouponText();
    calculateHtml();
})
// 选择优惠券
$('.JuicerAnchor-tradeResult,#JS-tradeDialog').on('click', '.JS-coupon-item', function () {
    let couponTypeCode = utilService.getAttrValue($(this), 'data-couponTypeCode');
    let $parent = $(this).parents('#JS-tradeDialog').length > 0 ? $('#JS-tradeDialog') : $('.JuicerAnchor-tradeResult');
    // 更新卡券列表样式
    updateCouponListByCouponTypeCode($(this), couponTypeCode);
    choosedCoupon($(this), couponTypeCode);
    updateCouponText();
    calculateHtml();
})

function updateCouponListByCouponTypeCode($couponDom, couponTypeCode) {
    let typeStyles = ['manage', 'capital'];
    let currentStyle = couponTypeCode == constant.mgAgtCouponTypeCode ? typeStyles[0] : typeStyles[1];
    let $couponListDom = $('.JS-coupon-' + currentStyle);
    $couponListDom.find('.JS-coupon-item').removeClass('type-' + currentStyle + '-selected');
    $couponListDom.find('.JS-coupon-item').addClass('type-' + currentStyle);
    let choosedCoupon = couponTypeCode == constant.mgAgtCouponTypeCode ? couponChoosedArr[0] : couponChoosedArr[1];
    let couponCode = utilService.getAttrValue($couponDom, 'data-couponCode');
    if (choosedCoupon.couponCode !== couponCode) {
        $couponDom.addClass('type-' + currentStyle + '-selected');
        $couponDom.removeClass('type-' + currentStyle);
    }
}

function udpateChoosedCouponTemplate($dom) {
    let typeStyles = ['manage', 'capital'];
    let currentStyle;
    if (couponChoosedArr[0].couponTypeCode == constant.mgAgtCouponTypeCode) {
        currentStyle = typeStyles[0]
        $dom.find('.JS-coupon-item').each(function () {
            if (utilService.getAttrValue($(this), 'data-couponCode') == couponChoosedArr[0].couponCode) {
                $dom.removeClass('type-' + currentStyle);
                $(this).addClass('type-' + currentStyle + '-selected');
            }
        })
    }
    if (couponChoosedArr[1].couponTypeCode == constant.cashCouponTypeCode) {
        currentStyle = typeStyles[1];
        $dom.find('.JS-coupon-item').each(function () {
            if (utilService.getAttrValue($(this), 'data-couponCode') == couponChoosedArr[1].couponCode) {
                $dom.removeClass('type-' + currentStyle);
                $(this).addClass('type-' + currentStyle + '-selected');
            }
        })
    }
}

function choosedCoupon($couponDom, couponTypeCode) {
    let choosedCoupon = couponTypeCode == constant.mgAgtCouponTypeCode ? couponChoosedArr[0] : couponChoosedArr[1];
    let couponCode = utilService.getAttrValue($couponDom, 'data-couponCode');
    // 清空
    if (choosedCoupon.couponCode == couponCode) {
        choosedCoupon.originAmount = 0;
        choosedCoupon.couponCode = '';
        return;
    }
    console.log(choosedCoupon);
    // 选中卡券
    choosedCoupon.originAmount = utilService.getAttrValue($couponDom, 'data-originAmount');
    choosedCoupon.couponCode = couponCode;
    console.log(choosedCoupon);
}

function getPzType() {
    let pzTypeTemp = utilService.getRestfulParam();
    // 限时抢购
    if (isNaN(pzTypeTemp)) {
        promotionId = $('.JS-product-tab').eq(0).attr('data-id');
        initPromotion(promotionId);
        return $('.JS-product-tab').eq(0).attr('data-pzType')
    } else {
        return pzTypeTemp;
    }
}

function initPromotion(promotionId) {
    tradeService.getPromotionDetail({
        id: promotionId
    }).then(data => {
        detail = data.detail;
        // promotion = data.promotion;
        if (detail) {
            trade.detailId = detail.id;
            detail.waitSaleCount = data.detail.limitedCount - data.detail.realCount < 0 ? 0 : data.detail.limitedCount - data.detail.realCount;
            // 活动停止
            if (detail.waitSaleCount < 1 || detail.status != "UnderWay") {
                // 失效申请button
                disabledDealButton();
            }
            initTimer();
        } else {
            $('.JuicerAnchor-countdown').empty().append('活动正在筹备中，敬请期待！');
            disabledDealButton()
        };
    }, err => {
        utilService.showTipDialog(err);
    })
}

$('.JuicerAnchor-tradeResult,#JS-tradeDialog').on('click', '.JS-couponConfirm', function () {
    switchFlag($(this).parent().parent().parent());
})

function switchFlag($parent) {
    let $this = $('.JS-coupon-switch');
    if ($this.find('i').hasClass('icon-less')) {
        $this.find('i').removeClass('icon-less').addClass('icon-moreunfold');
        $parent.find('.JS-couponList').hide();
    } else {
        $this.find('i').removeClass('icon-moreunfold').addClass('icon-less');
        $parent.find('.JS-couponList').show();
    }
    updateCouponText();
    calculateHtml();
}

function updateCouponText() {
    if (couponChoosedArr[0].couponCode || couponChoosedArr[1].couponCode) {
        $('.JS-noChoose').hide();
        $('.JS-choose').find('.JS-mgt').text(couponChoosedArr[0].originAmount);
        $('.JS-choose').find('.JS-cash').text(couponChoosedArr[1].originAmount);
        $('.JS-choose').show();
    } else {
        $('.JS-noChoose').show();
        $('.JS-choose').hide();
    }
}

function tradeDeal() {
    if (trade.detailId) {
        tradeService.promotionTradeDeal({
            detailId: trade.detailId,
            pzType: trade.pzType,
            pzAmount: trade.pzAmount,
            cycle: trade.cycle,
            mutiple: trade.mutiple,
            couponCode: trade.couponCode
        }).then(() => {
            new DialogService({
                href: '/trade/list'
            }).open({
                content: constant.SUCCESS.trade
            });
        }, (err) => {
            utilService.showTipDialog(err);
        });
    } else {
        tradeService.tradeDeal({
            pzType: trade.pzType,
            pzAmount: trade.pzAmount,
            cycle: trade.cycle,
            mutiple: trade.mutiple,
            couponCode: trade.couponCode
        }).then(() => {
            new DialogService({
                href: '/trade/list'
            }).open({
                content: constant.SUCCESS.trade
            });
        }, (err) => {
            utilService.showTipDialog(err);
        });
    }
}

function preTradeDeal() {
    let result = utilService.validate(['pzAmount', 'mutiple'], trade);
    if (!product.canCreateFront || product.pzType === 900005 && !product.quota) {
        utilService.showTipDialog(constant.ERROR.canCreateFront);
    } else if (!result.status) {
        utilService.showTipDialog(result);
    } else {
        showTradeDialog();
    }
}

function showTradeDialog() {
    utilService.createHtml($('.JuicerAnchor-tradeDialog'), $('.JuicerTemplate-tradeDialog').html(), {
        trade: trade,
        product: product
    })
    utilService.createHtml($('.JuicerAnchor-tradeCoupon'), tradeCouponTemplate, {
        tradeCoupon: tradeCoupon,
        mgAgtCoupon: couponChoosedArr[0],
        cashCoupon: couponChoosedArr[1],
    });
    $('.JS-couponList').eq(0).hide();
    chooseCouponTab(0);
    calculateHtml();
    updateCouponText();
    new DialogService({
        id: 'JS-tradeDialog'
    }).open();
}

function getProduct(pzType) {
    tradeService.getProduct({
        pzType: pzType
    }).then((data) => {
        product = data.product;
        if (!product.canCreateFront) {
            disabledDealButton();
        }
        // 限购额度
        updateQuota(product);
        // 周期数组
        let cycleArr = utilService.getArray(data.product.cycleOptions);
        // 最短周期
        trade.cycle = cycleArr[0];
        // 申请资金列表
        let list = getApplyAmountList(data.product.pzAmountMax, data.product.pzAmountMin, utilService.getArray(data.product.amountOptions, ','));
        // 2.创建申请资金模板
        utilService.createHtml($('.JuicerAnchor-ApplyAmountList'), applyAmountTemplate, {
            list: list,
            product: product,
            pzType: trade.pzType
        });
        // 3.绑定选择申请资金事件
        utilService.bindEvent($('.JS-ApplyAmountList .JS-applyAmount'), function () {
            chooseApplyAmount($(this));
        });
        // 4.初始化符合条件的申请资金
        initApplyAmount(list);
        // 5.立即申请按钮颜色
        if (!product.canCreateFront) {
            $(".JS-deal").removeClass('btn-red')
        }
        let urlParams = 'pzAmount=' + trade.pzAmount + '&pzType=' + trade.pzType + '&cycle=' + trade.cycle + '&mutiple=' + trade.mutiple;
        $('.JS-tradeProtocol').attr({
            href: '/protocol/trade?' + urlParams
        });
    }, (err) => {
        utilService.showTipDialog(err);
    });
}

function updateQuota(product) {
    if (!product.isQuota) {
        $('.JS-isQuota').hide();
    } else {
        $('.JS-limit').text(product.quota);
    }
}

function getApplyAmountList(pzAmountMax, pzAmountMin, amountArr) {
    pzAmountMax = !pzAmountMax ? 0 : pzAmountMax;
    pzAmountMin = !pzAmountMin ? 0 : pzAmountMin;
    let applyAmountList = [];
    for (let i = 0; i < amountArr.length; i++) {
        applyAmountList.push({
            pzAmount: amountArr[i],
            text: amountArr[i] >= 10000 ? amountArr[i] / 10000 + '万' : amountArr[i],
            isAble: (amountArr[i] > pzAmountMax || amountArr[i] < pzAmountMin) ? false : true
        })
    }
    // 添加其他
    applyAmountList.push({
        pzAmount: 0,
        text: '其他',
        isAble: true
    });
    return applyAmountList;
}

function chooseInvestAmount($dom) {
    $('.JS-investAmountList .JS-investAmount').removeClass('selected');
    $dom.addClass('selected');
    // 按月类型&&选中首个
    let index = $('.JS-investAmountList .JS-investAmount').index($('.JS-investAmountList .JS-investAmount.selected'));
    trade.mutiple = utilService.getAttrValue($dom, 'data-mutiple'); //获得投入资金的倍数
    trade.investAmount = utilService.getAttrValue($dom.find('[data-investAmount]'), 'data-investAmount'); //获得投入资金的投资本金
    // 9.计算结果
    getTradeResult(trade);
}

function chooseApplyAmount($dom) {
    // 更新样式
    $('.JS-ApplyAmountList .JS-applyAmount').removeClass('selected');
    $dom.addClass('selected');
    trade.pzAmount = Number(utilService.getAttrValue($dom, 'data-pzamount'));
    if (trade.pzAmount) {
        // 隐藏其他输入框
        if ($dom.text() !== '其他') {
            $('.JS-otherApplyAmount,.JS-input-error').hide();
        }
        // 5.生成投入本金列表
        $('.JuicerAnchor-InvestAmountList').show();
        buildInvestAmountList();
    } else {
        // vip操盘
        if (trade.pzType === '6' || trade.pzType === '12') {
            trade.pzAmount = utilService.getValue($('.JS-ApplyAmountList'), 'pzamount') || 0;
            buildInvestAmountList();
        } else {
            $('.JuicerAnchor-InvestAmountList').hide();
            $('.JS-otherApplyAmount').show();
        }
        // 监听input
        utilService.bindEvent($('.JS-otherApplyAmount'), function () {
            trade.pzAmount = utilService.getValue($('.JS-ApplyAmountList'), 'pzamount');
            if (trade.pzAmount < product.pzAmountMin || trade.pzAmount > product.pzAmountMax || !/[1-9]\d*000$/.test(trade.pzAmount) || isNaN(trade.pzAmount)) {
                trade.pzAmount = 0;
                $('.JS-input-error').show();
            } else {
                $('.JS-input-error').hide();
                $('.JuicerAnchor-InvestAmountList').show();
                buildInvestAmountList();
            }
        }, 'keyup');
    }
}

function initApplyAmount(list) {
    for (let i = 0; i < list.length; i++) {
        if (list && list[i].isAble) {
            chooseApplyAmount($('.JS-ApplyAmountList button').eq(i));
            break;
        }
    }
}

function buildInvestAmountList() {
    let list = [];
    // 杠杆数组
    let mutipleArr = product && product.mutipleOptions ? utilService.getArray(product.mutipleOptions) : [];
    for (let i = 0; i < mutipleArr.length; i++) {
        list.push({
            value: utilService.round(trade.pzAmount / mutipleArr[i], '0') || 0,
            mutiple: mutipleArr[i],
            isTehui: product.cycleType === 1,
            monthText: initMonthText()
        });
    }
    // 6. 创建投入资金模板
    utilService.createHtml($('.JuicerAnchor-InvestAmountList'), tradeInvestAmountTemplate, {
        list: list,
        pzType: trade.pzType
    });
    // 7.绑定投资资金事件
    utilService.bindEvent($('.JS-investAmountList .JS-investAmount'), function () {
        chooseInvestAmount($(this));
    });
    // 8.默认选择首个
    if (trade.pzAmount || trade.pzType === '6' || trade.pzType === '12') {
        chooseInvestAmount($('.JS-investAmountList .JS-investAmount').eq(0), 1);
    }
    // 9.查询月利率
    // getinterest();
}

function initMonthText() {
    if (trade.pzType === '5' || trade.pzType === '9') {
        return '免息'
    } else {
        return '';
    }
}

function getTradeResult(trade) {
    if (trade.pzType === '6' && !trade.pzAmount || trade.pzType === '12' && !trade.pzAmount) {
        utilService.createHtml($('.JuicerAnchor-tradeResult'), tradeResultTemplate, {
            trade: {
                product: {}
            },
            pzType: trade.pzType
        });
        getCoupons();
    } else if (!trade || !trade.pzType || !trade.pzAmount || !trade.cycle || !trade.mutiple) {
        return;
    } else {
        tradeResult(trade);
    }
}

function tradeResult(trade) {
    tradeService.getTradeResult({
        pzType: trade.pzType,
        pzAmount: trade.pzAmount,
        cycle: trade.cycle,
        mutiple: trade.mutiple
    }).then((data) => {
        // 处理最长操盘天数
        let cycleOptions = utilService.getArray(data.trade.product.cycleOptions);
        data.trade.product.maxCycle = cycleOptions[cycleOptions.length - 1];
        trade.accountMgAmt = data.trade.accountMgAmt;
        trade.ratio = data.ratio;
        trade.wfDuration = data.trade.wfDuration;
        trade.endTradeDate = data.trade.endTradeDate;
        trade.wfPercent = data.trade.wfPercent;
        utilService.createHtml($('.JuicerAnchor-tradeResult'), tradeResultTemplate, {
            trade: data.trade,
            pzType: trade.pzType
        });
        initCouponTemplate();
        let urlParams = 'pzAmount=' + trade.pzAmount + '&pzType=' + trade.pzType + '&cycle=' + trade.cycle + '&mutiple=' + trade.mutiple;
        $('.JS-tradeProtocol').attr({
            href: '/protocol/trade?' + urlParams
        });
    }, (err) => {
        new DialogService().open({
            content: err.resultMsg || constant.Error.serverDefault
        });
    });
}

function initCouponTemplate() {
    tradeService.getCoupons({
        pzType: trade.pzType,
        pzAmount: trade.pzAmount,
        multiple: trade.mutiple,
        cycle: trade.cycle
    }).then(function (data) {
        setCouponTrade(data.coupons);

        utilService.createHtml($('.JuicerAnchor-tradeCoupon'), tradeCouponTemplate, {
            tradeCoupon: tradeCoupon,
            mgAgtCoupon: couponChoosedArr[0],
            cashCoupon: couponChoosedArr[1],
        });
        chooseCouponTab(0)
        calculateHtml();
    }, (err) => {
        calculateHtml();
    })
}

function chooseCouponTab(tabIndex) {
    utilService.addTabSelected({
        tabDom: 'JS-tab-tradeCoupon',
        index: tabIndex
    });
    utilService.showContent({
        contentDom: 'JS-content-tradeCoupon',
        index: tabIndex
    });
}

function setCouponTrade(originCoupons) {
    tradeCoupon = {
        totalCanUse: 0,
        mgAgtCoupons: [],
        cashCoupons: []
    };
    couponChoosedArr = [{
            couponTypeCode: '310001',
            couponCode: '',
            originAmount: 0
        },
        {
            couponTypeCode: '310002',
            couponCode: '',
            originAmount: 0
        }
    ];
    for (let i = 0; i < originCoupons.length; i++) {
        let couponItem = originCoupons[i];
        if (couponItem.canUse) {
            tradeCoupon.totalCanUse++;
        }
        if (couponItem.couponTypeCode == constant.mgAgtCouponTypeCode) {
            tradeCoupon.mgAgtCoupons.push(couponItem);
        }
        if (couponItem.couponTypeCode == constant.cashCouponTypeCode) {
            tradeCoupon.cashCoupons.push(couponItem);
        }
    }
}

function calculateHtml() {
    let mgAgtCoupon = couponChoosedArr[0];
    let CashCoupon = couponChoosedArr[1];
    // 管理费=单价管理费*周期
    let totalMgAmount = utilService.round(trade.accountMgAmt, 2) * trade.cycle;
    // 应付管理费
    let actualMgAmount = mgAgtCoupon.originAmount > totalMgAmount ? 0 : utilService.round(totalMgAmount - mgAgtCoupon.originAmount, 2);
    //投资本金-本金券
    let actualInvestAmount = CashCoupon.originAmount > trade.investAmount ? 0 : utilService.round(trade.investAmount - CashCoupon.originAmount, 2)
    // 总价
    trade.totalAmount = utilService.round(actualInvestAmount + actualMgAmount, 2);
    trade.actualMgAmount = actualMgAmount;
    trade.actualInvestAmount = actualInvestAmount;
    // 剩余
    trade.diff = utilService.round(trade.totalAmount - member.account.balance, 2);
    // 积分
    trade.score = Math.round(actualMgAmount);

    $('.JS-score').text(trade.score);
    $('.JS-totalAmount').text(trade.totalAmount);
}

function disabledDealButton() {
    $('.JS-deal').attr({
        disabled: true
    }).removeClass('btn-red').addClass('btn-grey');
}

function resetDealButton() {
    $('.JS-deal').attr({
        disabled: false
    }).removeClass('btn-grey').addClass('btn-red');
}

function initTimer() {
    utilService.createHtml($('.JuicerAnchor-countdown'), flashsaleCountDownHtml, {
        detail: detail
    });
    var countDown = detail && detail.countDown ? detail.countDown : 0;
    runCountdown(countDown);
}

function runCountdown(countDown) {
    clearInterval(sale_timer);
    // 倒计时
    sale_timer = setInterval(function () {
        countDown = countDown - 1;
        convertTime(countDown);
    }, 1000);
}
// 时间转换
function convertTime(countDown) {
    if (countDown < 1) {
        clearInterval(sale_timer);
        return;
    }
    var timeArr = [];
    var day = parseInt(countDown / 60 / 60 / 24, 10) < 10 ? '0' + parseInt(countDown / 60 / 60 / 24, 10) : parseInt(countDown / 60 / 60 / 24, 10); //计算剩余的天数 
    var hour = parseInt(countDown / 60 / 60 % 24, 10) < 10 ? '0' + parseInt(countDown / 60 / 60 % 24, 10) : parseInt(countDown / 60 / 60 % 24, 10); //计算剩余的小时 
    var min = parseInt(countDown / 60 % 60, 10) < 10 ? '0' + parseInt(countDown / 60 % 60, 10) : parseInt(countDown / 60 % 60, 10); //计算剩余的分钟 
    var second = parseInt(countDown % 60, 10) < 10 ? '0' + parseInt(countDown % 60, 10) : parseInt(countDown % 60, 10); //计算剩余的秒数 
    timeArr = [day, '天', hour, '时', min, '分', second, '秒'];
    // 更新页面
    $('#sale-countdown').empty();
    for (var i = 0; i < timeArr.length; i++) {
        if (i % 2 === 0) {
            $('#sale-countdown').append("<span class='time-red'>" + timeArr[i] + "</span>");
        } else {
            $('#sale-countdown').append("<span class='fb'>" + timeArr[i] + "</span>");
        }
    }
}