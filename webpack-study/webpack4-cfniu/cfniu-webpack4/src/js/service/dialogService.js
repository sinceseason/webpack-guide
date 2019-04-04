require('../libs/easyDialog');

// options.id
function DialogService(options = {}) {
    this.id = options.id;
    this.href = options.href;
    this.callback = options.callback;
    this.reload = options.reload;
    this.overlayClick = function() {
        easyDialog.close();
    }
    this.utilService = require('./utilService');
}

/**
 * 显示弹框2种方式
 * 自定义模板： options.id：模板id
 * 默认模板（tip提示框） options为如下参数
 * header 标题
 * content  内容
 * btn  按钮
 */
DialogService.prototype.open = function(options = {}) {
    // 自定义模板
    let id = this.id || options.id;
    if (id) {
        if ($('#' + id) && $('#' + id).length > 0) {
            // 清除错误信息
            this.utilService.clearError($('#' + id));
            // 刷新图片验证码
            let $verify = $('#' + id).find("img[src^='/verifyCode.api']");
            if ($verify.length > 0)
                $verify.trigger('click');
            // html模板
            easyDialog.open({
                container: id,
                overlayClick: this.overlayClick,
                href: this.href,
                callback: this.callback,
                reload: this.reload
            })
        } else {
            console.warn('easyDialog error:$id is not exist');
        }
    } else {
        // 默认tip弹框
        options.header = options.header || '提示';
        // 后台错误，form错误，自定义文案
        options.content = options.resultMsg || options.msg || options.content || '提示内容';
        options.btn = options.btn || '确 定';
        easyDialog.open({
            container: options,
            overlayClick: this.overlayClick,
            href: this.href,
            callback: this.callback,
            reload: this.reload
        })
    }
}
DialogService.prototype.close = function() {
    easyDialog.close();
}

// module.exports = DialogService;
export default DialogService;