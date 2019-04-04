require('../../../scss/agent/forget.scss');
const DialogService = require('../../service/dialogService');
const agentService = require('../../service/agentService');
const utilService = require('../../service/utilService');
const constant = require('../../util/constant');

let $forgetForm = $('.JS-forgetForm');

let forget = {};

// 发送短信
utilService.bindEvent($forgetForm.find('.JS-countDown'), () => {
    forget.key = utilService.getValue($forgetForm, 'key');
    forget.ivc = utilService.getValue($forgetForm, 'ivc');
    forget.type = constant.SendCode_ForgetPwd;
    let result = utilService.validate(['key', 'ivc'], forget);
    if (result.status) {
        agentService.getverifycode({
            key: forget.key,
            ivc: forget.ivc,
            type: forget.type
        }).then((data) => {
            utilService.countDown($forgetForm.find('.JS-countDown'), constant.CountDown);
        }, (err) => {
            utilService.showTipDialog(err);
        });
    } else {
        utilService.setError($forgetForm, result);
    }
});
utilService.bindEvent($forgetForm.find('.JS-confirm'), () => {
    forget.telephone = utilService.getValue($forgetForm, 'key');
    forget.verifyCode = utilService.getValue($forgetForm, 'verifyCode');
    forget.ivc = utilService.getValue($forgetForm, 'ivc');
    forget.pwd = utilService.getValue($forgetForm, 'pwd');
    forget.pwd2 = utilService.getValue($forgetForm, 'pwd2');
    let result = utilService.validate(['telephone', 'ivc', 'verifyCode', 'pwd', 'pwd2'], forget);
    if (result.status) {
        if (forget.pwd !== forget.pwd2) {
            utilService.setError($forgetForm, {
                msg: constant.ERROR.pwd2
            });
        } else {
            agentService.modifyPwd({
                telephone: forget.telephone,
                verifyCode: forget.verifyCode,
                ivc: forget.ivc,
                pwd: forget.pwd,
                pwd1: forget.pwd2
            }).then((data) => {
                new DialogService({
                    href: '/agent'
                }).open({
                    content: constant.SUCCESS.ForgetPwd
                });
            }, (err) => {
                utilService.showTipDialog(err);
            });
        }
    } else {
        utilService.setError($forgetForm, result);
    }
});