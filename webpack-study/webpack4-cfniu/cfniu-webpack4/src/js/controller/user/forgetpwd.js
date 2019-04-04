require('../../../scss/user/forgetpwd.scss');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const constant = require('../../util/constant');

const $forgetPwdForm = $('.JS-forget-pwd-form');

$forgetPwdForm.find("img[src^='/verifyCode.api']").trigger('click');

let user = {};

// 发送短信
$forgetPwdForm.find('.JS-countDown').click(function() {
    user.key = utilService.getValue($forgetPwdForm, 'key');
    user.ivc = utilService.getValue($forgetPwdForm, 'ivc');
    user.type = constant.SendCode_ForgetPwd;
    let result = utilService.validate(['key', 'ivc'], user);
    if (result.status) {
        userService.sendCode(user).then(data => {
            // 倒计时
            utilService.countDown($forgetPwdForm.find('.JS-countDown'));
        }, err => {
            utilService.setError($forgetPwdForm, err);
        })
    } else {
        utilService.setError($forgetPwdForm, result);
    }
})

// 注册
$forgetPwdForm.find('.JS-submit').click(function() {
    user.telephone = utilService.getValue($forgetPwdForm, 'key');
    user.verifyCode = utilService.getValue($forgetPwdForm, 'verifyCode');
    user.ivc = utilService.getValue($forgetPwdForm, 'ivc');
    user.pwd = utilService.getValue($forgetPwdForm, 'pwd');
    user.pwd2 = utilService.getValue($forgetPwdForm, 'pwd2');
    let result = utilService.validate(['telephone', 'verifyCode', 'pwd', 'pwd2'], user);
    if (result.status) {
        if (user.pwd !== user.pwd2) {
            utilService.setError($forgetPwdForm, {
                msg: constant.ERROR.pwd2
            });
        } else {
            userService.forgetpwd(user).then(data => {
                utilService.toHref('/');
            }, err => {
                utilService.setError($forgetPwdForm, err);
            })
        }

    } else {
        utilService.setError($forgetPwdForm, result);
    }
})