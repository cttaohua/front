new Vue({
	delimiters: ['${', '}'],
    el: '#userPage',
	data: {
		user_id: '',
		wordFlag: 1,
		page: 1,
		wordList: [],
		total: 0,
		paginationFlag: true,
		editFlag: true
	},
    created: function () {
        
    },
    mounted: function () {
		this.init();
		this.getMsg();
    },
	methods: {
		init: function() {
			this.user_id = $('#user_id').val();
			this.wordFlag = $('#word_type').val();
		},
		tabCut: function(flag) {
			this.wordFlag = flag;
			this.page = 1;
			this.getMsg();
		},
		getMsg: function() {
			var _this = this;
			$.ajax({
				url: '/api/userList',
				type: 'get',
				data: {
					user_id: this.user_id,
					page: this.page,
					type: this.wordFlag
				},
				dataType: 'json',
				success: function(res) {
					_this.wordList = [];
					if(res.code==200) {
						if(res.body.list.length) {
							_this.wordList = res.body.list;
							_this.paginationFlag = true;
						}else {
							_this.wordList = [];
							_this.paginationFlag = false;
						}
						_this.total = res.body.count;
					}else {
						_this.$message.warning(res.body);
					}
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		},
		pageChange: function(current) {
			this.page = current;
			this.getMsg();
		},
		save_userIntro: function() {
			var _this = this;
			var intro = $('.js-textarea').val();
			$.ajax({
				url: '/api/saveIntro',
				type: 'post',
				data: {
					intro: intro
				},
				dataType: 'json',
				success: function(res) {
					if(res.code!=200) {
						_this.$message.warning(res.body);
					}else {
						$('.js-intro').text(intro);
						_this.$message.success('保存成功');
						_this.editFlag = true;
					}
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		}
	}
})
