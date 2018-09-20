new Vue({
	delimiters: ['${', '}'],
    el: '#homePage',
	data: {
		page: 1,
		homeList: [],
		noMore: false,
		loading: true,
		item: '',
	},
    created: function () {

    },
    mounted: function () {
		tagCloud();
        this.swiper();
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
		},
		getMsg: function() {
			var _this = this;
			$.ajax({
				url: '/api/homeList',
				type: 'get',
				data: {
					page: this.page
				},
				success: function(res) {
					if(res.code==200) {
						if(typeof (res.body)=='object') {
							_this.homeList = _this.homeList.concat(res.body);
						}
						if(res.body.length<20) {
							_this.noMore = true;
							_this.loading = false;
						}
					}
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		},
		getMore: function() {
			this.page = this.page + 1;
			this.getMsg();
		}
	}
})
