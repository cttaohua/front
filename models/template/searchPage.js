var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');

var async = require('async');

/* GET user page. */
router.get('/search', function (req, res, next) {
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
	env.header['userInfo'] = req.userInfo;
	
	var params = req.query;
	
	env['meta']['title'] = '搜索 - 桃花源';
	
	async.parallel([
		function(callback) {
			if(typeof (params['key'])=='undefined') {
				callback('err',1);
			}
			env.header['search'] = params['key'];
			callback(null);
		},
		//增加搜索记录
		function(callback) {
			if(params.key!='') {
				var nowDate = Date.parse(new Date());
				var s_sql = "select count(*) as num from th_search where content='"+params.key+"'";
				query(s_sql,function(err,vals,fields){
					if(err) {
						//nothing
					}else {
						if(vals[0].num!=0) {  //之前搜索过
							var a_sql = "update th_search set count=count+1,update_time='"+nowDate+"' where content='"+params.key+"'";
						}else {  //之前没搜索过
							var a_sql = "insert into th_search (`content`,`create_time`,`update_time`,`count`) values ('"+params.key+"','"+nowDate+"','"+nowDate+"',1)";
						}
						query(a_sql,function(err,vals,fields){});
					}
				})
			}
			callback(null);
		},
		//查询搜索热度前十的关键词
		function(callback) {
			var s_sql = "select * from th_search order by count desc limit 0,10";
			query(s_sql,function(err,vals,fields){
				if(err) {
					callback('err',3);
				}else {
					callback(null,vals);
				}
			})
		}
	],function(err,result){
		if(err) {
			res.render('error/error');
		}else {
			res.render('search', {
				header: env.header,
				meta: env.meta,
				key: params['key'],
				hotkey: result[2]
			});
		}
	})
})

module.exports = router;
