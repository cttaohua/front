new Vue({
    delimiters: ['${', '}'],
    el: '#chatPage',
    data: {
        socket: '',
        user_list: [],
        chat_list: [],
        //当前聊天对象
        current_obj: '',
        //当前用户信息
        user_msg: ''
    },
    created: function () {

    },
    mounted: function () {
        $(() => {
            this.init();
        })
    },
    methods: {
        init: function () {
            this.socketFun();
            this.getContacts();
            this.user_msg = $('#user_msg').val();
        },
        socketFun: function () {
            var _this = this;
            if(window.location.host.indexOf('localhost')!=-1) {  //本地
                var conn = '127.0.0.1:3001';
            }else {   //正式环境
                var conn = 'https://taohuayuansill.com';
            }  
            //加载socket.io.js
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js', function () {
                _this.socket = io.connect(conn);
                //连接成功时触发
                _this.socket.on('connect', function () {
                    _this.socket.emit("join", getCookie('userId'));
                });
                //收到私聊消息
                _this.socket.on('server_message', function (data) {
                    var msg = JSON.parse(data);
                    _this.receiveMsg(msg);
                })
            })
        },
        watchDiv: function (event) {
            this.current_obj.curr_content = $(event.currentTarget).text();
        },
        sendMsg: function () {
            var _this = this;
            if (!this.current_obj.curr_content.length) {
                this.$message.warning('不能发送空消息');
                return false;
            }
            var s_msg = {
                from: getCookie('userId'),
                to: this.current_obj.relation_id,
                text: this.current_obj.curr_content,
                type: 1 //文本消息
            }
            s_msg = JSON.stringify(s_msg);
            this.socket.emit('private_message',s_msg);
            this.chat_list.push({
                head: this.user_msg.head,
                content: _this.current_obj.curr_content,
                belong: 1
            })
            this.current_obj.prev_content = '';
            this.current_obj.curr_content = '';
            $('#chat-input').text('');
        },
        receiveMsg: function(msg) {
            //是当前选中的联系人
            if(msg.from==this.current_obj.relation_id) {
                this.chat_list.push({
                    head: this.current_obj.head,
                    content: msg.text,
                    belong: 2
                })
            }
            didiPlay();
        },
        //获取30天内联系人
        getContacts: function() {
            $.ajax({
                url: '/api/getContacts/list',
                type: 'get',
                success: (res)=> {
                    if(res.code==200) {
                        if(res.body.length) {
                            var data = res.body;
                            data.forEach((curr) => {
                                curr.prev_content = '',
                                curr.curr_content = '';
                                this.user_list.push(curr);
                            });
                            this.current_obj = this.user_list[0];
                        }
                    }
                },
                error: ()=> {
                    this.$message.error('当前网络不佳，请稍后重试');
                }
            })
        }
    }
})