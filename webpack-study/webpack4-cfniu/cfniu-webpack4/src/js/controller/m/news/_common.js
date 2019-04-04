class Pagination {
    constructor(config) {
        this.$loading = config.$loading;
        this.$el = config.$el;
        this.startY = config.startY;
        this.currentY = config.currentY;
        this.startScrollTop = config.startScrollTop;
        this.scrollEventTarget = config.scrollEventTarget;
        this.translate = config.translate;
        this.allowFetch = config.allowFetch;
        this.distanceIndex = config.distanceIndex;
        this.maxDistance = config.maxDistance;
        this.callbackFn = null;
    }
    init() {
        this.scrollEventTarget = this.getScrollEventTarget(this.$el);
        this.bindTouchEvent(this.$el);
    };
    // 判断滚动目标元素
    getScrollEventTarget(element) {
        var currentNode = element;
        // 非顶级元素的元素
        while (currentNode && currentNode.tagName !== 'HTML' &&
            currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
            // return CSSStyleDeclaration
            var overflowY = document.defaultView.getComputedStyle(currentNode).overflowY;
            if (overflowY === 'scroll' || overflowY === 'auto') {
                return currentNode;
            }
            currentNode = currentNode.parentNode;
        }
        return window;
    };
    updateTransform(translate) {
        $(this.$el).css({
            'transform': 'translate3d(0, ' + translate + 'px, 0)'
        });
    };
    // 计算滚动条距离顶部的偏移量
    getScrollTop(element) {
        if (element === window) {
            // fix chome bug
            return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
        } else {
            return element.scrollTop;
        }
    };
    bindTouchEvent($el) {
        var self = this;
        $el.addEventListener('touchstart', function (event) {
            return self.handleTouchStart(event);
        });
        $el.addEventListener('touchmove', function (event) {
            return self.handleTouchMove(event);
        });
        $el.addEventListener('touchend', function (event) {
            return self.handleTouchEnd(event);
        });
    };
    handleTouchStart(event) {
        this.startY = event.touches[0].clientY;
        this.startScrollTop = this.getScrollTop(this.scrollEventTarget);
    };
    handleTouchMove(event) {
        // getBoundingClientRect 获取页面元素的位置
        if (this.startY < this.$el.getBoundingClientRect().top && this.startY > this.$el.getBoundingClientRect().bottom) {
            return;
        }
        this.currentY = event.touches[0].clientY;
        var distance = (this.currentY - this.startY) / this.distanceIndex;
        // 暂不支持下拉
        if (distance >= 0) {
            // 逐步重置页面
            if (this.translate < 0) {
                this.translate = 0;
            }
            this.updateTransform(this.translate);
            return;
        }
        this.translate = this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + distance;
        // console.log(this.translate + ',' + distance);
        // 控制拖动效果范围
        if (this.maxDistance > 0 && Math.abs(this.translate) >= this.maxDistance) {
            this.updateTransform(this.translate);
            // 符合条件抓取文件
            if (this.allowFetch) {
                this.callbackFn();
            }
        }
        this.$loading.show();
    };
    handleTouchEnd(event) {
        this.$loading.hide();
        // this.translate = 0;
        this.updateTransform(this.translate);
    };
}
export default Pagination;