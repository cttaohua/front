var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var env = require('../../config/env.js');
var async = require('async');



/* GET user page. */
router.get('/u/:id', function (req, res, next) {
	
    var user_id = req.params.id;
    env.header['index'] = 0;
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
            res.render('user', {
                title: result[0][0].nick + ' - 桃花源',
                version: env.version,
                header: env.header,
                msg: result[0][0],
				type: type,
				userFlag: userFlag  //为1是当前用户，为0是其它用户
            });
        }
    })

});

module.exports = router;
