var query = require('./node-mysql.js');
//查询分类函数
function selectClassify(callback) {
	var c_sql = 'select * from th_classify where status=1 order by article_num desc limit 20';
	query(c_sql,function(err, vals, fields){
		if(err) {
			callback('err');
		}else {
			callback(null,vals);
		}
	})
}

module.exports = {
	selectClassify: selectClassify
}