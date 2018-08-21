new Vue({
	el: '.settingPage',
	delimiters: ['${', '}'],
	data: {
		gender: '',
		reward: ''
	},
	created: function () {
		
	},
	mounted: function () {
		//basic页面
		if($('#sex').length) {
			this.init();
			this.transformImg();
		}else {  //reward页面
		    this.init2();
			this.transformImg2();
		}
	},
	methods: {
		init: function() {
		    this.gender = $('#sex').val();
		},
		init2: function() {
			this.reward = $('#reward').val();
		},
		transformImg: function () {
			//伪触发input file
			var fileSelect = document.getElementById("fileSelect"),
				fileElem = document.getElementById("upload_file");
			fileSelect.addEventListener("click", function (e) {
				if (fileElem) {
					fileElem.click();
				}
				e.preventDefault(); // prevent navigation to "#"
			}, false);
			//将上传的图片转化为base64格式
			$('#upload_file').on('change', function (e) {
				var file = e.target.files[0];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = function () {
					var dataUrl = reader.result;
					$('.head').prop('src',dataUrl);
				}
			})
		},
		transformImg2: function() {
			//伪触发input file
			var fileSelect = document.getElementById("fileSelect"),
				fileElem = document.getElementById("upload_file");
			fileSelect.addEventListener("click", function (e) {
				if (fileElem) {
					fileElem.click();
				}
				e.preventDefault(); // prevent navigation to "#"
			}, false);
			//将上传的图片转化为base64格式
			$('#upload_file').on('change', function (e) {
				var file = e.target.files[0];
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = function () {
					var dataUrl = reader.result;
					$('.imgcode').prop('src',dataUrl);
				}
			})
		},
		saveMeans: function() {   //保存基础设置,
		    var _this = this;
			if($('.head').attr('src').length>100){
				var head = $('.head').attr('src');
			}else {
				var head = '';
			}
			if($('.nick input').val().length==0) {
				this.$message.warning('请输入昵称');
				return false;
			}
			if($('.nick input').val().length>20) {
				this.$message.warning('昵称最多20个字符');
				return false;
			}
			$.ajax({
				url: '/api/saveMeans',
				type: 'post',
				data: {
					head: head,
					nick: $('.nick input').val(),
					sex: this.gender
				},
				dataType: 'json',
				success: function(res) {
					if(res.code==200) {
						_this.$message({
							message: '保存成功',
							type: 'success'
						})
					}else {
						_this.$message.warning(res.body);
					}
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
		},
		saveReward: function() {
			
			var _this = this;
			var code = $('.imgcode').attr('src');
			if(this.reward==1&&code=='/img/receipt_code.png') {
				this.$message.warning('开启赞赏功能请上传收款二维码');
			}
			if(code.length>100) {
				var receipt = code;
			}else {
				var receipt = '';
			}
			
			$.ajax({
				url: '/api/savereward',
				type: 'post',
				data: {
					reward: this.reward,
					receipt_code: receipt
				},
				dataType: 'json',
				success: function(res) {
					if(res.code==200) {
						_this.$message({
							message: '保存成功',
							type: 'success'
						})
					}else {
						_this.$message.warning(res.body);
					}
				},
				error: function() {
					_this.$message.error('当前网络不佳，请稍后重试');
				}
			})
			
			
		}
	}
})