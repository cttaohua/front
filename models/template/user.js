var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');



/* GET user page. */
router.get('/u/:id', function (req, res, next) {
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
    var user_id = req.params.id;
    env.header['userInfo'] = req.userInfo;
	var type = req.query.type;
	//当前类型
	if(typeof type == 'undefined') {
		type = 1;
	}
    //当前用户判断
	if(user_id == req.userInfo.id) {  //为当前用户
		var userFlag = 1;
	}else {  //为其它用户
		var userFlag = 0;
	}
	
    async.parallel([
        function (callback) {
            var s_sql = "select * from th_user where id=" + user_id;
            query(s_sql, function (err, vals, fields) {
                if (err) {
                    callback('err');
                } else {
                    callback(null, vals);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            res.render('error/error');
        } else {
            var msg = result[0];
            if(!msg.length) {
                res.render('error/error'); 
                return false;
            } 
            msg = msg[0];
            if(msg.hasOwnProperty('id')) {
                env['meta']['title'] = msg.nick + ' - 桃花源';
                if(msg.intro!=null&&msg.intro!='null') {
                    env['meta']['description'] = msg.intro;
                }
                res.render('user', {
                    meta: env.meta,
                    header: env.header,
                    msg: msg,
                    type: type,   //列表类型 1最新文章 2热门排行 3待审核
                    userFlag: userFlag  //为1是当前用户，为0是其它用户
                });
            }else {
                res.render('error/error');
            }
        }
    })

});

module.exports = router;
