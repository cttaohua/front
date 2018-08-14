var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var async = require('async');

router.get('/home',function(req, res, next){
	var params = req.query;
	var page = Number(params.page);
	var offset = 20*(page-1);
	async.series({
		one: function(callback) {
			var c_sql = "select a.*,b.nick from th_article a left join th_user b on b.id=a.user_id where a.status=1 order by a.create_time desc limit "+offset+", 20";
			query(c_sql,function(err, vals, fields){
				if(err) {
					callback('err',1);
				}else {
					callback(null,vals);
				}
			})
		}
	},function(err,result){
		if(err) {
			data['code'] = 0;
			data['body'] = '查询出错';
		}else {
			data['code'] = 200;
			data['body'] = result.one;
		}
		res.json(data);
	})
	
})

router.get('/classifyList',function(req, res, next){
	
	var params = req.query;
	var page = Number(params.page);
	var offset = 10*(page-1);
	if(params.type==1) {  //按时间排序
		var paixu = 'a.create_time';
	}else {  //按热度排序
		var paixu = 'a.point_count';
	}
	async.parallel([
		function(callback) {
			var c_sql = "select a.*,b.nick from th_article a left join th_user b on b.id=a.user_id where a.status=1 and a.classify='"+params.classify_id+"' order by "+paixu+" desc limit "+offset+", 10";
		    query(c_sql,function(err, vals, fields){
				if(err) {
					callback('err');
				}else {
					callback(null,vals);
				}
			})
		},
		function(callback) {
			var t_sql = "select count(*) as total from th_article where status=1 and classify=" + params.classify_id;
			query(t_sql,function(err,vals,fields){
				if(err) {
					callback('err');
				}else {
					callback(null,vals);
				}
			})
		}
	],function(err,result){
		if(err) {
			data['code'] = 0;
			data['body'] = '请求失败';
		}else {
			data['code'] = 200;
			data['body'] = {
				list: result[0],
				count: result[1][0]['total']
			}
		}
		res.json(data);
	})
})


module.exports = router;