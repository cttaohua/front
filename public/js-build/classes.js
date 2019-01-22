new Vue({
	delimiters: ['${', '}'],
	el: '#classesPage',
	data: {
		classiyf_id: '',
		wordFlag: 1,
		page: 1,
		wordList: [],
		total: 0,
		paginationFlag: true
	},
	created: function () {

	},
	mounted: function () {
		$(() => {
			tagCloud();
			this.init();
			this.getMsg();
		});
	},
	methods: {
		init: function () {
			this.classiyf_id = $('#classify_id').val();
		},
		tabCut: function (flag) {
			this.wordFlag = flag;
			this.page = 1;
			this.getMsg();
		},
		getMsg: function () {
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
				success: function (res) {
					_this.wordList = [];
					if (res.code == 200) {
						if (res.body.list.length) {
							_this.wordList = res.body.list;
							_this.paginationFlag = true;
						} else {
							_this.wordList = [];
							_this.paginationFlag = false;
						}
						_this.total = res.body.count;
					} else {
						_this.paginationFlag = false;
						_this.$message.warning(res.body);
					}
				},
				error: function () {
					_this.paginationFlag = false;
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		},
		pageChange: function (current) {
			this.page = current;
			this.getMsg();
		}
	}
})