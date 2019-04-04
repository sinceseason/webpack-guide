require('../../../scss/user/assets.scss');
require('./_userHead');
require('./_userDrawPwd');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const DialogService = require('../../service/dialogService');
const constant = require('../../util/constant');

const $realNameForm = $('.JS-realName-form');
const $telFrom = $('.JS-tel-from');
const $telNextForm = $('.JS-modify-tel-next-form');
const $modifyPwdForm = $('.JS-modify-pwd-form');
const $modifyDrawPwdForm = $('.JS-modify-drawPwd-form');

let user = {};
let newUser = {};
let realName = {};
let newPwd = {};
let newDrawPwd = {};

/* 
 *  弹出对话框 start
 */
// 实名认证
$('.JS-realName').click(function() {
        new DialogService({
            id: 'JS-realName-Dialog'
        }).open();
    })
    // 修改绑定手机
$('.JS-modify-tel').click(function() {
    new DialogService({
        id: 'JS-modify-tel-Dialog'
    }).open();
});
//修改登录密码
$('.JS-modify-pwd').click(function() {
    new DialogService({
        id: 'JS-modify-pwd-Dialog'
    }).open();
});
//修改提现密码
$('.JS-modify-draw-pwd').click(function() {
    new DialogService({
        id: 'JS-modify-drawPwd-Dialog'
    }).open();
});
//设置提现密码
$('.JS-set-draw-pwd').click(function() {
    new DialogService({
        id: 'JS-forget-draw-pwd-Dialog'
    }).open();
});
/* 
 *  弹出对话框 end
 */

// 实名认证
$('.JS-realName-btn').click(function() {
    realName.realName = utilService.getValue($realNameForm, 'realName');
    realName.idCard = utilService.getValue($realNameForm, 'idCard');
    let result = utilService.validate(['realName', 'idCard'], realName);

    if (result.status) {
        userService.getRealName(realName).then(function(data) {
            new DialogService({
                href: '/user/assets'
            }).open({
                content: '认证成功'
            });
        }, err => {
            utilService.setError($realNameForm, err);
        })
    } else {
        utilService.setError($realNameForm, result);
    }
})

// 修改绑定手机 start
// 获取短信验证码
$('.JS-getverifyCode').click(function() {
        user.ivc = utilService.getValue($telFrom, 'ivc');
        user.key = $('.JS-telephone').data('telephone');
        user.type = constant.SendCode_modifyTel;
        let result = utilService.validate(['key', 'ivc'], user);

        if (result.status) {
            userService.sendCode(user).then(data => {
                // 倒计时
                utilService.countDown($(this));
            }, err => {
                utilService.setError($telFrom, err);
            })
        } else {
            utilService.setError($telFrom, result);
        }
    })
    // 下一步
$('.JS-next-step').click(function() {
        user.ivc = utilService.getValue($telFrom, 'ivc');
        user.key = $('.JS-telephone').data('telephone');
        user.verifyCode = utilService.getValue($telFrom, 'verifyCode');
        user.type = constant.SendCode_checkSMSCode;
        let result = utilService.validate(['key', 'ivc', 'verifyCode'], user);

        if (result.status) {
            userService.checkSMSCode(user).then(data => {
                new DialogService({
                    id: 'JS-modify-tel-next-dialog'
                }).open();
            }, err => {
                utilService.setError($telFrom, err);
            })
        } else {
            utilService.setError($telFrom, result);
        }
    })
    // 点击下一步后，绑定新手机
$('.JS-next-getverifyCode').click(function() {
        newUser.ivc = utilService.getValue($telNextForm, 'ivc');
        newUser.key = utilService.getValue($telNextForm, 'telephone');
        newUser.type = constant.SendCode_modifyTel;
        let result = utilService.validate(['key', 'ivc'], newUser);

        if (result.status) {
            userService.sendCode(newUser).then(data => {
                // 倒计时
                utilService.countDown($(this));
            }, err => {
                utilService.setError($telNextForm, err);
            })
        } else {
            utilService.setError($telNextForm, result);
        }
    })
    // 确认修改密码
