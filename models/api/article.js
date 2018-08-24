var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var random = require('../../config/tool.js').random;
var transferredSingle = require('../../config/tool.js').transferredSingle;
var async = require('async');
var fs = require('fs');


router.post('/article', function (req, res, next) {

    if (typeof (req.userInfo.id) == 'undefined') {
        data['code'] = 0;
        data['body'] = '发表文章需要登录，请先登录';
        res.json(data);
        return false;
    }

    var userInfo = req.userInfo;
    var title = req.body.title;
    var cover = req.body.cover;
    var content = transferredSingle(req.body.content)  //转义单引号
    var word_id = req.body.word_id;
    var newclassify = req.body.newclassify;
    var classify_id = req.body.classify_id;
	var abs = transferredSingle(req.body.abs) //转义单引号
	var word_num = req.body.word_num;

    if (word_id) { //编辑

    } else { //新增
        var coverUrl = "";
        if (cover) { //有封面图
            var base64Data = cover.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            coverUrl = "/uploadImg/cover/" + random(8) + ".png";
            fs.writeFile("public" + coverUrl, dataBuffer, function (err) {});
        }
        var nowDate = (Date.parse(new Date()));
        async.waterfall([
            function (callback) {
                if (newclassify) {
                    var c_sql = "insert into th_classify (`value`,`status`,`article_num`)" +
                        " values ('" + newclassify + "','0','0')";
                    query(c_sql, function (err, vals, fields) {
                        if (err) {
                            callback('err', 1);
                        } else {
                            callback(null, vals.insertId, 0);
                        }
                    })
                } else {
                    callback(null, classify_id, 1);
                }
            },
            function (c_id, status, callback) {
				//文章类别加数量
				var c_sql = "update th_classify set article_num=article_num+1 where id='"+c_id+"'";
				query(c_sql,function(err, vals, fields) {});
				//添加文章
				var a_sql = 
                    "insert into th_article (`title`,`cover`,`content`,`create_time`,`user_id`,`update_time`,`status`,`classify`,`point_count`,`attention_count`,`comment_count`,`abstract`,`word_num`)" +
                    " values ('" + title + "','" + coverUrl + "','" + content + "','" + nowDate + "','" +
                    userInfo.id + "','" + nowDate + "','" + status + "','" + c_id + "','0','0','0','"+abs+"','"+word_num+"')";
				query(a_sql, function (err, vals, fields) {
                    if (err) {
                        callback('err', 2);
                    } else {
                        callback(null,c_id);
                    }
                })
            }
        ], function (err, result) {
            if (err) {
                data['code'] = result;
                data['body'] = '保存失败，请重试';
            } else {
                data['code'] = 200;
				if(newclassify) {
					data['body'] = '/u/' + userInfo.id + '?type=3';
				}else {
					data['body'] = '/u/'+ userInfo.id;
				}
            }
            res.json(data);
        })

    }

})



module.exports = router;
