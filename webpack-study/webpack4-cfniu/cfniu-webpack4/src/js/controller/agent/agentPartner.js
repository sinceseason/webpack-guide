require('../../../scss/agent/partner.scss');
require('../../../scss/components/libs/datetimepicker.scss');
const DialogService = require('../../service/dialogService');
const agentService = require('../../service/agentService');
const utilService = require('../../service/utilService');
const constant = require('../../util/constant');
const agentRegListTemplate = require('../../../templates/agent/agentRegList.html');
const agentTradeListTemplate = require('../../../templates/agent/agentTradeList.html');

utilService.chooseTab(0);
showRegisterList(1);
let type = 0; //注册用户
function showRegisterList(page) {
    agentService.getRegList({
        page: page,
        et: $('.reg-time2').val(),
        st: $('.reg-time1').val()
    }).then(function (data) {
        utilService.createHtml($('.JuicerAnchor-registerList'), agentRegListTemplate, {
            list: data.result.resultList
        });
        utilService.createPage($('.JS-registerPage'), {
            totalPages: data.result.totalPage,
            startPage: 1,
            cb: function (page) {
                showRegisterList(page);
            }
        })
    })
}

function showTradeList(page) {
    agentService.getTradeList({
        page: page,
        et: $('.trade-time2').val(),
        st: $('.trade-time1').val()
    }).then(function (data) {
        utilService.createHtml($('.JuicerAnchor-tradeList'), agentTradeListTemplate, {
            list: data.result.resultList
        });
        utilService.createPage($('.JS-tradePage'), {
            totalPages: data.result.totalPage,
            startPage: 1,
            cb: function (page) {
                showRegisterList(page);
            }
        })
    })
}

//复制
$('.JS-copybtn').on('click', function () {
    $('.JS-copy').select()
    if (document.execCommand("Copy")) {
        utilService.showTipDialog('复制成功')
    }
})

$('.JS-tab').click(function () {
    type = $(this).attr('data-nav');
    utilService.chooseTab(type);
    if (type == 0) {
        showRegisterList(1);
    } else {
        showTradeList(1);
    }
})
$('.JS-queryByDate').click(function () {
    if (type == 0) {
        showRegisterList(1);
    } else {
        showTradeList(1);
    }
})
//时间控件
$.datetimepicker.setLocale('ch')
$('.JS-date').datetimepicker({
    timepicker: false,
    format: 'Y-m-d'
});

//复制
$('.JS-copybtn').on('click', function () {
    $('.JS-copy').select()
    if (document.execCommand("Copy")) {
        utilService.showTipDialog('复制成功')
    }
})
// 修改域名
$('.JS-modifyDomain').click(function () {
    new DialogService({
        id: 'JS-modifyDomainDialog'
    }).open();
})

$('#JS-modifyDomainDialog .JS-confirm').click(function () {
    let domain = utilService.getValue($('#JS-modifyDomainDialog'), 'domain');
    if (!domain) {
        utilService.setError($('#JS-modifyDomainDialog'));
    } else {
        agentService.modifyDomain({
            domain: domain
        }).then(function (data) {
            location.reload()
        }, function (err) {
            utilService.setError($('#JS-modifyDomainDialog'), err);
        })
    }
})

//bShare分享  
var iBShare = {
    //初始化  
    init: function () {
        var $shareBox = $(".bshare-custom");
        //加载分享工具  
        var tools = '<a title="分享到新浪微博" class="bshare-sinaminiblog"></a>';
        tools += '<a title="分享到微信" class="bshare-weixin" href="javascript:void(0);"></a>';
        tools += '<a title="分享到QQ好友" class="bshare-qqim" href="javascript:void(0);"></a>';
        tools += '<a title="分享到QQ空间" class="bshare-qzone"></a>';
        $shareBox.append(tools);
        //绑定分享事件  
        $shareBox.children("a").click(function () {
            var parents = $(this).parent();
            bShare.addEntry({
                title: parents.attr("title"),
                url: parents.attr("url"),
                summary: parents.attr("summary")
            });
        });
    }
};
iBShare.init();