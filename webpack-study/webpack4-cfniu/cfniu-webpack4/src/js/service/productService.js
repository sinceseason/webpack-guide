const utilService = require('./utilService');
const HttpService = require('./httpService');
const constant = require('../util/constant');
const productService = {
    /**
     * 产品推广列表
     * type 0:PC,1:IOS,2:ANDROID,3:H5
     */
    getProductList: function (options = {}) {
        options.type = options.type || 0;
        return new HttpService().request({
            url: constant.API.product_advert,
            data: options
        })
    }
}

module.exports = productService;