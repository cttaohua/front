var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var env = require('../../config/env.js');
var tool = require('../../config/tool.js');

// /* GET details page. */
router.get('/p/:id', function (req, res, next) {
    
    var word_id = req.params.id;
	env.header['index'] = 0;
	env.header['userInfo'] = req.userInfo;
	
	async.waterfall([
		function(callback) {
			//文章信息
			var s_sql = "select * from th_article where id='"+word_id+"'";
		    query(s_sql,function(err, vals, fields){
				if(err) {
					callback('err');
				}else if(!vals.length) {
					callback('err');
				}else {
					vals[0].update_time = tool.dateYmdHis(vals[0].update_time);
					callback(null, vals[0].user_id,vals);
				}
			})
		},
		function(user_id,word_msg,callback) {
			//用户信息
			var a_sql = "select * from th_user where id=" + user_id;
			query(a_sql,function(err,vals,fields){
				// console.log(vals);
				if(err) {
					callback('err');
				}else {
					callback(null,word_msg,vals);
				}
			})
		},
		function(word_msg,user_msg,callback) {
			//文章浏览数量更新
			var x_sql = "update th_article set point_count=point_count+1 where id = '"+word_id+"'";
			query(x_sql,function(err, vals, fields){
				if(err) {
					callback('err');
				}else {
					var obj = {
						word_msg: word_msg[0],
						user_msg: user_msg[0]
					}
					callback(null,obj);
				}
			})
		}
	],function(err,result){
		if(err) {
			res.render('error/error');
		}else {
			res.render('details', {
				title: '桃花源',
				version: env.version,
				header: env.header,
				word_msg: result.word_msg,
				user_msg: result.user_msg
			});
		}
	})
});

module.exports = router;
