new Vue({
    delimiters: ['${', '}'],
    el: '#searchPage',
    data: {
        key: '',
		page: 1,
		type: 1,  // 1综合排序 2热门文章 3最新发布
        searchList: [],
		total: 0,
		latelyKey: []
    },
    created: function () {

    },
    mounted: function () {
        this.init();
		this.getList();
    },
    methods: {
        init: function () {
             this.key = $('#key').val();
			 this.getlatelyKey();
        },
		//从缓存中读取最近搜索并将此条关键词加入进去
		getlatelyKey: function() {
			var keystr = window.localStorage.getItem('latelyKey');
			if(this.key!='') {
				if(keystr==''||keystr==null) {  //之前没有
					keystr = JSON.stringify([this.key]);
				}else {
					var keyarr = JSON.parse(keystr);
					if($.inArray(this.key,keyarr)==-1) {  //不在搜索记录里
						keyarr.unshift(this.key);
					}
					keystr = JSON.stringify(keyarr);
				}
				window.localStorage.setItem('latelyKey',keystr);
			}
			if(keystr!=''&&keystr!=null) {
				this.latelyKey = JSON.parse(window.localStorage.getItem('latelyKey'));
			}
		},
		clearAll: function() {
			this.latelyKey = [];
			window.localStorage.setItem('latelyKey','');
		},
		clearThis: function(index) {
			this.latelyKey.splice(index,1); 
			var keyarr = JSON.parse(window.localStorage.getItem('latelyKey'));
			keyarr.splice(index,1);
			if(keyarr.length) {
				var keystr = JSON.stringify(keyarr);
			}else {
				var keystr = '';
			}
			window.localStorage.setItem('latelyKey',keystr);
		},
		sequence: function(num) {
			this.type = num;
			this.page = 1;
			this.getList();
		},
		pageChange: function(current) {
			this.page = current;
			this.getList();
		},
		getList: function () {
			var _this = this;
			$.ajax({
				url: '/api/search',
				type: 'get',
				dataType: 'json',
				data: {
					key: this.key,
					type: this.type,
					page: this.page
				},
				success: function(res) {
					if(res.code==200) {
						_this.total = res.body.count;
						_this.searchList = res.body.list;
					}else {
						_this.searchList = [];
					}
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		}
    }
})
