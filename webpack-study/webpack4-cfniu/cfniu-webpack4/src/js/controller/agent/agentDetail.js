require('../../../scss/agent/detail.scss');

const agentService = require('../../service/agentService');
const utilService = require('../../service/utilService');
const agentDetailTemplate = require('../../../templates/agent/agentDetail.html');

let id = utilService.getUrlParams().id;

detail(1);

function detail(page) {
    agentService.detail({
        id: id,
        page: page
    }).then(function (data) {
        utilService.createHtml($('.JuicerAnchor-detail'), agentDetailTemplate, {
            userName: data.userName,
            rpt: data.rpt,
            list: data.list
        })
        utilService.createHtml($('.JS-detail'), agentDetailTemplate, data);
        utilService.createPage($('.JS-page'), {
            totalPages: data.pageCount,
            startPage: 1,
            cb: function (page) {
                detail(page);
            }
        });
    })
}