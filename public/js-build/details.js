new Vue({
    delimiters: ['${', '}'],
    el: '#detailsPage',
    data: {
		article_id: '',
		reviewFlag: false,
		review_content: '',
    },
    created: function () {

    },
    mounted: function () {
		this.init();
    },
    methods: {
		init: function() {
			var _this = this;
			this.article_id = $('#article_id').val();
			$('body').on('click',function(){
				$('.receipt_code').hide(500);
			})
			//点击喜欢按钮
			$('.like-group').on('click',function(){
				if(getCookie('userInfo')) {
					if($(this).hasClass('unlike')) {  //不喜欢
						$(this).removeClass('unlike').addClass('islike');
						_this.likefun(1);
					}else {  //喜欢
						$(this).removeClass('islike').addClass('unlike');
						_this.likefun(0);
					}
				}else {
					goLogin(_this,'喜欢这篇文章需要登录，确定登录吗？');
				}
			})
		},
		rewardswitch: function() {
			$('.receipt_code').show(500);
		},
		likefun: function(type) {
			var _this = this;
			$.ajax({
				url: '/api/islike',
				type: 'get',
				dataType: 'json',
				data: {
					islike: type,
					article_id: this.article_id
				},
				success: function(res) {
					if(res.code!=200) {
						_this.$message.warning(res.body);
					}
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		},
		review_send: function() {
			//发送评论
			if(!this.review_content.length) {
				this.$message.error('回复内容不能为空');
			}
		}
	}
})
