var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var async = require('async');
var fun = require('../../config/fun.js');
const tool = require('../../config/tool.js');

//注册接口
router.post('/register', function (req, res, next) {

    var user_name = req.body['user_name'];
    var user_phone = req.body['user_phone'];
	var user_password = fun.encodeStr(req.body['user_password']);

    async.series({
        one: function (callback) {
            var phoneSql = "select * from th_user where account='" + user_phone + "'";
            query(phoneSql, function (err, vals, fields) {
                if (vals.length) { //用户存在
                    callback('err');
                } else { //可注册
                    callback(null);
                }
            })
        },
        two: function (callback) {
			var nowDate = (Date.parse(new Date())); 
			var r = tool.getRandomStr();
            var addSql = "insert into th_user (`sign`,`account`,`nick`,`password`,`create_time`)" +
                " values ('" + r + "','" + user_phone + "','" + user_name + "','" + user_password + "','" +
                nowDate + "')";
            query(addSql, function (err, vals, fields) {
                if (err) {
                    callback('err', 1);
                } else {
                    callback(null);
                }
            })
        }
    }, function (err, result) {
        if (err) {
            if (result[two] == 1) {
                data['code'] = 1;
                data['body'] = '注册失败';
            } else {
                data['code'] = 2;
                data['body'] = '该手机号已经被注册';
            }
        } else {
            data['code'] = 200;
            data['body'] = '注册成功';
        }
        res.json(data);
    })

});

//登录接口
router.post('/login', function (req, res, next) {
    var user_phone = req.body.user_phone;
	var user_password = req.body.user_password;
	
	if(!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test( user_phone )) ) {
		data['code'] = 0;
		data['body'] = '请输入正确的手机号';
		res.json(data);
		return false;
	}
	
	if(user_password.length<6) {
		data['code'] = 0;
		data['body'] = '密码长度必须大于6位';
		res.json(data);
		return false;
	}
	
	async.series({
		one: function(callback) {
			var s_sql = "select * from th_user where account='" + user_phone + "'";
			query(s_sql,function(err, vals, fields){
				if(err) {
					callback('err',1);
					return false;
				}
				if(vals.length) { //用户存在
					var password = fun.decodeStr(vals[0].password);  //解密
					if(user_password == password) {  //密码正确
						callback(null,vals[0]);
					}else {   //密码错误
						callback('err',2);
					}
				}else {
					callback('err',1);
				}
			})
		}
	},function(err,result){
		if(err) {
			if(result.one==1) {
				data['code'] = 1;
				data['body'] = '此手机号没有注册，请先注册';
			}else {
				data['code'] = 2;
				data['body'] = '密码错误';
			}
		}else {
			data['code'] = 200;
			data['body'] = result.one;
			//将用户id存入cookie中 用户信息存入session中
			var user_msg = JSON.stringify(result.one);
			var user_base = new Buffer(user_msg).toString('base64');
			var user_base_id = fun.encodeStr(String(result.one.id));
			req.session.userInfo = user_base;
			res.cookie("userId",user_base_id,{maxAge: 30*24*60*60*1000});
		}
		res.json(data);
	})
	
})

module.exports = router;
