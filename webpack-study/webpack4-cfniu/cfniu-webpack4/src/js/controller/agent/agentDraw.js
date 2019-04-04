require('../../../scss/agent/draw.scss');

const DialogService = require('../../service/dialogService');
const agentService = require('../../service/agentService');
const userService = require('../../service/userService');
const tradeService = require('../../service/tradeService');
const utilService = require('../../service/utilService');
const constant = require('../../util/constant');
const myBankOperatorList = require('../../../templates/agent/myBankOperatorList.html');
const drawRecordList = require('../../../templates/agent/drawRecordList.html');

// 我要提款
let $agentToDrawing = $('.JS-content[data-content=0]');
// 银行卡管理
let $agentBankManager = $('.JS-content[data-content=1]');
// 提款记录
let $agentDrawingRecord = $('.JS-content[data-content=2]');
let draw = {};
utilService.chooseTab(0);
queryMyBank();
$('.JS-tab').click(function () {
    let index = $(this).attr('data-nav');
    utilService.chooseTab(index);
    if (index == 0) {
        queryMyBank();
    } else if (index == 1) {
        queryMyBank();
        queryBank();
        queryProvince(0);
    } else if (index == 2) {
        queryDrawingRecord(1);
    }
})
// 获取短信
$agentToDrawing.find('.JS-getdrawcode').click(event => {
    draw.drawAmount = utilService.getValue($agentToDrawing, 'drawAmount');
    draw.drawBankCard = $agentToDrawing.find('.JS-drawBankCard').val();
    draw.type = 1;
    let result = utilService.validate(['drawAmount', 'drawBankCard'], draw);
    if (result.status) {
        agentService.getDrawCode(draw).then(data => utilService.countDown($agentToDrawing.find('.JS-countDown'), constant.CountDown), error => utilService.showTipDialog(error))
    } else {
        utilService.showTipDialog(result);
    }
});

// 提交，提现请求
$agentToDrawing.find('.JS-draw').click(event => {
    draw.drawAmount = utilService.getValue($agentToDrawing, 'drawAmount');
    draw.drawBankCard = $agentToDrawing.find('.JS-drawBankCard').val();
    draw.drawPwd = utilService.getValue($agentToDrawing, 'drawPwd');
    draw.drawSourceType = 1;
    let result = utilService.validate(['drawAmount'], draw);
    if (result.status) {
        if (draw.drawAmount > $('[data-balance]').attr('data-balance')) {
            utilService.showTipDialog('提现金额不能大于可提金额');
        } else if (!draw.drawPwd) {
            utilService.showTipDialog('请输入手机验证码');
        } else {
            tradeService.draw(draw).then(data => (new DialogService({
                reload: true
            }).open({
                content: constant.SUCCESS.draw
            })), error => utilService.showTipDialog(error))
        }
    } else {
        utilService.showTipDialog(result);
    }
})
// 选择省
$agentBankManager.find('.JuicerAnchor-provinceList').change((event) => {
    queryCity($(event.currentTarget).val());
})
$agentBankManager.on('click', '.JS-removebank', function () {
    let removeBankId = utilService.getAttrValue($(this), 'data-bankId');
    new DialogService({
        callback: function () {
            agentService.removeBank({
                id: removeBankId
            }).then(() => {
                utilService.showTipDialog("删除成功");
                queryMyBank();
            }, error => {
                utilService.showTipDialog(error)
            })
        }
    }).open({
        content: '您确认删除银行卡：' + utilService.getAttrValue($(this), 'data-bankCard')
    });
})
// 银行卡格式化
$agentBankManager.find('input[name*="cardNo"]').bind('input', function () {
    let cardNo = $(this).val().replace(/\s/g, '');
    $(this).val(utilService.splitBySpace(cardNo));
})
// 保存银行卡
let agentBank = {};
$agentBankManager.find('.JS-confirm').click(event => {
    agentBank.cardNo = (utilService.getValue($agentBankManager, 'cardNo').replace(/\s/g, ''));
    agentBank.cardNo2 = (utilService.getValue($agentBankManager, 'cardNo2').replace(/\s/g, ''));
    agentBank.bankId = $agentBankManager.find('.JuicerAnchor-bankList').val();
    agentBank.bankName = $.trim($agentBankManager.find('.JuicerAnchor-bankList').text().split('（')[0]);
    agentBank.outletsName = utilService.getValue($agentBankManager, 'outletsName');
    agentBank.proName = $agentBankManager.find('.JuicerAnchor-provinceList').val();
    agentBank.cityName = $agentBankManager.find('.JuicerAnchor-cityList').val();
    let result = utilService.validate(['bankName', 'proName', 'cityName', 'outletsName', 'cardNo', 'cardNo2'], agentBank);
    if (result.status) {
        if (agentBank.cardNo !== agentBank.cardNo2) {
            utilService.showTipDialog(constant.ERROR.differentCardNo);
        } else {
            agentBank.proName = $agentBankManager.find('.JuicerAnchor-provinceList option:selected').text();
            agentBank.cityName = $agentBankManager.find('.JuicerAnchor-cityList option:selected').text();
            agentService.saveBank(agentBank).then(
                data => (queryMyBank(),
                    utilService.showTipDialog(constant.SUCCESS.saveBank),
                    $('.JS-drawingContent').find('input').val(''),
                    queryProvince(0),
                    queryCity()),
                error => utilService.showTipDialog(error.resultMsg));
        }
    } else {
        utilService.showTipDialog(result)
    }
})

function queryMyBank() {
    tradeService.getmybank().then(data => {
        utilService.createHtml($('.JuicerAnchor-myBankOperatorList'), myBankOperatorList, {
            banks: data.banks
        });
        utilService.createHtml($('.JuicerAnchor-myBankList'), $('.JuicerTemplate-myBankList').html(), {
            banks: data.banks
        });
    });

}

function queryBank() {
    agentService.getBank().then(data => {
        utilService.createHtml($('.JuicerAnchor-bankList'), $('.JuicerTemplate-bankList').html(), {
            banks: data.banks
        });
    })
}

function queryProvince(parentId) {
    userService.getCity({
        parentId: parentId
    }).then(data => {
        utilService.createHtml($('.JuicerAnchor-provinceList'), $('.JuicerTemplate-provinceList').html(), {
            city: data.city
        });
    })
}

function queryCity(parentId) {
    userService.getCity({
        parentId: parentId
    }).then(data => {
        utilService.createHtml($('.JuicerAnchor-cityList'), $('.JuicerTemplate-cityList').html(), {
            city: data.city
        });
    })
}

function queryDrawingRecord(page) {
    agentService.getDraw({
        page: page,
        pageSize: constant.pageSize
    }).then(data => {
        var statusArr = ["处理中", "已完成", "已驳回", "待放款", "放款中"];
        for (var i = 0; i < data.result.resultList.length; i++) {
            data.result.resultList[i].statusText = statusArr[data.result.resultList[i].status];
        }
        utilService.createHtml($('.JuicerAnchor-drawingRecord'), drawRecordList, {
            list: data.result.resultList
        });
        utilService.createPage($('.JS-page'), {
            totalPages: data.result.totalPage,
            startPage: page,
            cb: function (page) {
                queryDrawingRecord(page);
            }
        });
    })
}