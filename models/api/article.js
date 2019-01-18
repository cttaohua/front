var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
const db = require('../../db/package.js');
var data = require('../../config/env.js').data;
var random = require('../../config/tool.js').random;
var getRandomStr = require('../../config/tool.js').getRandomStr;
var transferredSingle = require('../../config/tool.js').transferredSingle;
var async = require('async');
var fs = require('fs');
var multiparty = require('multiparty');
// const images = require("images");


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
    var draft_id = req.body.draft_id;
    var newclassify = req.body.newclassify;
    var c_first_id = req.body.c_first_id;
    var c_second_id = req.body.c_second_id;
    var abs = transferredSingle(req.body.abs); //转义单引号
    var word_num = req.body.word_num;

    var nowDate = (Date.parse(new Date()));
    if (word_id) { //编辑
        async.waterfall([
            function(callback) {
                var coverUrl = "";
                if (cover.length < 100) { //没更新封面图
                    callback(null, cover);
                } else { //更新了封面图
                    let s_sql = "select cover from th_article where id=" + word_id;
                    query(s_sql, function(err, vals) {
                        if (err) {
                            callback('err', 0);
                        } else {
                            if (vals[0].cover.length) {
                                fs.unlink("public" + vals[0].cover, function(err) {});
                            }
                            var base64Data = cover.replace(/^data:image\/\w+;base64,/, "");
                            var dataBuffer = new Buffer(base64Data, 'base64');
                            coverUrl = "/uploadImg/cover/" + random(8) + ".png";
                            fs.writeFile("public" + coverUrl, dataBuffer, function(err) {});
                            callback(null, coverUrl);
                        }
                    })
                }
            },
            function(coverUrl, callback) {
                if (newclassify) {
                    var c_sql = "insert into th_classify (`value`,`status`,`article_num`,`parent_id`,`create_time`)" +
                        " values ('" + newclassify + "','0','0','" + c_first_id + "','" + nowDate + "')";
                    query(c_sql, function(err, vals, fields) {
                        if (err) {
                            callback('err', 1);
                        } else {
                            callback(null, vals.insertId, coverUrl);
                        }
                    })
                } else {
                    callback(null, c_second_id, coverUrl);
                }
            },
            function(c_id, coverUrl, callback) {
                //查询现有文章字数
                let f_sql = "select word_num from th_article where id=?";
                query(f_sql, [word_id], function(err, vals, fields) {
                    if (err) {
                        callback('err', 2);
                    } else {
                        callback(null, vals[0].word_num, c_id, coverUrl);
                    }
                })
            },
            function(origin_num, c_id, coverUrl, callback) {
                //修改文章
                if (newclassify) {
                    var status = 0;
                } else {
                    var status = 1;
                }

                let setObj = {
                    title: title,
                    cover: coverUrl,
                    content: content,
                    text: text,
                    update_time: nowDate,
                    status: status,
                    first_id: c_first_id,
                    classify_id: c_id,
                    abstract: abs,
                    word_num: word_num
                }
                let whereObj = {
                    id: word_id
                }

                db.update('th_article', setObj, whereObj, function(err, vals) {
                    if (err) {
                        callback('err', 3);
                    } else {
                        callback(null);
                    }
                })

                let gap = Number(origin_num) - Number(word_num);
                if (Number(gap) > 0) { //比之前字数多
                    var changeNum = 'word_num=word_num+' + Math.abs(gap);
                } else if (Number(gap) < 0) { //比之前字数少
                    var changeNum = 'word_num=word_num-' + Math.abs(gap);
                } else { //不变
                    var changeNum = 0;
                }
                if (changeNum != 0) {
                    let a_sql = "update th_user set " + changeNum + " where id=?";
                    query(a_sql, [userInfo.id], function(err, vals, fields) {});
                }
            }
        ], function(err, result) {
            if (err) {
                data['code'] = result;
                data['body'] = '保存失败，请重试';
            } else {
                data['code'] = 200;
                data['body'] = '/p/' + word_id;
            }
            res.json(data);
        })

    } else { //新增
        var coverUrl = "";
        if (cover.length>100) { //更新了封面图
            var base64Data = cover.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            coverUrl = "/uploadImg/cover/" + random(8) + ".png";
            fs.writeFile("public" + coverUrl, dataBuffer, function(err) {});
        }else {
            coverUrl = cover;
        }
        async.waterfall([
            function(callback) {
                if (newclassify) {
                    var c_sql = "insert into th_classify (`value`,`status`,`article_num`,`parent_id`,`create_time`)" +
                        " values ('" + newclassify + "','0','0','" + c_first_id + "','" + nowDate + "')";
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
                    "insert into th_article (`title`,`cover`,`content`,`text`,`create_time`,`user_id`,`update_time`,`status`,`first_id`,`classify_id`,`point_count`,`attention_count`,`comment_count`,`abstract`,`word_num`)" +
                    " values ('" + title + "','" + coverUrl + "','" + content + "', '" + text + "', '" + nowDate + "','" +
                    userInfo.id + "','" + nowDate + "','" + status + "','" + c_first_id + "','" + c_id + "','0','0','0','" + abs + "','" + word_num +
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
                //文章二级类别加数量
                var c_sql = "update th_classify set article_num=article_num+1 where id='" + c_id + "'";
                query(c_sql, function(err, vals, fields) {});
                //文章一级类别加数量
                var a_sql = "update th_classify_first set article_num=article_num+1 where id='" + c_first_id + "'";
                query(a_sql, function(err, vals, fields) {});
                //删除草稿箱里的文章
                if(draft_id) {
                    var b_sql = "delete from th_draft where id = ?";
                    query(b_sql,[draft_id],function(err,vals,fields){});
                }
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
        Y = date.getFullYear().toString(),
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString(),
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
                    callback('err', '请上传5M以内的图片');
                }
                var imgName;
                //获取路径
                Object.keys(files).forEach(function(name) {
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
                    callback('err', '请上传正确格式');
                }

                var url = filePath + Date.now() + suffix;
                fs.renameSync(oldpath, url);

                //压缩图片
                // if (images(url).width() > 2000) { //如果图片过大，则强行压缩
                //     images(url)
                //         .size(1000)
                //         .save(url, {
                //             quality: 50
                //         });
                // } else {
                //     images(url)
                //         .save(url, {
                //             quality: 50
                //         });
                // }

                //截取URL
                url = url.slice(6, url.length);
                callback(null, url);
            })
        }
    ], function(err, result) {
        if (err) {
            var info = {
                "error": 1,
                "body": result
            }
        } else {
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

//保存为草稿
router.post('/save/draft', function(req, res, next) {

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
    var draft_id = req.body.draft_id;
    var new_classify = req.body.new_classify;
    var c_first_id = req.body.c_first_id;
    var c_second_id = req.body.c_second_id;
    var abs = transferredSingle(req.body.abs); //转义单引号
    var word_num = req.body.word_num;

    var nowDate = (Date.parse(new Date()));

    if (draft_id) { //编辑草稿
        async.waterfall([
            function(callback) {
                var coverUrl = "";
                if (cover.length < 100) { //没更新封面图
                    callback(null, cover);
                } else { //更新了封面图
                    let s_sql = "select cover from th_draft where id=" + draft_id;
                    query(s_sql, function(err, vals) {
                        if (err) {
                            callback('err', 0);
                        } else {
                            if (vals[0].cover.length) {
                                fs.unlink("public" + vals[0].cover, function(err) {});
                            }
                            var base64Data = cover.replace(/^data:image\/\w+;base64,/, "");
                            var dataBuffer = new Buffer(base64Data, 'base64');
                            coverUrl = "/uploadImg/cover/" + random(8) + ".png";
                            fs.writeFile("public" + coverUrl, dataBuffer, function(err) {});
                            callback(null, coverUrl);
                        }
                    })
                }
            },
            function(coverUrl, callback) {
                //修改草稿

                let setObj = {
                    title: title,
                    cover: coverUrl,
                    content: content,
                    text: text,
                    update_time: nowDate,
                    status: 1,
                    first_id: c_first_id,
                    classify_id: c_second_id,
                    abstract: abs,
                    word_num: word_num
                }
                let whereObj = {
                    id: draft_id
                }

                db.update('th_draft', setObj, whereObj, function(err, vals) {
                    if (err) {
                        callback('err', 3);
                    } else {
                        callback(null);
                    }
                })
            }
        ], function(err, result) {
            if (err) {
                data['code'] = result;
                data['body'] = '保存失败，请重试';
            } else {
                data['code'] = 200;
                data['body'] = '/article/draft';
            }
            res.json(data);
        })

    } else { //新增草稿
        var coverUrl = "";
        if (cover) { //有封面图
            var base64Data = cover.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');
            coverUrl = "/uploadImg/cover/" + random(8) + ".png";
            fs.writeFile("public" + coverUrl, dataBuffer, function(err) {});
        }
        async.waterfall([
            function(callback) {
                //添加文章
                var r = getRandomStr();
                let insert_obj = {
                    draft_sign: r,
                    title: title,
                    cover: coverUrl,
                    content: content,
                    text: text,
                    create_time: nowDate,
                    user_id: userInfo.id,
                    update_time: nowDate,
                    status: 1,
                    first_id: c_first_id?c_first_id:null,
                    classify_id: c_second_id?c_second_id:null,
                    new_classify: new_classify?new_classify:null,
                    abstract: abs,
                    word_num: word_num
                }    
                db.insert('th_draft', insert_obj, function(err, vals) {
                    if (err) {
                        callback('err', err);
                    } else {
                        callback(null);
                    }
                })
            }
        ], function(err, result) {
            console.log(result);
            if (err) {
                data['code'] = result;
                data['body'] = '保存失败，请重试';
            } else {
                data['code'] = 200;
                data['body'] = '/article/draft';
            }
            res.json(data);
        })

    }
})

module.exports = router;