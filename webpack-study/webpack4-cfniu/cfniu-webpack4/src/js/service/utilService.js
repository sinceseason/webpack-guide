/*
 * @Author: shixinghao 
 * @Date: 2018-02-21 15:38:49 
 * @Last Modified by: shixinghao
 * @Last Modified time: 2018-08-02 10:41:48
 */
const validator = require('../util/validator');
const constant = require('../util/constant');
const DialogService = require('./dialogService');
const juicer = require('juicer');
// const nunjucks = require('nunjucks')
const utilService = {
    /**
     * 创建/渲染模板
     * @param {*} $anchor 模板渲染锚点 
     * @param {*} $template 模板
     * @param {*} data 渲染数据
     */
    createHtml: function($anchor, $template, data, append) {
        let self = this;
        // 四舍五入
        juicer.register('round', function(str, digit) {
            return self.round(str, digit);
        });
        // 金额显示，人民币
        juicer.register('money', function(value, format) {
            return self.money(value, format)
        });
        // 百分比
        juicer.register('percent', function(value, format) {
            return self.percent(value, format)
        });
        // 2017-6-18 22:24:53 --> YYYY.MM.DD
        juicer.register('timeFormat', function(value, format) {
            return self.timeFormat(value, format || 'YYYY-MM-DD')
        });
        // 1497796154759 -->2017-6-18 22:24:53
        juicer.register('timeUnixFormat', function(value, format) {
            return self.timeUnixFormat(value, format || 'YYYY-MM-DD HH:mm:ss')
        });
        // 卡号脱敏
        juicer.register('isCardNo', function(value, format) {
            return self.convertCardNo(value, format)
        });
        // 交易日期判断
        juicer.register('cycleType', function(cycleType) {
            return !cycleType ? constant.cycleTradeDay : cycleType == 2 ? constant.cycleTradeWeek : constant.cycleTradeMonth;
        });
        juicer.register('integer', function(number) {
            if (number) {
                return number;
            } else {
                return '0';
            }
        });
        juicer.register('ceil', function(num) {
            if (isNaN(num)) {
                return 0
            } else {
                return Math.ceil(num)
            }
        });
        // 充值类型
        juicer.register('rechargeDeltaTypeIdCn', function(value) {
                return ['快捷支付', '网银支付', '支付宝', '银行转账', 'app支付', '微信支付'][value] || '其他';
            })
            // 充值状态
        juicer.register('rechargeStatusCn', function(value) {
            return ['处理中', '已完成', '已驳回'][value] || '其他';
        });
        juicer.register('drawingStatusCn', function(value) {
            return ['处理中', '已完成', '已驳回', '待放款', '放款中', '已撤回'][value] || '其他';
        });
        // 字数限制
        juicer.register('wordLimit', function(value) {
            if (value.length > 20) {
                return value.slice(0, 15) + '...'
            } else {
                return value
            }
        });
        if ($anchor && $template) {
            if (!append) {
                $anchor.empty();
            }
            $anchor.append(juicer($template, data));
            // $anchor.append(this.getNunjucks().renderString($template, data));
        }
    },
    /**
     * 分页
     * $dom 分页dom
     * options.totalPages,  总页数
     * options.startPage,   起始页数
     * options.cb,  点击页数后回调
     */
    createPage: function($dom, options) {
        if (options && options.totalPages && options.startPage) {
            $dom.twbsPagination({
                totalPages: options.totalPages || 1,
                startPage: options.startPage || 1,
                visiblePages: 5,
                prev: '上一页',
                next: '下一页',
                first: false,
                last: false,
                initiateStartPageClick: false,
                onPageClick: function(event, page) {
                    options.cb(page);
                }
            });
        }
    },
    // tab切换，初始化分页参数
    initPage: function($dom) {
        if ($dom && $dom.data('twbs-pagination')) {
            $dom.empty();
            $dom.twbsPagination('destroy');
        }
    },
    // 配置nunjucks
    getNunjucks: function() {
        return nunjucks.configure({
            autoescape: true
        });
    },
    // 构建promise，依赖jquery
    getPromise: function(data) {
        var deferred = $.Deferred();
        deferred.resolve(data);
        return deferred;
    },
    // 浏览器queryparams ==> object
    getUrlParams: function() {
        //去除?符号
        var url = window.location.search;
        var params = url.length > 0 ? url.substr(1) : "";
        var args = {};
        var pArr = params.length ? params.split('&') : [];
        for (var i = 0; i < pArr.length; i++) {
            var item = pArr[i].split("=");
            var name = decodeURIComponent(item[0]);
            var value = decodeURIComponent(item[1]);
            if (name.length > 0) {
                args[name] = value;
            }
        }
        return args;
    },
    /**
     * 滚动显示
     * @param {*} dom 滚动dom上挂的节点 
     * @param {*} time 滚动速度(间隔时间)
     * @param {*} time2 停顿时间
     * @param {*} waitDistance 滚动停顿
     * @param {*} moveDistance 移动距离 
     * @param {*} startScroll 是否滚动 
     */
    scrollView: function(options) {
        options.time = options.time || 0;
        options.time2 = options.time2 || 1000;
        options.waitDistance = options.waitDistance || 17;
        options.moveDistance = options.moveDistance || 0;
        options.startScroll = options.startScroll || false;
        const self = this;
        var scrollTime = window.setTimeout(function() {
            options.moveDistance++;
            var scrollTotal = options.dom[0].scrollHeight;
            // console.log('total:' + scrollTotal + ',move:' + options.moveDistance);
            // 首行不滚动
            if (!options.startScroll && options.moveDistance < options.waitDistance) {
                self.scrollView(options);
                // 每行结束
            } else if (/^\d+$/.test(options.moveDistance / options.waitDistance)) {
                window.setTimeout(function() {
                    // 首行开始滚动
                    if (!options.startScroll && options.moveDistance / options.waitDistance == 1) {
                        options.moveDistance = 0;
                        options.startScroll = true;
                        // 最后行开始，重置滚动
                    } else if (options.moveDistance + 1 >= scrollTotal - options.waitDistance) {
                        options.moveDistance = 0;
                        options.startScroll = false;
                        options.dom.scrollTop(options.moveDistance);
                        // options.dom.animate({
                        //   scrollTop: options.moveDistance
                        // }, 500);
                    }
                    self.scrollView(options);
                }, options.time2);
            } else {
                options.dom.scrollTop(options.moveDistance);
                self.scrollView(options);
            }
        }, options.time);
    },
    /**
     * 表单验证
     * ruleArr 参数列表
     * obj 提交参数
     */
    validate: function(ruleArr, obj) {
        for (var i = 0; i < ruleArr.length; i++) {
            var key = ruleArr[i];
            var value = obj[key];
            if (value && value !== '') {
                if (validator[key] && !validator[key].test(value)) {
                    return {
                        status: false,
                        msg: constant.ERROR[key],
                        name: key
                    };
                }
            } else {
                const errorMsg = constant.ERROR[key];
                return {
                    status: false,
                    msg: !errorMsg ? constant.ERROR['emptyDefault'] : errorMsg,
                    name: key
                };
            }
        }
        return {
            status: true
        };
    },
    /** 显示错误信息
     *  result:{
    		status: false,
    		msg: !errorMsg ? constant.ERROR['emptyDefault'] : errorMsg,
    		name: key
        }
        <div class="reg-cont-box JS-registerForm">
                <div class="reg-title">立即注册</div>
                <div class="reg-content">
                    <ul>
                        <li class="input-reg">
                            <i class="icon-yonghu1"></i>
                            <input type="text" name='key' placeholder="请输入11位手机号码" />
                        </li>
                        <li class="input-reg">
                            <img src='/verifyCode.api' onclick="this.src='/verifyCode.api?' + new Date().getTime();" class="right-yzm" />
                            <i class="icon-yanzhengmazhuanhuan"></i>
                            <input type="text" name='ivc' placeholder="图形验证码" />
                        </li>
     */
    setError: function($dom, result) {
        var self = this;
        self.clearError($dom);
        $dom.find('.JS-errorWrap').show().find('.JS-errorMsg').text(result.msg || result.resultMsg || constant.ERROR['emptyDefault']);
        // todo 错误提示force
        $dom.find('input, textarea').bind('focus', function(event) {
            self.clearError($dom);
        }).blur(function() {
            $(this).parent().removeClass('focus');
        });
        let type = self.queryType($dom, result.name) || 'input';
        $dom.find(type + '[name="' + result.name + '"]').parent('li').addClass('focus-err');
        // $dom.find('input[name="' + result.name + '"]').parent('li').addClass('focus-err');
    },
    queryType: function($dom, name) {
        let types = ['input', 'select', 'textarea'];
        let result = '';
        types.map(item => {
            if ($dom.find(item + '[name="' + name + '"]').length > 0) {
                result = item;
                return;
            }
        })
        return result;
    },
    // 清除错误信息
    clearError: function($dom) {
        $dom.find('.focus-err').removeClass('focus-err');
        $dom.find('.JS-errorWrap').hide().find('.JS-errorMsg').text('');
    },
    /**
     * 表单数据获取
     * 获取$dom下子元素（标签input textarea selecte） 属性为name="name"的value
     * $dom 表单dom
     * name 表单元素属性name='telephone'
     */
    getValue: function($dom, name) {
        if ($dom.find('input[name="' + name + '"]').length > 0) {
            return $dom.find('input[name="' + name + '"]').val();
        } else if ($dom.find('textarea[name="' + name + '"]').length > 0) {
            return $dom.find('textarea[name="' + name + '"]').val();
        } else if ($dom.find('select[name="' + name + '"]').length > 0) {
            return $dom.find('select[name="' + name + '"]').val();
        } else {
            return '';
        }
    },
    // url跳转
    toHref: function(url) {
        let backUrl = this.getUrlParams()['backUrl'];
        if (backUrl) {
            window.location.href = backUrl;
        } else {
            window.location.href = url ? url : '/';
        }
    },
    toLoginUrl: function(backUrl) {
        let loginUrl = '/user/login';
        if (!backUrl) {
            window.location.href = loginUrl;
        } else {
            window.location.href = loginUrl + '?backUrl=' + window.encodeURIComponent(backUrl);
        }
    },
    isLogin: function() {
        var uid = $.cookie('uid');
        var token = $.cookie('token');
        if (uid && uid.length > 1 && token && token.length) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * tab添加选中css
     * options
     * $tabDoms tabs集合  default:$('.JS-tabs')
     * tabDom 需要选中的tab名称  default:'.JS-tab'
     * index 第几个
     * activeCssName 选中css名称 default：selected
     */
    addTabSelected: function(options = {}) {
        options.tabDom = options.tabDom || 'JS-tab';
        options.$tabDom = $('.' + options.tabDom);
        options.index = options.index || 0;
        options.activeCssName = options.tabDoms || 'selected';
        options.$tabDom.removeClass(options.activeCssName);
        $('.' + options.tabDom + '[data-nav="' + options.index + '"]').addClass(options.activeCssName);
    },
    /**
     * 选择tab
     */
    selectedTab: function(tabs) {
        let pathname = window.location.pathname;
        for (let i in tabs) {
            let tabName = tabs[i].tabName;
            let tabIndex = tabs[i].index;
            if (typeof(tabName) === 'object') {
                if (tabName.test(pathname)) {
                    this.addTabSelected({
                        index: tabs[i].index,
                        tabDom: tabs[i].tabDom
                    })
                    break;
                }
            } else if (pathname === tabName) {
                this.addTabSelected({
                    index: tabs[i].index,
                    tabDom: tabs[i].tabDom
                })
                break;
            }
        }
    },
    showContent: function(options = {}) {
        options.contentDom = options.contentDom || 'JS-content';
        options.$contentDom = $('.' + options.contentDom);
        options.index = options.index || 0;
        options.$contentDom.hide();
        $('.' + options.contentDom + '[data-content="' + options.index + '"]').show();
    },
    /**
     * 默认的选择tab方法
     * tab栏，定义 class:JS-tab data-nav='index'
     * content栏，定义 class:JS-content data-nav='index'
     */
    chooseTab: function(index) {
        this.addTabSelected({
            index: index
        });
        this.showContent({
            index: index
        })
    },
    // 倒计时
    countDown: function($dom, time = constant.CountDown) {
        const self = this;
        self.disableDom($dom, true);
        if (!time) {
            time = constant.CountDown;
            self.disableDom($dom, false);
            $dom.text(constant.SmsBtnText);
            return;
        }
        time--;
        setTimeout(function() {
            $dom.text(`${time}秒后重新获取`);
            self.countDown($dom, time);
        }, 1000);
    },
    // dom失效
    disableDom: function($dom, type) {
        if ($dom) {
            type = type ? type : false;
            $dom.attr({
                disabled: type
            });
        }
    },
    showTipDialog: function(str) {
        new DialogService().open({
            content: (typeof str === 'string') ? str : str.resultMsg || str.msg
        });
    },
    // [strToArr 字符串转数组 1,2,3,4->[1,2,3,4,5]]
    strToArr: function(str, format) {
        if (str) {
            return str.split(format || ',');
        } else {
            return [];
        }
    },
    // 四舍五入
    round: function(str, digit) {
        try {
            // 非数字
            if (isNaN(Number(str))) {
                return 0;
            } else {
                // 未定义or错误定义 精度位数
                if (isNaN(Number(digit))) {
                    digit = 2;
                }
                return Number(Number(str).toFixed(digit));
            }
        } catch (err) {
            return 0;
        }
    },
    // 金额显示，人民币
    money: function(value, format = '0,0.00') {
        return numeral(value).format(format);
    },
    // 百分比
    percent: function(value, format = '%,0.00') {
        return numeral(value).format('%,0.00');
    },
    // [timeFormat 时间格式化：2017-6-18 22:24:53 --> YYYY.MM.DD]
    timeFormat: function(time, format) {
        return time ? moment(time).format(format || 'YYYY-MM-DD') : '';
    },
    // [timeUnixFormat 时间格式化：1497796154759 -->2017-6-18 22:24:53]
    timeUnixFormat: function(time, format) {
        return time ? moment.unix(time).format(format || 'YYYY-MM-DD HH:mm:ss') : '';
    },
    // 银行卡脱敏
    convertCardNo: function(cardNo) {
        if (cardNo && new RegExp(/^(\d{12}|\d{16,22})$/).test(cardNo)) {
            return ' **** ***** **** ' + cardNo.substring(cardNo.length - 4, cardNo.length);
        }
        return cardNo;
    },
    /**
     * [生成分页参数]
     * @Author   ShiXingHao
     * @DateTime 2016-08-05
     * @param    {[type]}   currentPage [当前页]
     * @param    {[type]}   totalCount  [总记录数]
     * @param    {[type]}   pageSize    [每页显示条数]
     * @param    {[type]}   pageCount   [总页数]
     */
    generatePageInfo: function(currentPage, totalCount, pageSize, pageCount) {
        var totalPage = pageCount;

        var numeric = this.getPageList(Number(currentPage), Number(totalPage));

        return {
            currentPage: Number(currentPage),
            totalCount: Number(totalCount),
            pageSize: Number(pageSize),
            pageList: numeric,
            totalPage: Number(totalPage)
        };
    },
    // 获取分页显示列表
    getPageList: function(currentPage, totalPage) {
        var pages = [];
        var visiblePages = 5 > totalPage ? totalPage : 5;
        var half = Math.floor(visiblePages / 2);
        var start = currentPage - half + 1 - visiblePages % 2;
        var end = currentPage + half;

        // handle boundary case
        if (start <= 0) {
            start = 1;
            end = visiblePages;
        }
        if (end > totalPage) {
            start = totalPage - visiblePages + 1;
            end = totalPage;
        }

        var itPage = start;
        while (itPage <= end) {
            pages.push(itPage);
            itPage++;
        }
        return pages;
    },
    getAttrValue: function($dom, key) {
        return $dom.attr(key);
    },
    getRestfulParam: function() {
        let pathname = window.location.pathname;
        let paramsArr = pathname ? pathname.split('/') : [];
        return paramsArr[paramsArr.length - 1];
    },
    /**
     * 设置value
     * $dom jq对象：根据jq dom查询
     * $dom string 根据属性名查询
     */
    setValue: function($dom, value) {
        try {
            if ($dom && $dom.length > 0 && $dom.context) {
                $dom.val(value);
            } else if ($dom && typeof $dom == 'string') {
                $('[' + $dom + ']').val(value);
            }
        } catch (err) {

        }
    },
    /**
     * 设置文本
     * $dom jq对象：根据jq dom查询
     * $dom string 根据属性名查询
     */
    setText: function($dom, value) {
        try {
            if ($dom && $dom.length > 0 && $dom.context) {
                $dom.text(value);
            } else if ($dom && typeof $dom == 'string') {
                $('[' + $dom + ']').text(value);
            }
        } catch (err) {

        }
    },
    readSecond: function(time, text, href) {
        var minute = time;
        var text = text;
        var second = setInterval(function() {
            if (minute === 0) {
                clearInterval(second);
                window.location.href = href
            } else {
                minute--;
                utilService.showTipDialog(minute + text, 'none', '', 'open');
            }
        }, 1000)
    },
    getArray: function(str, format) {
        return str ? str.split(format || ',') : [];
    },
    bindEvent: function($dom, cb, event) {
        $dom.on(event || 'click', cb);
    },
    splitBySpace: function(cardNo) {
        var len = cardNo.length,
            oldLen = cardNo.length,
            start = 1,
            newVal = '';
        while (len >= 0) {
            newVal += cardNo.substr(start - 1, 4);
            if (len > 4) {
                newVal += ' ';
            }
            len -= 4;
            start += 4;
        }
        return newVal;
    },
    // 人民币转换
    toChinaMoney: function(money) {
        let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
        let cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
        let cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
        let cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
        let cnInteger = "整"; //整数金额时后面跟的字符
        let cnIntLast = "元"; //整型完以后的单位
        let maxNum = 999999999999999.9999; //最大处理的数字

        let IntegerNum; //金额整数部分
        let DecimalNum; //金额小数部分
        let ChineseStr = ""; //输出的中文金额字符串
        let parts; //分离金额后用的数组，预定义

        if (money === "") {
            return "";
        }

        money = parseFloat(money);
        if (money >= maxNum) {
            return "数值过大，无法正常显示";
        }
        // 零元整
        if (money === 0) {
            return cnNums[0] + cnIntLast + cnInteger;
        }
        // 判断小数
        money = money.toString();
        if (money.indexOf(".") === -1) {
            IntegerNum = money;
            DecimalNum = '';
        } else {
            parts = money.split(".");
            IntegerNum = parts[0];
            DecimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(IntegerNum, 10) > 0) {
            let zeroCount = 0;
            let IntLen = IntegerNum.length;
            for (let i = 0; i < IntLen; i++) {
                let n = IntegerNum.substr(i, 1);
                let p = IntLen - i - 1;
                let q = p / 4;
                let m = p % 4;
                if (n === "0") {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        ChineseStr += cnNums[0];
                    }
                    zeroCount = 0; //归零
                    ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m === 0 && zeroCount < 4) {
                    ChineseStr += cnIntUnits[q];
                }
            }
            ChineseStr += cnIntLast;
            //整型部分处理完毕
        }
        if (DecimalNum !== '') { //小数部分
            decLen = DecimalNum.length;
            for (let i = 0; i < decLen; i++) {
                n = DecimalNum.substr(i, 1);
                if (n !== '0') {
                    ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (ChineseStr === '') {
            ChineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (DecimalNum === '') {
            ChineseStr += cnInteger;
        }
        return ChineseStr;
    },
    saveCookie: function(key, value, options) {
        if (value) {
            $.cookie(key, value);
        }
    },
    // 挂在二维码
    buildQrcodeImg: function($dom, url) {
        // console.log(url);
        $dom.attr({
            src: url
        });
    },

    // 生成二维码链接
    buildQrcodeUrl: function(url, encode) {
        if (encode) {
            url = encodeURIComponent(url);
        }
        return '/napi/share/qrcode?url=' + url;
    },

    // 构建微信授权链接
    buildWxOAuthUrl: function(redirectUrl, encode) {
        let appId = WX_APPID;
        let redirect_uri = encode ? encodeURIComponent(redirectUrl) : redirectUrl;
        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    },

    // 构建微信重定向链接
    buildWxRedirectUrl: function(url) {
        return WX_CALLBACK_URL + `/wx/redirectOAuthInfo?backUrl=${url}`;
    },
    dealSpaUrl: function(url) {
        if (url && url.indexOf('#')) {
            return url.replace('#', '@');
        }
        return url;
    },
    // 123 => '0123'
    numberToString: function(num, len = 4) {
        let numStr = String(num);
        let numLength = numStr.length;
        for (let i = numLength; i < len; i++) {
            numStr = '0' + numStr;
        }
        return numStr;
    }
}
// module.exports = utilService;
export default utilService;