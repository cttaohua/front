var query = require('./node-mysql.js');
//查询分类函数
function selectClassify(callback) {
	var c_sql = 'select * from th_classify where status=1 order by article_num desc limit 30';
	query(c_sql,function(err, vals, fields){
		if(err) {
			callback('err');
		}else {
			callback(null,vals);
		}
	})
}
//首页文章列表函数
function indexList(callback,offset) {
	var c_sql = "select a.*,b.nick from th_article a left join th_user b on b.id=a.user_id where a.status=1 order by a.create_time desc limit "+offset+", 20";
	query(c_sql,function(err, vals, fields){
		if(err) {
			callback('err',1);
		}else {
			callback(null,vals);
		}
	})
}
module.exports = {
	selectClassify: selectClassify,
	indexList: indexList
}