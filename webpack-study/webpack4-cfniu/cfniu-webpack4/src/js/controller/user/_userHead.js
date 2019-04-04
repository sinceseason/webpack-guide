// 用户中心 头部逻辑
const utilService = require('../../service/utilService');
const userService = require('../../service/userService');
const DialogService = require('../../service/dialogService');

// 头像上传
$('#fileUpload').fileupload({
    url: "/upload.api", //请求地址
    dataType: 'json',
    autoUpload: true,
    change: function(e, data) {
        $.each(data.files, function(index, file) {
            if (file.size > 20480000) {
                utilService.showTipDialog('请上传不大于20M的*.jpg;*.png;*.jpeg;*.gif图片');
            }
        });
    },
    done: function(e, data) {
        var resObj = data.result;
        if (resObj.status) {
            var filePath = resObj.filePath;
            if (/\.jpg$|\.png$|\.jpeg$|\.gif$/g.test(filePath.toLowerCase())) {
                uploadFileName(filePath);
            } else {
                utilService.showTipDialog('请上传不大于20M的*.jpg;*.png;*.jpeg;*.gif图片');
            }
        } else {
            utilService.showTipDialog(e.message);
        }
    },
    fail: function(e, data) {
        utilService.showTipDialog(e.message);
    },
});

// 更新上传文件名
function uploadFileName(path) {
    let href = window.location.pathname;
    userService.uploadHeader(path).then(data => {
        if (data.status == 'true') {
            new DialogService({
                href: href,
            }).open({
                content: '上传成功',
            })
        }
    }, err => {
        utilService.showTipDialog(err.message);
    });
};