require('../../../scss/agent/agentIndex.scss');
const DialogService = require('../../service/dialogService');
const agentService = require('../../service/agentService');
const utilService = require('../../service/utilService');
const constant = require('../../util/constant');
$('.JS-register').click(function () {
    new DialogService({
        id: 'JS-agentRegisterDialog'
    }).open();
})

$('.JS-login').click(function () {
    new DialogService({
        id: 'JS-agentLoginDialog'
    }).open();
})
let agent = {
    login: {},
    orgnz: {},
    career: {},
    user: {}
};

chooseTab(0);
$('.JS-tabs li').click(function () {
    chooseTab($(this).attr('data-nav'));
})

function chooseTab(tabIndex) {
    utilService.addTabSelected({
        tabDom: 'JS-tab',
        index: tabIndex
    });
    utilService.showContent({
        contentDom: 'JS-content',
        index: tabIndex
    });
}
//上传图片
$('#upload-form').fileupload({
    autoUpload: true, //是否自动上传  
    url: "/upload.api", //上传地址  
    dataType: 'json',
    done: function (e, data) { //设置文件上传完毕事件的回调函数  
        var responseObj = data.result;
        if (responseObj.status) {
            var filePath = responseObj.filePath;
            $('.license-upload-name').val(filePath);
            // uploadHeader(filePath);
        } else {}
    },
    error: function () {}
})
// 登录
$('#JS-agentLoginDialog .JS-confirm').click(function () {
    let $dom = $('#JS-agentLoginDialog')
    agent.login.partnerName = utilService.getValue($dom, 'partnerName');
    agent.login.pwd = utilService.getValue($dom, 'pwd');

    let result = utilService.validate(['partnerName', 'pwd'], agent.login)
    if (!result.status) {
        utilService.setError($('#JS-agentLoginDialog'), result);
    } else {
        agentService.agentLogin(agent.login).then(function (data) {
            location.href = '/agent/myPartner'
        }, function (err) {
            utilService.setError($('#JS-agentLoginDialog'), err);
        })
    }
})

//机构注册
$('#JS-agentRegisterDialog .JS-confirm').on('click', function () {
    let $agentreg = $('.JS-regAgent.JS-content[data-content="0"]');
    agent.orgnz.partnerName = utilService.getValue($agentreg, 'partnerName');
    agent.orgnz.pwd = utilService.getValue($agentreg, 'pwd');
    agent.orgnz.pwd2 = utilService.getValue($agentreg, 'pwd2');
    agent.orgnz.corporationName = utilService.getValue($agentreg, 'corporationName');
    agent.orgnz.address = utilService.getValue($agentreg, 'address');
    agent.orgnz.corporationCode = utilService.getValue($agentreg, 'corporationCode');
    agent.orgnz.companyContacts = utilService.getValue($agentreg, 'companyContacts');
    agent.orgnz.telephone = utilService.getValue($agentreg, 'telephone');
    agent.orgnz.verifyCode = utilService.getValue($agentreg, 'verifyCode');
    agent.orgnz.picFile = utilService.getValue($agentreg, 'bissnessLicensePath');
    agent.orgnz.type = 1

    let result = utilService.validate(['partnerName', 'pwd', 'pwd2', 'corporationName',
        'address', 'corporationCode',
        'companyContacts', 'telephone', 'picFile',
        'verifyCode'
    ], agent.orgnz);

    if (!result.status) {
        utilService.setError($('#JS-agentRegisterDialog'), result);
    } else if (agent.orgnz.pwd !== agent.orgnz.pwd2) {
        utilService.setError($('#JS-agentRegisterDialog'), constant.pwd2)
    } else {
        agentService.organization(agent.orgnz).then(function (data) {
            utilService.showTipDialog('您的申请已提交，请等待我们的审核。我们将在2-5个工作日内给您反馈，谢谢！');
        }, function (err) {
            utilService.setError($('#JS-agentRegisterDialog'), err);
        })
    }
})

//经纪人注册
$('#JS-agentRegisterDialog .JS-confirm').on('click', function () {
    let $agentreg = $('.JS-regAgent.JS-content[data-content="1"]');
    agent.career.partnerName = utilService.getValue($agentreg, 'partnerName');
    agent.career.pwd = utilService.getValue($agentreg, 'pwd');
    agent.career.pwd2 = utilService.getValue($agentreg, 'pwd2');
    agent.career.corporationName = utilService.getValue($agentreg, 'corporationName');
    agent.career.corporationCode1 = utilService.getValue($agentreg, 'corporationCode1');
    agent.career.companyContacts = utilService.getValue($agentreg, 'companyContacts');
    agent.career.telephone = utilService.getValue($agentreg, 'telephone');
    agent.career.verifyCode = utilService.getValue($agentreg, 'verifyCode');
    agent.career.type = 2

    let result = utilService.validate(['partnerName', 'pwd', 'pwd2', 'corporationCode1', 'corporationName',
        'companyContacts', 'telephone', 'verifyCode'
    ], agent.career);

    if (!result.status) {
        utilService.setError($('#JS-agentRegisterDialog'), result);
    } else if (agent.career.pwd !== agent.career.pwd2) {
        utilService.setError($('#JS-agentRegisterDialog'), constant.pwd2)
    } else {
        agentService.organization(agent.career).then(function (data) {
            utilService.showTipDialog('您的申请已提交，请等待我们的审核。我们将在2-5个工作日内给您反馈，谢谢！');
        }, function (err) {
            utilService.setError($('#JS-agentRegisterDialog'), err);
        })
    }
})

//个人注册
$('#JS-agentRegisterDialog .JS-confirm').on('click', function () {
    let $agentreg = $('.JS-regAgent.JS-content[data-content="2"]');
    agent.user.partnerName = utilService.getValue($agentreg, 'partnerName');
    agent.user.pwd = utilService.getValue($agentreg, 'pwd');
    agent.user.pwd2 = utilService.getValue($agentreg, 'pwd2');
    agent.user.companyContacts = utilService.getValue($agentreg, 'companyContacts');
    agent.user.idCard = utilService.getValue($agentreg, 'idCard');
    agent.user.telephone = utilService.getValue($agentreg, 'telephone');
    agent.user.remark = $('#remark').val();
    agent.user.verifyCode = utilService.getValue($agentreg, 'verifyCode');
    agent.user.type = 3;
    let result = utilService.validate(['partnerName', 'pwd', 'pwd2', 'companyContacts', 'telephone',
        'idCard', 'verifyCode', 'remark'
    ], agent.user);

    if (!result.status) {
        utilService.setError($('#JS-agentRegisterDialog'), result);
    } else if (agent.user.pwd !== agent.user.pwd2) {
        utilService.setError($('#JS-agentRegisterDialog'), constant.pwd2)
    } else {
        agentService.organization(agent.user).then(function (data) {
            utilService.showTipDialog('您的申请已提交，请等待我们的审核。我们将在2-5个工作日内给您反馈，谢谢！');
        }, function (err) {
            utilService.setError($('#JS-agentRegisterDialog'), err);
        })
    }
})