$('.JS-confirm-tel-btn').click(function() {
        newUser.verifyCode = utilService.getValue($telNextForm, 'verifyCode');
        newUser.type = constant.SendCode_checkSMSCode;
        let result = utilService.validate(['key', 'ivc', 'verifyCode'], newUser);

        if (result.status) {
            userService.modifyTel(newUser).then(data => {
                new DialogService({
                    href: '/user/assets'
                }).open({
                    content: '修改成功'
                });
            }, err => {
                utilService.setError($telNextForm, err);
            })
        } else {
            utilService.setError($telNextForm, result);
        }
    })
    //修改绑定手机 end

// 绑定银行卡
$('.JS-bind-bank').click(function() {
    let realName = $(this).data('realname');
    if (realName) {
        window.location.href = '/user/addBank';
    } else {
        utilService.showTipDialog('请先实名认证');
    }
})

// 修改登录密码
$('.JS-modify-pwd-btn').click(function() {
    newPwd.verifyCode = utilService.getValue($modifyPwdForm, 'oldPwd');
    newPwd.pwd = utilService.getValue($modifyPwdForm, 'pwd');
    newPwd.pwd2 = utilService.getValue($modifyPwdForm, 'pwd2');
    let result = utilService.validate(['pwd', 'pwd2'], newPwd);

    if (result.status) {
        userService.modifyPwd(newPwd).then(data => {
            new DialogService({
                href: '/user/assets'
            }).open({
                content: '修改成功'
            });
        }, err => {
            utilService.setError($modifyPwdForm, err);
        })
    } else {
        utilService.setError($modifyPwdForm, result);
    }
})

// 设置提现密码

// 修改提现密码
$('.JS-confirm-drawPwd-btn').click(function() {
    newDrawPwd.oldPwd = utilService.getValue($modifyDrawPwdForm, 'oldPwd')
    newDrawPwd.pwd = utilService.getValue($modifyDrawPwdForm, 'pwd')
    newDrawPwd.pwd2 = utilService.getValue($modifyDrawPwdForm, 'pwd2')
    let result = utilService.validate(['oldPwd', 'pwd', 'pwd2'], newDrawPwd);

    if (result.status) {
        userService.modifyDrawPwd(newDrawPwd).then(data => {
            new DialogService({
                href: '/user/assets'
            }).open({
                content: '修改成功'
            });
        }, err => {
            utilService.setError($modifyDrawPwdForm, err);
        })
    } else {
        utilService.setError($modifyDrawPwdForm, result);
    }
})

// echarts-饼图
const $stockAsset = $('#stockAsset');
let stock = $stockAsset.attr('data-stock');
let finance = $stockAsset.attr('data-finance');
let cash = $stockAsset.attr('data-cash');

let sum = Number(stock) + Number(finance) + Number(cash)
let text1, text2
if (sum == 0) {
    text1 = '0.00%';
    text2 = '0.00%';
} else {
    text1 = (stock / sum * 100).toFixed(2) + '%';
    text2 = (cash / sum * 100).toFixed(2) + '%';
}

drawChart('stockAsset', ['#FF5256'], text1);
drawChart('balance', ['#566B96'], text2);

function drawChart(domId, color, text) {
    var assetsChart = echarts.init(document.getElementById(domId));
    var option = {
        color: color,
        title: {
            text: text,
            textStyle: {
                fontFamily: '微软雅黑',
                fontSize: 12,
                fontWeight: 'bold',
                color: color[0]
            },
            x: 'center',
            y: 'center',
        },
        series: [{
            type: 'pie',
            radius: ['85%', '100%'],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                }
            },
            data: [{
                value: 100,
                name: '资产'
            }],
        }],
    }
    assetsChart.setOption(option);
}