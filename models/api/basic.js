var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
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
    console.log(req.body);
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


module.exports = router;
