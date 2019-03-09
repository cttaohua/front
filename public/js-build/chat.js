new Vue({
    delimiters: ['${', '}'],
    el: '#chatPage',
    data: {
        socket: '',      //socket对象
        user_list: [],   //联系人信息
        chat_list: [],   //聊天信息
        current_obj: '',  //当前聊天对象
        user_msg: '',   //当前用户信息
        chat_page: 1,    //分页页数
        page_flag: true   //分页锁
    },
    created: function () {

    },
    mounted: function () {
        $(() => {
            this.init();
        })
    },
    filters: {
        dateMd: dateMd,
    },
    methods: {
        init: function () {
            this.socketFun();
            this.getContacts();
            this.user_msg = JSON.parse($('#user_msg').val());
            this.scrolltoTop();
        },
        socketFun: function () {
            var _this = this;
            if(window.location.host.indexOf('localhost')!=-1) {  //本地
                var conn = '127.0.0.1:3001';
            }else {   //正式环境
                var conn = 'taohuayuanskill.com';
            }  
            //加载socket.io.js
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js', function () {
                _this.socket = io.connect(conn,{
                    path:'/socket'
                });
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
        //页面滚动到最底部
        scrolltoBottom: function() {
            let message_area = document.querySelector('.chat-message'),
            im_list = document.querySelector('.im-list');
            this.$nextTick(function(){
                message_area.scrollTop = im_list.offsetHeight;
            })
        },
        //页面往上滚的时候去加载更多的信息
        scrolltoTop: function() {
            let message_area = document.querySelector('.chat-message');
            message_area.addEventListener('scroll',()=>{
                if(message_area.scrollTop<80&&this.page_flag) {
                    this.chat_page += 1;
                    this.page_falg = false;
                    this.getRecord();
                }
            })
        },
        sendMsg: function () {
            var _this = this;
            if (!this.current_obj.curr_content.length) {
                return false;
            }
            $('#chat-input').text('');
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
            this.scrolltoBottom();
            this.current_obj.prev_content = '';
            this.current_obj.curr_content = '';
        },
        receiveMsg: function(msg) {
            if(msg.from==this.current_obj.relation_id) {  //是当前选中的联系人
                this.chat_list.push({
                    head: this.current_obj.head,
                    content: msg.text,
                    belong: 2
                })
                this.scrolltoBottom();
            }else {  //其他人
                let contacts_flag = 0;
                this.user_list.forEach((curr,index)=>{
                    if(curr.relation_id==msg.from) {  //在当前的联系人列表中
                        let record = this.user_list[index];
                        this.user_list.splice(index,1);
                        this.user_list.unshift(record);
                        contacts_flag = 1;
                        return false;
                    }
                })
                if(contacts_flag == 0) {   //不在当前联系人列表中，再去请求
                    $.ajax({
                        url: '/api/getContacts/single',
                        type: 'get',
                        data: {
                            relation_id: msg.from
                        },
                        success: (res) => {
                            if(res.code==200) {
                                var data = res.body;
                                data.prev_content = '',
                                data.curr_content = '';
                                this.user_list.unshift(data);
                            }else {
                                this.$message.warning(res.body);
                            }
                        },
                        error: () => {
                            this.$message.warning('网络波动，请稍后重试');
                        }
                    })
                }
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
                            //this.current_obj = this.user_list[0];
                            //this.getRecord();
                        }
                    }
                },
                error: ()=> {
                    this.$message.error('当前网络不佳，请稍后重试');
                }
            })
        },
        //获取当前联系人聊天记录
        getRecord: function() {
            $.ajax({
                url: '/api/getChat/list',
                type: 'get',
                data: {
                    master: this.user_msg.id,
                    guest: this.current_obj.relation_id,
                    page: this.chat_page
                },
                success: (res) => {
                    if(res.code==200) {
                        let data = res.body.list;
                        if(data.length) {
                            data.forEach((curr)=>{
                                if(curr.from == this.user_msg.id) {  //本人
                                    var head = this.user_msg.head;
                                    var belong = 1;
                                }else {  //他人
                                    var head = res.body.user_msg.head;
                                    var belong = 2;
                                }
                                var obj = {
                                    head: head,
                                    content: curr.msg,
                                    belong: belong
                                }
                                this.chat_list.unshift(obj);
                            })
                            if(this.chat_page==1) {
                                this.scrolltoBottom();
                            }
                            if(data.length<20) {
                                this.page_flag = false;
                            }else {
                                this.page_flag = true;
                            }
                        }else {
                            this.page_flag = false;
                        }
                    }else {
                        this.$message.warning(res.body);
                    }
                },
                error: () => {
                    this.$message.warning('当前网络波动，请稍后重试');
                    this.page_flag = false;
                }
            })
        },
        //切换聊天人
        cutchatPerson: function(index) {
            this.current_obj = this.user_list[index];
        }
    },
    watch:{
        current_obj:{  //当前聊天对象变更时，重新请求聊天记录
            handler(val, oldVal) {
                this.chat_list = [];
                this.chat_page = 1;
                this.page_flag = true;
                this.getRecord();
            },
            deep:true
        }
    }
})