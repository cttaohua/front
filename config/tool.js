//产生n位随机数
function random(num) {
	var integer = '1';
	for (var i = 0; i < (num); i++) {
		integer = integer + '0';
	}
	return Math.floor(Math.random() * (integer));
}
//获取n位的数字字母的字符串
function getRandomStr(n) {
	var n = n || 12; //默认12位
	var res = '';
	var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	for(var i = 0; i < n ; i ++) {
		var id = Math.ceil(Math.random()*35);
		res += chars[id];
	}
	return res;
}
//根据时间戳返回年月日的时间
function dateYmd(timestamp) {
	var date = new Date(Number(timestamp));
	Y = date.getFullYear() + '.';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
	D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
	return Y + M + D;
}
//根据时间戳返回年月日时分的时间
function dateYmdHis(timestamp) {
	var date = new Date(Number(timestamp));
	Y = date.getFullYear() + '.';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
	D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
	h = ' ' + date.getHours() + ':';
	m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	return Y + M + D + h + m;
}
//转义单引号
function transferredSingle(str) {
	if(!str) {
		return '';
	}
	return str.replace(/'/g, '&apos;');
}
//根据数字月份返回文字月份
function returnMonth(num) {
	var month = '';
	switch (num) {
		case 1:
			month = '一';
			break;
        case 2:
		    month = '二';
			break;
        case 3:
        	month = '三';
        	break;
        case 4:
        	month = '四';
        	break;
		case 5:
			month = '五';
			break;
		case 6:
			month = '六';
			break;
		case 7:
			month = '七';
			break;
		case 8:
			month = '八';
			break;
		case 9:
			month = '九';
			break;
		case 10:
			month = '十';
			break;
		case 11:
			month = '十一';
			break;
		case 12:
			month = '十二';
			break;	
		default:
		    month = '本'
	}
	return month;
}
module.exports = {
	random: random,
	getRandomStr: getRandomStr,
	dateYmd: dateYmd,
	dateYmdHis: dateYmdHis,
	transferredSingle: transferredSingle,
	returnMonth: returnMonth
}
