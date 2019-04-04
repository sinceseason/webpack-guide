const HttpService = require('./httpService');
const constant = require('../util/constant');
const validator = require('../util/validator');
const agentService = {
    agentLogin: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_plogin,
            data: {
                partnerName: data.partnerName,
                partnerPwd: data.pwd
            }
        })
    },
    loginOut: function () {
        // 删除cookie
        let loginArr = ['pi', 'pn', 'pv', 'pif', 'pl'];
        for (let index in loginArr) {
            $.removeCookie(loginArr[index], {
                path: '/',
                domain: validator.ip.test(window.location.hostname) ? window.location.hostname : 'cfniu.com'
            });
        }
        // 删除session
        window.location.href = '/agent';
    },
    organization: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_reg,
            data: {
                partnerName: data.partnerName,
                partnerPwd: data.pwd,
                partnerPwd2: data.pwd2,
                corporationName: data.corporationName,
                address: data.address,
                corporationCode: data.corporationCode,
                companyContacts: data.companyContacts,
                telephone: data.telephone,
                bissnessLicensePath: data.picFile,
                verifyCode: data.verifyCode,
                partnerType: data.type
            }
        })
    },
    career: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_reg,
            data: {
                partnerName: data.partnerName,
                partnerPwd: data.pwd,
                partnerPwd2: data.pwd2,
                certificateCode: data.corporationCode1,
                corporationName: data.corporationName,
                companyContacts: data.companyContacts,
                telephone: data.telephone,
                verifyCode: data.verifyCode,
                partnerType: data.type
            }
        })
    },
    user: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_reg,
            data: {
                partnerName: data.partnerName,
                partnerPwd: data.pwd,
                partnerPwd2: data.pwd2,
                idCard: data.idCard,
                companyContacts: data.companyContacts,
                telephone: data.telephone,
                verifyCode: data.verifyCode,
                remark: data.remark,
                partnerType: data.type
            }
        })
    },
    getRegList: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_getRegList,
            data: data
        })
    },
    getTradeList: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_getTradeList,
            data: data
        })
    },
    modifyDomain: function (data) {
        return new HttpService().request({
            url: constant.API.agent_domain,
            data: {
                domain: data.domain
            }
        })
    },
    detail: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_getdetial + data.id,
            data: {
                page: data.page
            }
        })
    },
    getParnter: function (data) {
        return new HttpService().request({
            url: constant.API.agent_getmypartner
        })
    },
    getBank: function (data) {
        return new HttpService().request({
            url: constant.API.agent_getbank
        })
    },
    getDrawCode: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_getdrawcode,
            data: data
        })
    },
    getDraw: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_getdraw,
            data: data
        })
    },
    saveBank: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_savebank,
            data: {
                cardNo: data.cardNo,
                bankId: data.bankId,
                bankName: data.bankName,
                outletsName: data.outletsName,
                proName: data.proName,
                cityName: data.cityName
            }
        })
    },
    removeBank: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_removebank,
            data: data
        })
    },
    getverifycode: function (data) {
        return new HttpService().request({
            url: constant.API.agent_getverifycode,
            data: {
                key: data.key,
                ivc: data.ivc,
                type: data.type
            }
        })
    },
    modifyPwd: function (data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.agent_modifyPwd,
            data: {
                telephone: data.telephone,
                verifyCode: data.verifyCode,
                ivc: data.ivc,
                pwd: data.pwd,
                pwd1: data.pwd1
            }
        })
    },
}

module.exports = agentService;