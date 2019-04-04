/*
 * @Author: shixinghao 
 * @Date: 2018-07-13 14:29:01 
 * @Last Modified by:   shixinghao 
 * @Last Modified time: 2018-07-13 14:29:01 
 */
require('../../scss/index.scss');

const $bannerWrap = $('.JS-banner-wrap');
const $bannerJcarousel = $('.JS-banner-jcarousel');
const $bannerPagination = $('.JS-banner-pagination');
const $newsTab = $('.JS-news-tab');

// banner宽高设置
let viewWidth = $('body').innerWidth();
let imgHeight = viewWidth * (460 / 1920);
$bannerWrap.height(imgHeight);

// 初始化轮播图&宽高
$bannerJcarousel.on('jcarousel:reload jcarousel:create', function() {
    let carousel = $(this),
        width = carousel.innerWidth();
    $(this).jcarousel('items').css('width', Math.ceil(width) + 'px');
}).jcarousel({
    wrap: 'circular',
    auto: 2,
}).jcarouselAutoscroll();

// 初始化轮播图页码
$bannerPagination.on('jcarouselpagination:active', 'span', function() {
    $(this).addClass('active');
}).on('jcarouselpagination:inactive', 'span', function() {
    $(this).removeClass('active');
}).jcarouselPagination({
    perPage: 1,
    'item': function(page, carouselItems) {
        return `<span>${carouselItems.attr('data-adname')}</span>`;
    }
});

// 资讯
$('ul.JS-news-tab li:first').addClass('selected');
$('div.JS-new-main:first').show().addClass('selected');

$newsTab.find('li').click(function() {
    $(".JS-news-tab li").removeClass("selected");
    $(this).addClass('selected');
    $(".JS-new-main").hide().eq($(this).index()).show();
})

// 轮播图点击
$bannerJcarousel.find('.JS-banner-index').click(function() {
    window.location.href = $(this).attr('data-href');
});
