new Vue({
	delimiters: ['${', '}'],
    el: '#draftPage',
	data: {
        wordList: [],
		page: 1,
		total: 0,
        paginationFlag: true,
        showFlag: 0
	},
    created: function () {

    },
    mounted: function () {
        this.getMsg();
    },
	methods: {
		getMsg: function() {
            var _this = this;
			$.ajax({
				url: '/api/draft/list',
				type: 'get',
				data: {
					page: this.page
				},
				dataType: 'json',
				success: function(res) {
					_this.wordList = [];
					if(res.code==200) {
						if(res.body.list.length) {
							_this.wordList = res.body.list;
                            _this.paginationFlag = true;
                            _this.showFlag = 1;
						}else {
							_this.wordList = [];
                            _this.paginationFlag = false;
                            _this.showFlag = 2;
						}
						_this.total = res.body.count;
					}else {
                        _this.paginationFlag = false;
                        _this.showFlag = 2;
						_this.$message.warning(res.body);
                    }
				},
				error: function() {
                    _this.paginationFlag = false;
                    _this.showFlag = 2;
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		},
		pageChange: function(current) {
			this.page = current;
			this.getMsg();
		}
	}
})
