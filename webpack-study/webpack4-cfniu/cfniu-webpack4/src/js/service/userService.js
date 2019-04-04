const utilService = require('./utilService');
const HttpService = require('./httpService');
const constant = require('../util/constant');
const validator = require('../util/validator');
const userService = {
    getmybank: function() {
        return new HttpService().request({
            url: constant.API.user_getmybank
        })
    },
    getbalance: function() {
        return new HttpService().request({
            url: constant.API.user_getbalance
        })
    },
    login: function(data) {
        return new HttpService().request({
            url: constant.API.user_login,
            data: {
                username: data.username,
                password: data.password
            }
        })
    },
    loginOut: function() {
        // 删除cookie
        let loginArr = ['finance', 'token', 'uid', 'userLever', 'nick'];
        for (let index in loginArr) {
            $.removeCookie(loginArr[index], {
                path: '/',
                domain: validator.ip.test(window.location.hostname) ? window.location.hostname : 'cfniu.com'
            });
        }
        // 删除session
        window.location.href = '/';
    },
    regsave: function(data = {}) {
        return new HttpService().request({
            url: constant.API.user_regsave,
            data: {
                telephone: data.telephone,
                userName: data.userName,
                ivc: data.ivc,
                verifyCode: data.verifyCode,
                pwd: data.pwd,
                pwd2: data.pwd2,
                regSource: data.regSource
            }
        })
    },
    newUserWxBind: function(data = {}) {
        return new HttpService().request({
            url: constant.API.user_regsave,
            data: {
                userName: data.userName,
                telephone: data.telephone,
                verifyCode: data.verifyCode,
                pwd: data.pwd,
                pwd2: data.pwd,
                openId: data.openId,
                useOpen: data.useOpen,
                regSource: data.regSource
            }
        })
    },
    olderUserWxBind: function(data = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_wxlogin,
            data: {
                userName: data.userName,
                pwd: data.pwd,
                openId: data.openId
            }
        })
    },
    forgetpwd: function(data = {}) {
        return new HttpService().request({
            url: constant.API.user_modifypwd,
            data: {
                telephone: data.telephone,
                verifyCode: data.verifyCode,
                pwd: data.pwd,
                pwd2: data.pwd2
            }
        })
    },
    // 获取验证码
    sendCode: function(data = {}) {
        return new HttpService().request({
            url: constant.API.user_getverifycode,
            data: {
                key: data.key,
                ivc: data.ivc,
                type: data.type
            }
        })
    },
    // 投诉建议
    savemsg: function(data = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_savemsg,
            data: {
                msgType: data.msgType,
                phone: data.phone,
                content: data.content
            }
        })
    },
    getTrackInfo: function(data = {}) {
        return new HttpService({
            method: 'get'
        }).request({
            url: constant.API.user_gettrackinfo
        })
    },
    getCity: function(data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_getcity,
            data: data
        })
    },
    getcity: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_getcity,
            data: {
                parentId: options.parentId || 0
            }
        })
    },
    getRechargeList: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_getdelta,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    getDrawingList: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_getdraw,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || constant.PageSize
            }
        })
    },
    // 提款
    toDraw: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.trade_draw,
            data: {
                drawAmount: options.drawAmount,
                drawBankCard: options.drawBankCard,
                drawPwd: options.drawPwd
            }
        })
    },
    // 设置分行信息
    setOutletsName: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_outlets,
            data: {
                bankId: options.bankId,
                outletsName: options.outletsName
            }
        })
    },
    // 设置提款密码
    modifypwd2: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_modifypwd2,
            data: {
                telephone: options.key,
                verifyCode: options.verifyCode,
                pwd: options.pwd,
                pwd2: options.pwd2
            }
        })
    },
    // 保存银行卡
    savebank: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_savebank,
            data: {
                phone: options.phone,
                bankId: options.bankId,
                cardNo: options.cardNo,
                proName: options.proName,
                cityName: options.cityName,
                outletsName: options.outletsName
            }
        })
    },
    // 检测验证码
    checkSMSCode: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_checkSMSCode,
            data: {
                key: options.key,
                verifyCode: options.verifyCode,
                type: options.type,
                checkRemove: true
            }
        })
    },
    // 修改绑定手机
    modifyTel: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_modifytel,
            data: {
                telephone: options.key,
                verifyCode: options.verifyCode,
            }
        })
    },
    // 修改登录密码
    modifyPwd: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_modifypwd,
            data: {
                verifyCode: options.verifyCode,
                pwd: options.pwd,
                pwd2: options.pwd2
            }
        })
    },
    //修改提款密码
    modifyDrawPwd: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_modifypwd2,
            data: {
                verifyCode: options.oldPwd,
                pwd: options.pwd,
                pwd2: options.pwd2
            }
        })
    },
    //服务器更新上传文件
    uploadHeader: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_uploadHeader,
            data: {
                fn: options
            }
        })
    },
    //收益明细
    getmytrack: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_getmytrack,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || 10,
            }
        })
    },
    // 收益明细
    getMyTrackList: function(options = {}) {
        return new HttpService().request({
            url: constant.API.extension_incomes,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || 10,
            }
        })
    },
    // 用户明细
    getMyTrackUserList: function(options = {}) {
        return new HttpService().request({
            url: constant.API.extension_users,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || 10,
            }
        })
    },
    //短信推广
    getShareMsg: function(options = {}) {
        return new HttpService().request({
            url: constant.API.user_sharemsg,
            data: {
                ivc: options.ivc,
            }
        })
    },
    //资金明细
    getIoList: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_iolist,
            data: {
                days: options.days || 'all',
                type: options.type || 'all',
                ioType: options.ioType || '',
                page: options.page || 1,
                pageSize: options.pageSize || 10
            }
        })
    },
    addCoupon: function(data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_exchange,
            data: {
                couponCode: data.couponCode
            }
        })
    },
    checkCoupon: function(data) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_exchange,
            data: {
                id: data.id
            }
        })
    },
    //老接口消息中心
    getNewList: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_newsList,
            data: {
                type: options.type || '800001',
                page: options.page || 1,
                pageSize: options.pageSize || 10,
                //pageSwitch: options.pageSwitch || true,
            }
        })
    },
    //新版公告消息
    getNoticeList: function(options = {}) {
        return new HttpService().request({
            url: constant.API.user_noticeList,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || 10,
            }
        })
    },
    //系统消息
    getSystemList: function(options = {}) {
        return new HttpService().request({
            url: constant.API.user_systemList,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || 10,
            }
        })
    },
    //活动精选
    getPromotionList: function(options = {}) {
        return new HttpService().request({
            url: constant.API.user_promotionList,
            data: {
                page: options.page || 1,
                pageSize: options.pageSize || 10,
            }
        })
    },
    //是否有未读消息
    getInitData: function() {
        return new HttpService().request({
            url: constant.API.user_initData,
        })
    },
    //实名认证
    getRealName: function(options = {}) {
        return new HttpService({
            method: 'post'
        }).request({
            url: constant.API.user_modifyrealname,
            data: {
                realName: options.realName,
                idCard: options.idCard,
            }
        })
    },
    cancelDraw: function(options = {}) {
        return new HttpService().request({
            url: constant.API.trade_canceldraw,
            data: {
                id: options.id
            }
        })
    }
}
module.exports = userService;