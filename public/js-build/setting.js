new Vue({
	el: '#basicPage',
	delimiters: ['${', '}'],
	data: {
		gender: '1',
	},
	created: function () {
		
	},
	mounted: function () {
		this.transformImg();
	},
	methods: {
		transformImg: function () {
			var _this = this;
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
					$('#head').prop('src',dataUrl);
				}
			})
		},
		saveMeans: function() {   //保存基础设置
			if($('.head').attr('src').length>100){
				var head = $('.head').attr('src');
			}else {
				var head = '';
			}
			if($('.nick').val().length==0) {
				this.message.warning('请输入昵称');
				return false;
			}
			if($('.nick').val().length>20) {
				this.message.warning('昵称最多20个字符');
				return false;
			}
			$.ajax({
				url: '',
				type: 'post',
				data: {
					head: head,
					nick: $('.nick').val(),
					sex: this.gender
				},
				dataType: 'json',
				success: function() {
					
				},
				error: function() {
					
				}
			})
		}
	}
})