const $ = require('jquery');

function Http(options) {
    this.options = {
        httpSuffix: options && options.httpSuffix ? options.httpSuffix : '.api',
        onlyStatus: options && options.httpSuffix ? options.httpSuffix : '[]',
        dataType: options && options.dataType ? options.dataType : 'json',
        method: options && options.method ? options.method : 'get',
        contentType: options && options.contentType ? options.contentType : 'application/x-www-form-urlencoded',
        timeout: 6000
    };
}

/**
 * [request http请求]
 * @Author   ShiXingHao
 * @DateTime 2017-06-14
 * @param    {[type]}   type     [方法]
 * @param    {[type]}   url      [地址]
 * @param    {[type]}   data     [请求数据]
 * @param    {[type]}   dom      [目标dom]
 * @param    {[type]}   dataType [请求类型]
 * @return   {[type]}            [promise]
 */
Http.prototype.request = function (obj) {
    var deferred = $.Deferred();
    if (obj.dom) {
        obj.dom.attr({
            'disabled': true
        });
    }
    if (obj.type && obj.type == 'liang') {
        obj.url = '/dm' + obj.url;
    } else {
        obj.url = obj.url + this.options.httpSuffix;
    }
    $.ajax({
        type: this.options.method,
        contentType: this.options.contentType,
        url: obj.url,
        traditional: true,
        data: obj.data || {},
        dataType: this.options.dataType,
        timeout: this.options.timeout
    }).then(function (data) {
        if (obj.url.split('.')[1] === 'cms') {
            if (data.respCode) {
                deferred.resolve({
                    jDtos: []
                })
            } else {
                deferred.resolve(data)
            }
        } else {
            if (data.status == 'true' || data.success || data.responseCode == 200) {
                if (obj.dom) {
                    obj.dom.removeAttr('disabled');
                }
                deferred.resolve(data);
            } else {
                if (obj.dom) {
                    obj.dom.removeAttr('disabled');
                }
                deferred.reject(data);
            }
        }
    }).fail(function (err) {
        if (obj.url.split('.')[1] === 'cms') {
            deferred.resolve({
                jDtos: []
            });
        } else {
            if (!err.resultMsg) {
                err.resultMsg = err.statusText;
            }
            if (obj.dom) {
                obj.dom.removeAttr('disabled');
            }
            deferred.reject(err);
        }
    });
    return deferred;
};

// exports = module.exports = Http;
export default Http;