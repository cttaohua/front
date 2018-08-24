new Vue({
    delimiters: ['${', '}'],
    el: '#detailsPage',
    data: {
		article_id: ''
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
				if($(this).hasClass('unlike')) {  //不喜欢
					$(this).removeClass('unlike').addClass('islike');
					// _this.likefun(1);
				}else {  //喜欢
					$(this).removeClass('islike').addClass('unlike');
					// _this.likefun(0);
				}
			})
		},
		rewardswitch: function() {
			$('.receipt_code').show(500);
		},
		likefun: function(type) {
			$.ajax({
				url: '',
				type: 'get',
				dataType: 'json',
				data: {
					islike: type,
					article_id: this.article_id
				},
				success: function(res) {
					
				},
				error: function() {
					
				}
			})
		}
	}
})
