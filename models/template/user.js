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
                    callback(null, vals[0]);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            res.render('error/error');
        } else {
            if(result[0].hasOwnProperty('id')) {
                env['meta']['title'] = result[0].nick + ' - 桃花源';
                if(result[0].intro!=null&&result[0].intro!='null') {
                    env['meta']['description'] = result[0].intro;
                }
                res.render('user', {
                    meta: env.meta,
                    header: env.header,
                    msg: result[0],
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
