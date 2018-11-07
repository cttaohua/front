var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var random = require('../../config/tool.js').random;
var transferredSingle = require('../../config/tool.js').transferredSingle;
var async = require('async');
var fs = require('fs');
var multiparty = require('multiparty');


router.post('/article', function(req, res, next) {

	if (typeof(req.userInfo.id) == 'undefined') {
		data['code'] = 0;
		data['body'] = '发表文章需要登录，请先登录';
		res.json(data);
		return false;
	}

	var userInfo = req.userInfo;
	var title = req.body.title;
	var cover = req.body.cover;
	var content = transferredSingle(req.body.content); //转义单引号
	var text = transferredSingle(req.body.text); //转义单引号
	var word_id = req.body.word_id;
	var newclassify = req.body.newclassify;
	var c_first_id = req.body.c_first_id;
	var c_second_id = req.body.c_second_id;
	var abs = transferredSingle(req.body.abs); //转义单引号
	var word_num = req.body.word_num;

	if (word_id) { //编辑

	} else { //新增
		var coverUrl = "";
		if (cover) { //有封面图
			var base64Data = cover.replace(/^data:image\/\w+;base64,/, "");
			var dataBuffer = new Buffer(base64Data, 'base64');
			coverUrl = "/uploadImg/cover/" + random(8) + ".png";
			fs.writeFile("public" + coverUrl, dataBuffer, function(err) {});
		}
		var nowDate = (Date.parse(new Date()));
		async.waterfall([
			function(callback) {
				if (newclassify) {
					var c_sql = "insert into th_classify (`value`,`status`,`article_num`,`parent_id`,`create_time`)" +
						" values ('" + newclassify + "','0','0','"+c_first_id+"','"+nowDate+"')";
					query(c_sql, function(err, vals, fields) {
						if (err) {
							callback('err', 1);
						} else {
							callback(null, vals.insertId, 0);
						}
					})
				} else {
					callback(null, c_second_id, 1);
				}
			},
			function(c_id, status, callback) {
				//添加文章
				var a_sql =
					"insert into th_article (`title`,`cover`,`content`,`text`,`create_time`,`user_id`,`update_time`,`status`,`classify_id`,`point_count`,`attention_count`,`comment_count`,`abstract`,`word_num`)" +
					" values ('" + title + "','" + coverUrl + "','" + content + "', '" + text + "', '" + nowDate + "','" +
					userInfo.id + "','" + nowDate + "','" + status + "','" + c_id + "','0','0','0','" + abs + "','" + word_num +
					"')";
				query(a_sql, function(err, vals, fields) {
					if (err) {
						callback('err', 2);
					} else {
						callback(null, c_id);
					}
				})
			},
			function(c_id, callback) {
				//文章类别加数量
				var c_sql = "update th_classify set article_num=article_num+1 where id='" + c_id + "'";
				query(c_sql, function(err, vals, fields) {});
				//用户字数，文章加数量
				var s_sql = "update th_user set word_num=word_num+'" + word_num + "',article_num=article_num+1 where id=" +
					userInfo.id;
				query(s_sql, function(err, vals, fields) {});
				callback(null);
			}
		], function(err, result) {
			if (err) {
				data['code'] = result;
				data['body'] = '保存失败，请重试';
			} else {
				data['code'] = 200;
				if (newclassify) {
					data['body'] = '/u/' + userInfo.id + '?type=3';
				} else {
					data['body'] = '/u/' + userInfo.id;
				}
			}
			res.json(data);
		})

	}

})

//文章上传图片
router.post('/upload/acticle', function(req, res, next) {
	var date = new Date(),
		Y = date.getFullYear(),
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
	D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
	var nowDate = Y + M + D;
	var filePath = "public/uploadImg/article/" + nowDate + "/";

	async.waterfall([
		function(callback) {
			//检查文件目录是否存在
			fs.exists(filePath, function(exists) {
				if (exists) { //文件夹已存在
					callback(null, 1)
				} else { //文件夹不存在
					callback(null, 2);
				}
			})
		},
		function(type, callback) {
			if (type == 1) {
				callback(null);
			} else {
				fs.mkdir(filePath, function(err) {
					callback(null);
				})
			}
		},
		function(callback) {
			var form = new multiparty.Form(); //新建表单
			//设置
			form.encoding = 'utf-8';
			form.uploadDir = filePath;
			form.keepExtensions = true; //保留后缀
			form.maxFieldsSize = 2 * 1024 * 1024; //内存大小
			form.maxFilesSize = 5 * 1024 * 1024; //文件字节大小限制，超出会报错err 5M

			//表单解析
			form.parse(req, function(err, fields, files) {
				//报错处理
				if (err) {
					callback('err','请上传5M以内的图片');
				}
				var imgName;
				//获取路径
				Object.keys(files).forEach(function(name){
					imgName = name;
				})
				var oldpath = files[imgName][0].path;
				//文件后缀处理格式
				if (oldpath.indexOf('.jpg') >= 0) {
					var suffix = '.jpg';
				} else if (oldpath.indexOf('.png') >= 0) {
					var suffix = '.png';
				} else if (oldpath.indexOf('.gif') >= 0) {
					var suffix = '.gif';
				} else {
					callback('err','请上传正确格式');
				}

				var url = filePath + Date.now() + suffix;
				fs.renameSync(oldpath, url);
				url = url.slice(6,url.length);
				callback(null,url);
			})
		}
	], function(err, result) {
         if(err) {
			 var info = {
			 	"error": 1,
			 	"body": result
			 }
		 }else {
			 var info = {
			 	"errno": 0,
			 	"data": [
			 		result
			 	]
			 }
		 }
		 res.json(info);
	})


})

module.exports = router;
