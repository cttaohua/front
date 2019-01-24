var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var tool = require('../../config/tool.js');
const fun = require('../../config/fun.js');

// /* GET details page. */
router.get('/p/:id', function (req, res, next) {
	delete require.cache[require.resolve('../../config/env.js')];
    var env = require('../../config/env.js');
    var sign = req.params.id;
	env.header['userInfo'] = req.userInfo;
	
	async.waterfall([
		function(callback) {
			//文章信息
			var s_sql = "select * from th_article where article_sign ='"+sign+"'";
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
				if(err) {
					callback('err');
				}else {
					callback(null,word_msg,vals);
				}
			})
		},
		function(word_msg,user_msg,callback) {
			//喜欢不喜欢
			if(req.userInfo==0) {  //未登录
				callback(null,word_msg,user_msg,0);
			}else {
				var u_sql = "select * from th_like where user_id='"+req.userInfo.id+"' and article_id='"+word_msg[0].id+"' and islike=1";
				query(u_sql,function(err,vals,fields){
					if(err) {
						callback('err');
					}else {
						if(vals.length) {
							callback(null,word_msg,user_msg,1);
						}else {
							callback(null,word_msg,user_msg,0);
						}
					}
				})
			}
		},
		function(word_msg,user_msg,islike,callback) {
			//文章浏览数量更新
			var x_sql = "update th_article set point_count=point_count+1 where article_sign = '"+sign+"'";
			query(x_sql,function(err, vals, fields){
				if(err) {
					callback('err');
				}else {
					var obj = {
						word_msg: word_msg[0],
						user_msg: user_msg[0],
						islike: islike
					}
					env['meta']['title'] = obj.word_msg.title + ' - 桃花源';
					env['meta']['description'] = obj.word_msg.abstract;
					obj.word_msg.content = fun.imgReplace(obj.word_msg.content);
					callback(null,obj);
				}
			})
		}
	],function(err,result){
		if(err) {
			res.render('error/error');
		}else {
			res.render('details', {
				header: env.header,
				meta: env.meta,
				word_msg: result.word_msg,
				user_msg: result.user_msg,
				self_msg: req.userInfo,
				islike: result.islike
			});
		}
	})
});

module.exports = router;
