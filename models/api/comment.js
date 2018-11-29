var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var async = require('async');
var tool = require('../../config/tool.js');

/* 文章喜欢/不喜欢 */
router.get('/islike', function (req, res, next) {

    var params = req.query;
    var user_id = req.userInfo.id;

    async.waterfall([
        function (callback) {
            var s_sql = "select * from th_like where user_id = '" + user_id + "' and article_id = " +
                params.article_id;
            query(s_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 0);
                } else {
                    if (vals.length) {
                        callback(null, 1);
                    } else {
                        callback(null, 2);
                    }
                }
            })
        },
        function (have, callback) {
            var nowtime = (Date.parse(new Date()));
            if (have == 1) { //之前有记录
                var u_sql = "update th_like set islike='" + params.islike + "',update_time='" + nowtime +
                    "' where user_id = '" + user_id + "' and article_id = " + params.article_id;
            } else { //第一次创建
                var u_sql =
                    "insert into th_like (`user_id`,`article_id`,`create_time`,`update_time`,`islike`)" +
                    " values ('" + user_id + "','" + params.article_id + "','" + nowtime + "','" +
                    nowtime + "',1)";
            }
            query(u_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 1);
                } else {
                    callback(null, params.islike);
                }
            })
        },
        function (islike, callback) {
            if (islike == 1) {
                var s_sql = "update th_article set attention_count=attention_count+1 where id=" +
                    params.article_id;
            } else {
                var s_sql = "update th_article set attention_count=attention_count-1 where id=" +
                    params.article_id;
            }
            query(s_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 2);
                } else {
                    callback(null,islike);
                }
            })
        },
		//用户的喜欢数量加减
		function(islike,callback) {
			if(islike==1) {
				var a_sql = "update th_user set like_num=like_num+1 where id=" + params.author_id;
			}else {
				var a_sql = "update th_user set like_num=like_num-1 where id=" + params.author_id;
			}
			query(a_sql,function(err,vals,fields){
				if(err) {
					callback('err',3);
				}else {
					callback(null);
				}
			})
		}
    ], function (err, result) {
        if (err) {
            data['code'] = result;
            data['body'] = '操作失败';
        } else {
            data['code'] = 200;
            data['body'] = '操作成功';
        }
        res.json(data);
    })

})


//发表评论
router.post('/publish/comment', function (req, res, next) {

    var params = req.body;
    var user_id = req.userInfo.id;
    var nowDate = (Date.parse(new Date()));

    async.waterfall([
        //先去查有几条记录
        function (callback) {
            var s_sql = "select count(*) as num from th_comment where article_id=" + params.article_id;
            query(s_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 0);
                } else {
                    callback(null, vals[0].num);
                }
            })
        },
        //新建一条评论
        function (num, callback) {
            num = num + 1;
            var c_sql =
                "insert into th_comment (`article_id`,`user_id`,`content`,`create_time`,`update_time`,`reply_count`,`floor`)" +
                " values ('" + params.article_id + "','" + user_id + "','" + params.content + "','" +
                nowDate + "','" + nowDate + "',0,'" + num + "')";
            query(c_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 1);
                } else {
                    callback(null, vals.insertId);
                }
            })
        },
        //查询这条评论
        function (id, callback) {
			//文章表里评论数量加1
			var a_sql = "update th_article set comment_count=comment_count+1 where id=" + params.article_id;
			query(a_sql,function(err,vals,fields){});
            var s_sql = "select * from th_comment where id=" + id;
            query(s_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 2);
                } else {
                    callback(null, vals[0]);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            data['code'] = result;
            data['body'] = '发表失败';
        } else {
            data['code'] = 200;
            data['body'] = result;
        }
        res.json(data);
    })



})

