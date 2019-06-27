$(function () {
    //保存vue实例
    window.$vue = new Vue({});
    //搜索
    searchMonitor();
    //消息
    socketRun();
})
//标签云初始化
function tagCloud() {
    //标签云
    tagcloud({
        selector: "#sidebarPage .cloud", //元素选择器
        fontsize: 16, //基本字体大小, 单位px
        radius: 65, //滚动半径, 单位px
        mspeed: "normal", //滚动最大速度, 取值: slow, normal(默认), fast
        ispeed: "normal", //滚动初速度, 取值: slow, normal(默认), fast
        direction: 135, //初始滚动方向, 取值角度(顺时针360): 0对应top, 90对应left, 135对应right-bottom(默认)...
        keep: false //鼠标移出组件后是否继续随鼠标滚动, 取值: false, true(默认) 对应 减速至初速度滚动, 随鼠标滚动
    });
}
//读取cookie函数
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return false;
}
//去登陆弹框
function goLogin(t, str) {
    t.$confirm(str, '提示', {
        confirmButtonText: '去登录',
        cancelButtonText: '暂不登录',
        type: 'warning'
    }).then(function () {
        var href = window.location.pathname;
        window.location.href = '/login?originalUrl='+href;
    }).catch(function () {

    })
}
//vue时间过滤器 输出年月日时分秒
function dateYmdHis(timestamp) {
    var date = new Date(Number(timestamp)),
        Y = date.getFullYear() + '.',
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.',
        D = date.getDate() < 10 ? '0' + (date.getDate()) + ' ' : date.getDate() + ' ',
        h = ' ' + date.getHours() + ':',
        m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return Y + M + D + h + m;
}
//输出年月日
function dateYmd(timestamp) {
    var date = new Date(Number(timestamp)),
        Y = date.getFullYear() + '.',
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.',
        D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
    return Y + M + D;
}
//输出月日
function dateMd(timestamp) {
    var date = new Date(Number(timestamp)),
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月',
        D = date.getDate() < 10 ? '0' + (date.getDate()) + '日' : date.getDate() + '日';
    return M + D;
}
//搜索相关脚本
function searchMonitor() {
    var main = $('#headerPage');
    if (!main.length) {
        return false;
    }
    var input = main.find('.search input');
    var btn = main.find('.search .magnifying');
    input.on('focus', function () {
        input.parent('.search').addClass('active');
    })
    input.on('blur', function () {
        input.parent('.search').removeClass('active');
    })
    btn.on('click', function () {
        window.location.href = '/search?key=' + input.val();
    })
    input.keypress(function (e) {
        if (e.which == 13) {
            window.location.href = '/search?key=' + input.val();
        }
    })
}
//动态加载js并获取加载完成回调函数
function loadScript(url, callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(typeof(callback) != "undefined") {
		if(script.readyState) {
			script.onreadystatechange = function() {
				if(script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {
			script.onload = function() {
				callback();
			};
		}
	}
	script.src = url;
	document.body.appendChild(script);
}
//消息铃声播放
function didiPlay() {
    $('#didiAudio')[0].play();
}
//消息系统
function socketRun() {
    if(!getCookie('userId')) {   //用户未登录，不用连接socket.io
        return false;
    }
    if(window.location.href.indexOf('/notify/chat')!=-1) {  //在聊天页面，单独处理
        return false;
    }
    if(window.location.host.indexOf('localhost')!=-1) {  //本地
        var conn = '127.0.0.1:3001';
    }else {   //正式环境
        var conn = 'taohuayuanskill.com';
    }
    //加载socket.io.js
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js',function(){
        var socket = io.connect(conn,{
            path:'/socket'
        });
        //连接成功时触发
        socket.on('connect', function () {
            socket.emit("join",getCookie('userId'));
        });
        //群发消息
        socket.on('message',function(data){
            $vue.$notify({
                type: 'info',
                title: '消息',
                message: data,
                offset: 50
            })
        })
        //收到私聊消息
        socket.on('server_message',function(data){
            var msg = JSON.parse(data);
            $vue.$notify({
                type: 'info',
                title: '您有一条新的消息',
                message: msg.text,
                offset: 50,
                onClick: function() {
                    window.location.href = '/notify/chat';
                }
            })
            didiPlay();
        })
    })
}
