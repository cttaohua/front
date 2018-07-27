new Vue({
    el: '#homePage',
    created: function () {

    },
    mounted: function () {
        this.swiper();
		tagCloud();
    },
	methods: {
		swiper: function() {
			// swiper轮播图
			var mySwiper = new Swiper('.swiper-container', {
				direction: 'horizontal',
				loop: true,
				autoplay: true, //可选选项，自动滑动
				pagination: {
					el: '.swiper-pagination',
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}
			})
		}
	}
})
