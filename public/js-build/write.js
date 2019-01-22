new Vue({
    el: '#writePage',
    data: {
        word_id: '',
        draft_id: '',
        title: '',
        coverUrl: '',
        editor: '',
        create_flag: false,
        new_classify: '',
        c_first: [],
        c_first_value: '',
        c_second: [],
        c_second_value: '',
        dialogVisible: false,
        cover_page: 1,
        cover_list: [],
        cover_load: 1
    },
    created: function () {

    },
    mounted: function () {
        $(() => {
            this.init();
            this.getC_first();
            this.getCoverList();
            this.createEditor();
            this.transformImg();
            this.roll();
        })
    },
    methods: {
        init: function () {
            var word_msg = $('input[name="word_msg"]').val();
            if (word_msg.length) { 
                word_msg = JSON.parse(word_msg);
                if(word_msg.type=='edit') {  //编辑文章
                    this.word_id = word_msg.id;
                }else {  //编辑草稿
                    this.draft_id = word_msg.id;
                }
                this.title = word_msg.title;
                this.coverUrl = word_msg.cover;
                if(word_msg.first_id) {
                    this.c_first_value = word_msg.first_id;
                    if(word_msg.classify_id) {
                        this.c_first_callback(this.c_first_value, word_msg.classify_id);
                    }
                } 
                if(typeof word_msg.new_classify != 'undefined' && word_msg.new_classify) {  //有新建分类
                    this.new_classify = word_msg.new_classify;
                    this.create_flag = true;
                }
            }
        },
        show_create: function () {
            this.create_flag = true;
        },
        getC_first: function () {
            var _this = this;
            $.ajax({
                url: '/api/getC_first',
                type: 'get',
                dataType: 'json',
                success: function (res) {
                    if (res.code == 200) {
                        for (var i = 0; i < res.body.length; i++) {
                            _this.c_first.push({
                                value: res.body[i].id,
                                label: res.body[i].value
                            })
                        }
                    }
                }
            })
        },
        c_first_callback: function (id, second_id) {
            var _this = this;
            _this.c_second_value = '';
            $.ajax({
                url: '/api/getC_second',
                type: 'get',
                data: {
                    parent_id: id
                },
                dataType: 'json',
                success: function (res) {
                    if (res.code == 200) {
                        _this.c_second = [];
                        for (var i = 0; i < res.body.length; i++) {
                            _this.c_second.push({
                                value: res.body[i].id,
                                label: res.body[i].value
                            })
                        }
                        if (second_id != undefined) {
                            _this.c_second_value = second_id;
                        }
                    } else {
                        _this.c_second = [];
                    }
                }
            })
        },
        createEditor: function () {
            var E = window.wangEditor;
            var _this = this;
            this.editor = new E('#editor-title', '#editor-content');
            this.editor.customConfig.uploadImgServer = '/api/upload/acticle';
            this.editor.customConfig.uploadTimeout = 100000000; //上传大图片
            this.editor.customConfig.customAlert = function (info) {
                _this.$message.error(info);
            }
            this.editor.create();
            //监听上传图片
            this.editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {

                },
                success: function (xhr, editor, result) {
                    // 图片上传并返回结果，图片插入成功之后触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    _this.$message.error('图片加载失败');
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    _this.$message.error('图片上传失败');
                },
                timeout: function (xhr, editor) {
                    // 图片上传超时时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    _this.$message.error('图片上传超时');
                }
            }
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
                if (e && e.preventDefault) {
                    e.preventDefault();
                } else {
                    window.event.returnValue = false;
                }
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
        publish: function (html, text) {
            var abs = text.substring(0, 100) + '...'; //摘要
            var params = {
                word_id: this.word_id,
                title: this.title,
                cover: this.coverUrl ? this.coverUrl : '',
                c_first_id: this.c_first_value,
                c_second_id: this.c_second_value,
                newclassify: this.new_classify,
                content: html,
                text: text,
                abs: abs,
                word_num: text.length,
                draft_id: this.draft_id
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
                    } else {
                        window.location.href = res.body;
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
            var html = this.editor.txt.html();
            var text = this.editor.txt.text();
            if (html == '<p><br></p>') {
                this.$message({
                    message: '请输入文章内容',
                    type: 'warning'
                });
                return false;
            }

            if (this.c_first_value == '') {
                this.$message({
                    message: '请选择一级分类',
                    type: 'warning'
                })
                return false;
            }
            if (this.new_classify) { //有新增分类
                this.$confirm('新增分类的文章不会立即发布，通过审核后才会发布', '提示', {
                    confirmButtonText: '继续发布',
                    cancelButtonText: '暂不发布',
                    type: 'info'
                }).then(function () {
                    _this.publish(html, text);
                });
            } else { //无新增分类
                if (!this.c_second_value) {
                    this.$message({
                        message: '请选择二级分类',
                        type: 'warning'
                    });
                    return false;
                }
                this.publish(html, text);
            }
        },
        //保存为草稿
        saveDraft: function() {
            var html = this.editor.txt.html();
            var text = this.editor.txt.text();
            if (html == '<p><br></p>') {
                this.$message({
                    message: '请输入文章内容',
                    type: 'warning'
                });
                return false;
            }
            var abs = text.substring(0, 100) + '...'; //摘要
            if(!this.title) {
                this.title = dateYmd(new Date().getTime());
            }
            var params = {
                draft_id: this.draft_id,
                title: this.title,
                cover: this.coverUrl ? this.coverUrl : '',
                c_first_id: this.c_first_value,
                c_second_id: this.c_second_value,
                new_classify: this.new_classify,
                content: html,
                text: text,
                abs: abs,
                word_num: text.length
            }
            $.ajax({
                url: '/api/save/draft',
                type: 'post',
                dataType: 'json',
                data: params,
                success: (res) => {
                    if (res.code != 200) {
                        this.$message.warning(res.body);
                    } else {
                        window.location.href = res.body;
                    }
                },
                error: () => {
                    this.$message.error('当前网络不佳，请稍后重试');
                }
            })
        },
        roll: function () {
            var editor_title = $('.w-e-toolbar');
            $(window).scroll(function () {
                var mTop = editor_title[0].offsetTop;
                var fTop = mTop + 630;
                var sTop = $(window).scrollTop();
                if (mTop < sTop && sTop < fTop) {
                    editor_title.addClass('fixed');
                } else {
                    editor_title.removeClass('fixed');
                }
            })
        },
        getCoverList: function() {
            $.ajax({
                url: '/api/cover/list',
                type: 'get',
                data: {
                    page: this.cover_page
                },
                success: (res)=>{
                    if(res.code==200) {
                        var list = res.body.list;
                        if(list.length<10) {
                            this.cover_load = 2;
                        }else {
                            this.cover_load = 1;
                        }
                        this.cover_list = this.cover_list.concat(list);
                    }
                },
                error: ()=> {

                }
            })
        },
        loadCover: function() {
            this.cover_page += 1;
            this.getCoverList();
        },
        chooseCover: function(cover) {
            this.coverUrl = cover;
            this.dialogVisible = false;
        }
    }
})