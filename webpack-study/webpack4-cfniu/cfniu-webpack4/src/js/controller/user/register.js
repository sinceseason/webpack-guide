require('../../../scss/user/login.scss');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const constant = require('../../util/constant');

const $registerForm = $('.JS-register-form');
const $register = $('.JS-register');
const $verifyCode = $('.JS-verify-code');

let user = {};

// 发送验证码
$verifyCode.click(function () {
    user.key = utilService.getValue($registerForm, 'key');
    user.ivc = utilService.getValue($registerForm, 'ivc');
    user.type = constant.SendCode_Register;
    let result = utilService.validate(['key', 'ivc'], user);
    if (result.status) {
        userService.sendCode(user).then(data => {
            utilService.countDown($verifyCode);
        }, err => {
            utilService.setError($registerForm, err);
        })
    } else {
        utilService.setError($registerForm, result);
    }
});

// 注册
$register.click(function () {
    user.verifyCode = utilService.getValue($registerForm, 'verifyCode');
    user.telephone = user.key = user.userName = utilService.getValue($registerForm, 'key');
    user.ivc = utilService.getValue($registerForm, 'ivc');
    user.pwd = user.pwd2 = utilService.getValue($registerForm, 'pwd');
    user.regSource = 1;
    let result = utilService.validate(['key', 'ivc', 'verifyCode', 'pwd'], user);
    if (result.status) {
        userService.regsave(user).then(data => {
            utilService.toHref('/');
        }, err => {
            utilService.setError($registerForm, err);
        })
    } else {
        utilService.setError($registerForm, result);
    }
});