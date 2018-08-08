new Vue({
	delimiters: ['${', '}'],
    el: '#classesPage',
	data: {
		classiyf_id: '',
		wordFlag: 1,
		page: 1,
		classList: []
	},
    created: function () {

    },
    mounted: function () {
		this.init();
		tagCloud();
    },
	methods: {
		init: function() {
			this.classiyf_id = $('#classify_id').val();
		},
		tabCut: function(flag) {
			this.wordFlag = flag;
		},
		getMsg: function() {
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
					
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		}
	}
})
