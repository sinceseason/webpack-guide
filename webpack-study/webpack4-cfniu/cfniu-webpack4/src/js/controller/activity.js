require('../../scss/activity.scss');
const utilService = require('Service/utilService');
const userService = require('Service/userService');
const DialogService = require('Service/dialogService');
const activityService = require('Service/activityService');

const $activityForm = $('.JS-activity-form');
const $baseDialog = $('#JS-base-Dialog');
const $baseTipText = $baseDialog.find('.JS-base-tip-text');

let feeder, activity;

// 活动弹框
$('.JS-free-money').click(function() {
    activityService.getmatchstep().then(data => {
        feeder = data;
        activity = feeder.activity;
        if (activity.joinNum <= activity.actualNum) {
            $baseTipText.text('用户今日额度已抢光');
            new DialogService({
                id: 'JS-base-Dialog',
            }).open();
        } else {
            if (feeder.isApply === undefined) {
                utilService.toLoginUrl(window.location.href);
                return;
            }
            if (feeder.isApply) {
                // 报名弹框
                new DialogService({
                    id: 'JS-activity-join-Dialog',
                }).open();
            } else {
                $baseTipText.text('您已参与过免费体验，可以通过申请配资体验操盘乐趣');
                new DialogService({
                    id: 'JS-base-Dialog',
                }).open();
                $baseDialog.find('.JS-base-confirm-btn').click(function() {
                    utilService.toHref('/trade/0')
                })
            }
        }
    })
})

// 参加活动
$('.JS-activity-join-btn').click(function() {
    userService.getbalance().then(data => {
        let member = data.member;
        if (!member.validated) {
            new DialogService({
                href: '/user/assets'
            }).open({
                content: '请先完成实名认证信息',
                btn: '立即前往'
            })
        } else if (!member.bindCard) {
            new DialogService({
                href: '/user/addBank'
            }).open({
                content: '请先绑定银行',
                btn: '立即前往'
            })
        } else {
            let trade = {
                matchNo: 'free',
                stepNo: 'step1',
                matchId: activity.id
            }
            activityService.joinActivity(trade).then(data => {
                utilService.showTipDialog('报名成功');
            }, err => {
                utilService.showTipDialog(err);
            })
        }
    })
})