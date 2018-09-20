var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var async = require('async');


router.get('/search',function(req,res,next){
	
	var params = req.query;
	var page = Number(params.page);
	var offset = 10 * (page - 1);
	
	var type = params.type;
	var sequence;
	if(type==1) {
		sequence = "point_count desc, update_time desc";
	}else if(type==2) {
		sequence = "point_count desc";
	}else if(type==3) {
		sequence = "update_time desc";
	}
	
	async.parallel([
		function(callback) {
			var s_sql = "select count(*) as num from th_article where title like '%"+params.key+"%' and status=1 order by "+sequence+" limit "+offset+",10";
		    query(s_sql,function(err,vals,fields){
				if(err) {
					callback('err,',1)
				}else {
					callback(null,vals[0].num);
				}
			})
		},
		function(callback) {
			var s_sql = "select * from th_article where title like '%"+params.key+"%' and status=1 order by "+sequence+" limit "+offset+",10";
			query(s_sql,function(err,vals,fields){
				if(err) {
					callback('err',2);
				}else {
					callback(null,vals);
				}
			})
		}
	],function(err,result){
		if(err) {
			data['code'] = 0;
			data['body'] = '查询无结果';
		}else {
			data['code'] = 200;
			data['body'] = {
				count: result[0],
				list: result[1]
			}
		}
		res.json(data);
	})
	
})

router.post('/submit/issue',function(req,res,next){
	
	var params = req.body;
	var nowDate = Date.parse(new Date());
	
	async.parallel([
		function(callback) {
			var sql = "insert into th_issue (`problem`,`contact`,`create_time`,`status`)" +
			" values ('"+params.problem+"','"+params.contact+"','"+nowDate+"','1')";
			query(sql,function(err,vals,fields){
				if(err) {
					callback('err',0); 
				}else {
					callback(null);
				}
			})
		}
	],function(err,result){
		if(err) {
			data['code'] = 0;
			data['body'] = '提交失败，请稍后重试';
		}else {
			data['code'] = 200;
			data['body'] = '提交成功';
		}
		res.json(data);
	})
	
	
})


module.exports = router;