//获取评论列表
router.get('/commentList', function (req, res, next) {

    var params = req.query;
    var page = Number(params.page);
    var offset = 10 * (page - 1);
    if(req.userInfo!=0) {
		var user_id = req.userInfo.id;
	}else {
		var user_id = '';
	}

    async.waterfall([
        //查询评论条数
        function (callback) {
            var s_sql = "select count(*) as num from th_comment where article_id='" + params.article_id +
                "' ";
            query(s_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 0);
                } else {
                    callback(null, vals[0].num);
                }
            })
        },
        //查询评论列表
        function (num, callback) {
            if (num == 0) { //没有评论
                callback(null, [], num);
            } else { //有评论
                var s_sql = "select a.*,b.nick,b.head from th_comment a left join th_user b on b.id=a.user_id where a.article_id='" + params.article_id +
                    "' order by create_time desc limit " + offset + ", 10";
                query(s_sql, function (err, vals, fields) {
                    if (err) {
                        callback('err', 1);
                    } else {
                        callback(null, vals, num);
                    }
                })
            }
        },
        //循环查询赞
        function (arrs, num, callback) {
			var result_obj = {
				count: num,
			    list: arrs
			}
            if (arrs.length) { //有数据
                if(user_id!='') {  //已登录
					async.forEachOf(arrs, function (obj, key, turn) {
						var c_sql = "select count(*) as num from th_comment_praise where comment_id='"+arrs[key].id+"' and user_id='"+user_id+"' and status=1";
						query(c_sql,function(err,vals,fields){
							if(err) {
								turn('err');
							}else {
								if(vals[0].num==0) {
									arrs[key].isPraise = false;
								}else {
									arrs[key].isPraise = true;
								}
								if(arrs[key].reply_count!=0) {  //这条评论有回复
									var s_sql = "select *,(select nick from th_user where id = a.user_id) th_user_nick, (select nick from th_user where id = a.reply_person_id) th_reply_nick from th_comment_reply a where comment_id = " + arrs[key].id;
								    query(s_sql,function(err,vals,fields){
									    if(err) {
											turn('err');
										}else {
											arrs[key].reply_list = vals;
											turn();
										}
									})
								}else {  //没有回复
									arrs[key].reply_list = [];
									turn();
								}
							}
						})
					}, function (err) {
						if(err) {
							callback('err',2);
						}else {
							callback(null,result_obj);
						}
					});
				}else {  //未登录
					async.forEachOf(arrs,function(obj,key,turn){
						arrs[key].isPraise = false;
						if(arrs[key].reply_count!=0) {  //有回复
							var s_sql = "select *,(select nick from th_user where id = a.user_id) th_user_nick, (select nick from th_user where id = a.reply_person_id) th_reply_nick from th_comment_reply a where comment_id = " + arrs[key].id;
							query(s_sql,function(err,vals,fields){
								if(err) {
									turn('err');
								}else {
									arrs[key].reply_list = vals;
									turn();
								}
							})
						}else {  //没有回复
							arrs[key].reply_list = [];
							turn();
						}
					},function(err) {
						if(err) {
							callback('err',3);
						}else {
							callback(null,result_obj);
						}
					})
				}
            } else {  //没数据
                callback(null, result_obj);
            }
        }
    ], function (err, result) {
        if (err) {
            data['code'] = result;
            data['body'] = '评论加载失败';
        } else {
            data['code'] = 200;
            data['body'] = result;
        }
        res.json(data);
    })

})


//给评论点赞
router.get('/pointPraise',function(req,res,next){
	
	var params = req.query;
	var user_id = req.userInfo.id;
	
	async.parallel([
		//点赞或者取消赞
		function(callback) {
			var nowDate = Date.parse(new Date());
			var s_sql = "select count(*) as num from th_comment_praise where comment_id='"+params.comment_id+"' and user_id='"+user_id+"'";
			query(s_sql,function(err,vals,fields){
				if(err) {
					callback('err',0);
				}else {
					if(vals[0].num==0) { //之前没评论过
						var a_sql = "insert into th_comment_praise (`comment_id`,`user_id`,`status`,`create_time`,`update_time`)" +
						" values ('"+params.comment_id+"','"+user_id+"','1','"+nowDate+"','"+nowDate+"')";
					}else {  //之前评论过
						var a_sql = "update th_comment_praise set update_time='"+nowDate+"', status='"+params.type+"' where comment_id='"+params.comment_id+"' and user_id='"+user_id+"'";
					}
					query(a_sql,function(err,vals,fields){
						if(err) {
							callback('err',1);
						}
						else {
							callback(null);
						}
					})
				}
			})
		},
		//评论表里点赞数量修改
		function(callback) {
			if(params.type==1) {
				var u_sql = "update th_comment set praise_count=praise_count+1 where id = " + params.comment_id;
			}else {
				var u_sql = "update th_comment set praise_count=praise_count-1 where id = " + params.comment_id;
			}
			query(u_sql,function(err,vals,fields){
				if(err) {
					callback('err',2);
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

//回复评论 
router.post('/publish/reply',function(req,res,next){
	
	var params = req.body;
	var user_id = req.userInfo.id;
	
	async.waterfall([
		//回复表里加回复
		function(callback) {
			var nowDate = Date.parse(new Date());
			var a_sql = "insert into th_comment_reply (`comment_id`,`user_id`,`reply_person_id`,`content`,`create_time`,`update_time`,`status`)" + 
			" values ('"+params.comment_id+"','"+user_id+"','"+params.reply_id+"','"+params.content+"','"+nowDate+"','"+nowDate+"',1)";
		    query(a_sql,function(err,vals,fields){
				if(err) {
					callback('err',0);
				}else {
					callback(null,vals.insertId);
				}
			})
		},
		//查询添加的回复
		function(reply_id,callback) {
			//评论表回复数+1
			var a_sql = "update th_comment set reply_count=reply_count+1 where id="+params.comment_id;
			query(a_sql,function(err,vals,fields){});
			//查询回复信息
			var s_sql = "select a.*,b.nick as th_reply_nick from th_comment_reply a left join th_user b on b.id = a.reply_person_id where a.id=" + reply_id;
			query(s_sql,function(err,vals,fields){
				if(err) {
					callback('err',1);
				}else {
					vals[0].th_user_nick = req.userInfo.nick;
					callback(null,vals[0]);
				}
			})
		}
	],function(err,result){
		if(err) {
			data['code'] = result;
			data['body'] = '回复失败，请重试';
		}else {
			data['code'] = 200;
			data['body'] = result;
		}
		res.json(data);
	})
	
})



module.exports = router;
