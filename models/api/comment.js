var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var async = require('async');

router.get('/islike',function(req, res, next) {
	
	var params = req.query;
	var user_id = req.userInfo.id;
	
	async.waterfall([
		function(callback) {
			var s_sql = "select * from th_like where user_id = '"+user_id+"' and article_id = " + params.article_id;
		    query(s_sql,function(err,vals,fields){
				if(err) {
					callback('err',0);
				}else {
					if(vals.length) {
						callback(null,1);
					}else {
						callback(null,2);
					}
				}
			})
		},
		function(have,callback) {
			var nowtime = (Date.parse(new Date()));
			if(have==1) {  //之前有记录
				var u_sql = "update th_like set islike='"+params.islike+"',update_time='"+nowtime+"' where user_id = '"+user_id+"' and article_id = " + params.article_id;
			}else {  //第一次创建
				var u_sql = "insert into th_like (`user_id`,`article_id`,`create_time`,`update_time`,`islike`)"+
				" values ('"+user_id+"','"+params.article_id+"','"+nowtime+"','"+nowtime+"',1)";
			}
			query(u_sql,function(err,vals,fields){
				if(err) {
					callback('err',1);
				}else {
					callback(null);
				}
			})
		}
	],function(err,result){
		if(err) {
			data['code'] = result;
			data['body'] = '操作失败';
		}else {
			data['code'] = 200;
			data['body'] = '操作成功';
		}
		res.json(data);
	})
	
})

module.exports = router;