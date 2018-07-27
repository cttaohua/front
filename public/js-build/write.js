new Vue({
    el: '#writePage',
    data: {
        title: '',
        imageUrl: '',
        editor: ''
    },
    created: function() {
        this.createEditor();
    },
    mounted: function() {
        this.transformImg();
    },
    methods: {
        createEditor: function() {
            var E = window.wangEditor;
            this.editor = new E('#editor');
            this.editor.customConfig.uploadImgShowBase64 = true;
            this.editor.create();
        },
        transformImg: function() {
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
                    _this.imageUrl = dataUrl;
                }
            })
        },
        comfirm: function() {
            if (!this.title.length) {
                this.$message({
                    message: '请输入文章标题',
                    type: 'warning'
                });
                return false;
            }
            var txt = this.editor.txt.html();
            if (txt == '<p><br></p>') {
                this.$message({
                    message: '请输入文章内容',
                    type: 'warning'
                });
                return false;
            }
            var params = {
                title: this.title,
                imageUrl: this.imageUrl,
                content: txt
            }
        }
    }
})
