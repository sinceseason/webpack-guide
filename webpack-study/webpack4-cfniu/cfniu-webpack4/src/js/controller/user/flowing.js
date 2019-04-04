require('../../../scss/user/flowing.scss');
require('./_userHead');
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const flowingListTemplate = require('../../../templates/user/flowingList.html');

// 获取列表参数
let iolist = {
    days: 'all',
    type: 'all',
    page: 1,
    pageSize: 10,
}

getFlowingList(iolist);

// 获取记录
function getFlowingList(params) {
    userService.getIoList(params).then(data => {
        utilService.createHtml($('.JuicerAnchor-flowingList'), flowingListTemplate, {
            list: data.list
        });
        utilService.createPage($('.JS-page-flowing-list'), {
            totalPages: data.totalPage,
            startPage: params.page,
            cb: function(page) {
                iolist.page = page;
                getFlowingList(iolist)
            }
        });
    }, err => {
        utilService.showTipDialog(err);
    })
}

// 选择时间
$('.JS-tab-flowTime').click(function() {
    let $this = $(this);
    $('.JS-tab-flowTime').addClass('btn-gray-border');
    $(this).removeClass('btn-gray-border').addClass('btn-red');
    iolist.page = 1
    iolist.days = $this.data('day');
    getFlowingList(iolist)
})

// 选择类型
$('.JS-tab-flowType').click(function() {
    let $this = $(this);
    $('.JS-tab-flowType').addClass('btn-gray-border');
    $(this).removeClass('btn-gray-border').addClass('btn-red');
    iolist.page = 1;
    iolist.type = $this.data('type');
    iolist.ioType = $this.data('iotype') || '';
    getFlowingList(iolist)
})