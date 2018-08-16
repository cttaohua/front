new Vue({
    el: '#writePage',
    data: {
        title: '',
        coverUrl: '',
        editor: '',
        create_flag: false,
        new_classify: '',
        classify: [],
        classifyValue: ''
    },
    created: function () {
        this.getClassify();
    },
    mounted: function () {
        this.createEditor();
        this.transformImg();
    },
    methods: {
        show_create: function () {
            this.create_flag = true;
        },
        getClassify: function () {
            var _this = this;
            $.ajax({
                url: '/api/getClassify',
                type: 'get',
                dataType: 'json',
                success: function (res) {
                    if (res.code == 200) {
                        for (var i = 0; i < res.body.length; i++) {
                            _this.classify.push({
                                value: res.body[i].id,
                                label: res.body[i].value
                            })
                        }
                    }
                }
            })
        },
        createEditor: function () {
            var E = window.wangEditor;
            this.editor = new E('#editor');
            this.editor.customConfig.uploadImgShowBase64 = true;
            this.editor.create();
        },
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
                    _this.coverUrl = dataUrl;
                }
            })
        },
        publish: function () {
            var html = this.editor.txt.html();
			var text = this.editor.txt.text();
			var abs = text.substring(0,70) + '...';  //摘要
            var params = {
                word_id: '',
                title: this.title,
                cover: this.coverUrl,
                classify_id: this.classifyValue,
                newclassify: this.new_classify,
                content: html,
				abs: abs,
				word_num: text.length
            }
            var _this = this;
            $.ajax({
                url: '/api/article',
                type: 'post',
                dataType: 'json',
                data: params,
                success: function (res) {
                    if (res.code != 200) {
                        _this.$message.warning(res.body);
                    }else {
						_this.$message.success('发布成功');
					}
                },
                error: function () {
                    _this.$message.error('当前网络不佳，请稍后重试');
                }
            })
        },
        comfirm: function () {
            var _this = this;
            if (!this.title.length) {
                this.$message({
                    message: '请输入文章标题',
                    type: 'warning'
                });
                return false;
            }
            var text = this.editor.txt.html();
            if (text == '<p><br></p>') {
                this.$message({
                    message: '请输入文章内容',
                    type: 'warning'
                });
                return false;
            }
            if (this.new_classify) { //有新增分类
                this.$confirm('新增分类的文章不会立即发布，通过审核后才会发布', '提示', {
                    confirmButtonText: '继续发布',
                    cancelButtonText: '暂不发布',
                    type: 'info'
                }).then(function () {
                    _this.publish();
                });
            } else { //无新增分类
                if (!this.classifyValue) {
                    this.$message({
                        message: '请选择文章分类',
                        type: 'warning'
                    });
                    return false;
                }
                this.publish();
            }
        }
    }
})
