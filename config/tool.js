//产生n位随机数
function random(num) {
    var integer = '1';
    for (var i = 0; i < (num); i++) {
        integer = integer + '0';
    }
    return Math.floor(Math.random() * (integer));
}
//根据时间戳返回年月日的时间
function dateYmd(timestamp) {
    var date = new Date(Number(timestamp));
    Y = date.getFullYear() + '.';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
    return Y + M + D;
}
//根据时间戳返回年月日时分秒的时间
function dateYmdHis(timestamp) {
    var date = new Date(Number(timestamp));
    Y = date.getFullYear() + '.';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate() + ' ';
    h = ' ' + date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y + M + D + h + m + s;
}
//转义单引号
function transferredSingle(str) {
	return str.replace(/'/g,'&apos;');
}
module.exports = {
    random: random,
    dateYmd: dateYmd,
    dateYmdHis: dateYmdHis,
	transferredSingle: transferredSingle
}
