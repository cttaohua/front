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
		var href = window.location.href;
		window.localStorage.setItem('loginHref',href);
        window.location.href= '/login';
    }).catch(function () {
        
    })
}
//vue时间过滤器 输出年月日时分秒
function dateYmdHis(timestamp) {
    var date = new Date(Number(timestamp)),
    Y = date.getFullYear() + '.',
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.',
    D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ',
    h = ' ' + date.getHours() + ':',
    m = date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes();
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
//搜索相关脚本
function searchMonitor() {
	var main = $('#headerPage');
	if(!main.length) {
		return false;
	}
	var input = main.find('.search input');
	var btn = main.find('.search .magnifying');
    input.on('focus',function(){
        input.parent('.search').addClass('active');
    })
    input.on('blur',function(){
        input.parent('.search').removeClass('active');
    })
	btn.on('click',function(){
		window.location.href = '/search?key=' + input.val();
	})
	input.keypress(function(e){
		if(e.which == 13) {
			window.location.href = '/search?key=' + input.val();
		}
	})
}
searchMonitor();