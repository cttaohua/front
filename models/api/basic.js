var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var random = require('../../config/tool.js').random;
var async = require('async');
var fs = require('fs');

//查询所有分类
router.get('/getClassify', function (req, res, next) {
    var c_sql = "select * from th_classify where status=1";
    query(c_sql, function (err, vals, filds) {
        if (err) {
            data['code'] = 0;
            data['body'] = '查询失败';
        } else {
            if (vals.length) {
                data['code'] = 200;
                data['body'] = vals;
            } else {
                data['code'] = 1;
                data['body'] = '没有分类';
            }
        }
        res.json(data);
    })
})

//保存个人介绍
router.post('/saveIntro', function (req, res, next) {
    var params = req.body;
    var user_id = req.userInfo.id;

    var u_sql = "update th_user set intro='" + params.intro + "' where id=" + user_id;
    query(u_sql, function (err, vals, filds) {
        if (err) {
            data['code'] = 0;
            data['body'] = err;
        } else {
            data['code'] = 200;
            data['body'] = '保存成功';
        }
        res.json(data);
    })

})

//保存基础设置
router.post('/saveMeans', function (req, res, next) {

    var params = req.body;
    var user_id = req.userInfo.id;
    var headUrl = 0;

    async.waterfall([
		function(callback) {
			if (params.head != '') { //更改了头像
				var h_sql = "select head from th_user where id=" + user_id;
				query(h_sql,function(err,vals,filds){
					if(err) {
						callback('err',0);
					}else {
						if(vals[0].head!=0) {  //之前有头像
							fs.unlink("public" + vals[0].head,function(err){})
						}
						var base64Data = params.head.replace(/^data:image\/\w+;base64,/, "");
						var dataBuffer = new Buffer(base64Data, 'base64');
						headUrl = "/uploadImg/head/" + random(8) + ".png";
						fs.writeFile("public" + headUrl, dataBuffer, function (err) {});
						callback(null);
					}
				})
			}else {
				callback(null);
			}
		},
        function (callback) {
            if (headUrl != 0) {
                var u_sql = "update th_user set nick='" + params.nick + "',head='" + headUrl +
                    "',sex='" + params.sex + "' where id =" + user_id;
            } else {
                var u_sql = "update th_user set nick='" + params.nick + "',sex='" + params.sex +
                    "' where id =" + user_id;
            }
            query(u_sql, function (err, vals, filds) {
                if (err) {
                    callback('err', 1);
                } else {
                    callback(null);
                }
            })
        },
        function (callback) {
            var s_sql = "select * from th_user where id=" + user_id;
            query(s_sql, function (err, vals, filds) {
                if (err) {
                    callback('err', 2);
                } else {
                    callback(null, vals);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            data['code'] = result;
            data['body'] = '保存失败';
        } else {
            data['code'] = 200;
            data['body'] = result[0];
            //将用户信息存入cookie中 
            var user_msg = JSON.stringify(result[0]);
            var user_base = new Buffer(user_msg).toString('base64');
            res.cookie('userInfo', user_base, {
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
        }
        res.json(data);
    })


})

//保存收款设置
router.post('/savereward', function (req, res, next) {

    var params = req.body;
    var user_id = req.userInfo.id;
    var codeUrl = 0;

    
    async.waterfall([
		function(callback) {
			if (params.receipt_code != '') { //上传了二维码
			    var h_sql = "select receipt_code from th_user where id=" + user_id;
			    query(h_sql,function(err,vals,filds){
			    	if(err) {
			    		callback('err',0);
			    	}else {
			    		if(vals[0].head!=0) {  //之前有头像
			    			fs.unlink("public" + vals[0].receipt_code,function(err){})
			    		}
			    		var base64Data = params.receipt_code.replace(/^data:image\/\w+;base64,/, "");
			    		var dataBuffer = new Buffer(base64Data, 'base64');
			    		codeUrl = "/uploadImg/code/" + random(8) + ".png";
			    		fs.writeFile("public" + codeUrl, dataBuffer, function (err) {});
			    		callback(null);
			    	}
			    })
			}else {
				callback(null);
			}
		},
        function (callback) {
            if (codeUrl != 0) {
                var u_sql = "update th_user set reward='" + params.reward + "',receipt_code='" +
                    codeUrl + "' where id=" + user_id;
            } else {
                var u_sql = "update th_user set reward='" + params.reward + "' where id=" + user_id;
            }
            query(u_sql, function (err, vals, filds) {
                if (err) {
                    callback('err', 1);
                } else {
                    callback(null);
                }
            })
        },
        function (callback) {
            var s_sql = "select * from th_user where id=" + user_id;
            query(s_sql, function (err, vals, filds) {
                if (err) {
                    callback('err', 2);
                } else {
                    callback(null, vals);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            data['code'] = result;
            data['body'] = '保存失败';
        } else {
            data['code'] = 200;
            data['body'] = '保存成功';
            //将用户信息存入cookie中 
            var user_msg = JSON.stringify(result[0]);
            var user_base = new Buffer(user_msg).toString('base64');
            res.cookie('userInfo', user_base, {
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
        }
        res.json(data);
    })




})

module.exports = router;
