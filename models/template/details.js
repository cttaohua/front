var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var env = require('../../config/env');
var tool = require('../../config/tool.js');

// /* GET details page. */
router.get('/p/:id', function (req, res, next) {
    
    var word_id = req.params.id;
	env.header['index'] = 0;
	env.header['userInfo'] = req.userInfo;
	
	async.parallel([
		function(callback) {
			var s_sql = "select a.*,b.* from th_article a left join th_user b on a.user_id=b.id where a.id='"+word_id+"'";
		    query(s_sql,function(err, vals, fields){
				if(err) {
					callback('err');
				}else if(!vals.length) {
					callback('err');
				}else {
					vals[0].update_time = tool.dateYmdHis(vals[0].update_time);
					callback(null,vals);
				}
			})
		},
		function(callback) {
			//文章浏览数量更新
			var x_sql = "update th_article set point_count=point_count+1 where id = '"+word_id+"'";
			query(x_sql,function(err, vals, fields){
				if(err) {
					callback('err');
				}else {
					callback(null);
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
				msg: result[0][0]
			});
		}
	})
});

module.exports = router;
