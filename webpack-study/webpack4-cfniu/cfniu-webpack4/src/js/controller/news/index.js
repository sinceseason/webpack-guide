require('../../../scss/news/news.scss');

// banner
let $jcarousel = $('.JS-banner-jcarousel');
let $pagination = $('.JS-banner-pagination');

// 控制banner高宽，排除cms后台图片上传问题
$jcarousel.find('img').height('270');
$jcarousel.find('img').width('880');

$jcarousel.jcarousel({
    wrap: 'circular'
});

$pagination.on('jcarouselpagination:active', 'a', function() {
    $(this).addClass('active');
}).on('jcarouselpagination:inactive', 'a', function() {
    $(this).removeClass('active');
}).jcarouselAutoscroll().jcarouselPagination({
    perPage: 1,
    'item': function(page, carouselItems) {
        return '<a></a>';
    }
});

$('.JS-banner-news').click(function() {
    window.location.href = $(this).attr('data-href');
});