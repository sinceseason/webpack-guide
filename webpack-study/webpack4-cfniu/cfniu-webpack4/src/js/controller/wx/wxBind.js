/*
 * @Author: shixinghao 
 * @Date: 2018-07-13 14:29:11 
 * @Last Modified by:   shixinghao 
 * @Last Modified time: 2018-07-13 14:29:11 
 */
require('../../../scss/wx/wxBind.scss');
const constant = require('../../util/constant');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');

const $wxBindForm = $('.JS-wx-bind-form');
const $wxNewer = $('.JS-wx-newer');
const $wxOlder = $('JS-wx-older');

let user = {};
user.openId = utilService.getUrlParams().openId;

// 新老用户切换
$('.JS-change-wx-user').click(function() {
    $wxNewer.toggle();
    $wxOlder.toggle();
})

// 发送短信验证码
$('.JS-count-dwon').click(function() {
    user.key = utilService.getValue($wxBindForm, 'key');
    user.ivc = utilService.getValue($wxBindForm, 'ivc');
    user.type = constant.SendCode_ForgetPwd;
    let result = utilService.validate(['key', 'ivc'], user);
    if (result.status) {
        userService.sendCode(user).then(data => {
            // 倒计时
            utilService.countDown($('.JS-count-dwon'));
        }, err => {
            utilService.setError($wxBindForm, err);
        })
    } else {
        utilService.setError($wxBindForm, result);
    }
})

// 新用户注册
$wxBindForm.find('.JS-submit-btn').click(function () {
    user.telephone = utilService.getValue($wxNewer, 'key');
    user.userName = user.telephone;
    user.verifyCode = utilService.getValue($wxNewer, 'verifyCode');
    user.ivc = utilService.getValue($wxNewer, 'ivc');
    user.pwd = getRandomPwd();
    user.pwd2 = user.pwd;
    user.useOpen = 'useOpen';
    user.regSource = 1;
    let result = utilService.validate(['telephone', 'ivc', 'verifyCode', 'openId'], user);
    if (result.status) {
        userService.newUserWxBind(user).then(data => {
            utilService.toHref('/');
        }, err => {
            utilService.setError($wxBindForm, err);
        })
    } else {
        utilService.setError($wxBindForm, result);
    }
})

// 老用户注册
$wxBindForm.find('.JS-submit2-btn').click(function () {
    user.userName = utilService.getValue($wxOlder, 'userName');
    user.pwd = utilService.getValue($wxOlder, 'pwd');
    let result = utilService.validate(['userName', 'pwd', 'openId'], user);
    if (result.status) {
        userService.olderUserWxBind(user).then(data => {
            if (data.status) {
                utilService.setError($wxBindForm, data);
            } else if (!data.acountBind) {
                utilService.setError($wxBindForm, data);
            } else {
                utilService.toHref('/');
            }
        }, err => {
            utilService.setError($wxBindForm, err);
        })
    } else {
        utilService.setError($wxBindForm, result);
    }
})

//随机密码
function getRandomPwd() {
    var zm = String.fromCharCode(65 + Math.ceil(Math.random() * 25));
    return zm + Math.ceil(Math.random() * 1000000);
}
