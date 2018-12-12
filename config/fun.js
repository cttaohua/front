var query = require('./node-mysql.js');
var crypto = require('crypto');
var secret = require('./env.js').secret;
var tool = require('./tool.js');
//查询分类函数
function selectClassify(callback) {
	var c_sql = 'select a.*,b.cover as img from th_classify a left join th_classify_first b on b.id=a.parent_id where a.status=1 order by a.article_num desc limit 30';
	query(c_sql,function(err, vals, fields){
		if(err) {
			callback('err');
		}else {
			var m = new Date().getMonth() + 1;
			var month = tool.returnMonth(m);
			let commend = vals.slice(0,6);
			var obj = {
				commend: commend,
				list: vals,
				month: month
			}
			callback(null,obj);
		}
	})
}
//首页文章列表函数
function indexList(callback,offset) {
	var c_sql = "select a.id,a.title,a.cover,a.abstract,a.point_count,a.comment_count,a.attention_count,b.nick from th_article a left join th_user b on b.id=a.user_id where a.status=1 order by a.create_time desc limit "+offset+", 20";
	query(c_sql,function(err, vals, fields){
		if(err) {
			callback('err',1);
		}else {
			callback(null,vals);
		}
	})
}
//加密函数
function encodeStr(str) {
	var encode = JSON.stringify(str);
	var cipher = crypto.createCipher('aes192',secret);
	var enc = cipher.update(str,'utf8','hex');
	enc += cipher.final('hex');
	return enc;
}
//解密函数
function decodeStr(str) {
	var decipher = crypto.createDecipher('aes192', secret);
	var dec = decipher.update(str, 'hex', 'utf8'); 
	dec += decipher.final('utf8'); 
	return dec;
}
//img正则替换
function imgReplace(str) {
    var reg = /<img\b.*?(?:\>|\/>)/gi;
    return str.replace(reg,function(match,pos,orginText){
    	return '<div style="width:700px;margin-left:-40px;">'+match+'</div>';
    })
}
module.exports = {
	selectClassify: selectClassify,
	indexList: indexList,
	encodeStr: encodeStr,
	decodeStr: decodeStr,
	imgReplace: imgReplace
}