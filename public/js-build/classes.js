new Vue({
	delimiters: ['${', '}'],
    el: '#classesPage',
	data: {
		classiyf_id: '',
		wordFlag: 1,
		page: 1,
		wordList: [],
		total: 0
	},
    created: function () {

    },
    mounted: function () {
		this.init();
		tagCloud();
		this.getMsg();
    },
	methods: {
		init: function() {
			this.classiyf_id = $('#classify_id').val();
		},
		tabCut: function(flag) {
			this.wordFlag = flag;
			this.page = 1;
			this.getMsg();
		},
		getMsg: function() {
			var _this = this;
			$.ajax({
				url: '/api/classifyList',
				type: 'get',
				data: {
					classify_id: this.classiyf_id,
					page: this.page,
					type: this.wordFlag
				},
				dataType: 'json',
				success: function(res) {
					_this.wordList = [];
					if(res.code==200) {
						console.log(res.body);
						if(res.body.list.length) {
							_this.wordList = res.body.list;
						}else {
							_this.wordList = [];
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
		}
	}
})
