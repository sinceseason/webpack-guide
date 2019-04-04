const utilService = require('../../service/utilService');
const DialogService = require('../../service/dialogService');
const userService = require('../../service/userService');
const constant = require('../../util/constant');

const $forgetDrawpwdDialog = $('#JS-forget-draw-pwd-Dialog');

let forgetDrawPwd = {
    telephone: utilService.getValue($forgetDrawpwdDialog, 'telephone'),
    key: utilService.getValue($forgetDrawpwdDialog, 'telephone'),
};

// 发送验证码
$forgetDrawpwdDialog.find('.JS-countDown').click(function() {
    forgetDrawPwd.ivc = utilService.getValue($forgetDrawpwdDialog, 'ivc');
    forgetDrawPwd.type = constant.SendCode_ForgetTradePwd;
    let result = utilService.validate(['key', 'ivc'], forgetDrawPwd);
    if (result.status) {
        userService.sendCode(forgetDrawPwd).then(data => {
            // 倒计时
            utilService.countDown($forgetDrawpwdDialog.find('.JS-countDown'));
        }, err => {
            utilService.setError($forgetDrawpwdDialog, err);
        })
    } else {
        utilService.setError($forgetDrawpwdDialog, result);
    }
})

// 设置提现密码
$('.JS-forget-draw-pwd-btn').click(function() {
    forgetDrawPwd.ivc = utilService.getValue($forgetDrawpwdDialog, 'ivc');
    forgetDrawPwd.verifyCode = utilService.getValue($forgetDrawpwdDialog, 'verifyCode');
    forgetDrawPwd.pwd = utilService.getValue($forgetDrawpwdDialog, 'pwd');
    forgetDrawPwd.pwd2 = forgetDrawPwd.pwd;
    let result = utilService.validate(['telephone', 'ivc', 'verifyCode', 'pwd'], forgetDrawPwd);
    if (result.status) {
        userService.modifypwd2(forgetDrawPwd).then(data => {
            new DialogService({
                href: '/user/assets'
            }).open({
                content: '设置成功'
            });
        }, err => {
            utilService.setError($forgetDrawpwdDialog, err);
        })
    } else {
        utilService.setError($forgetDrawpwdDialog, result);
    }
})