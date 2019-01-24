var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var fun = require('../../config/fun.js');
var async = require('async');

router.get('/homeList', function (req, res, next) {
    var params = req.query;
    var page = Number(params.page);
    var offset = 20 * (page - 1);
    async.series({
        one: function (callback) {
            fun.indexList(callback, offset);
        }
    }, function (err, result) {
        if (err) {
            data['code'] = 0;
            data['body'] = '查询错误';
        } else {
            data['code'] = 200;
            data['body'] = result.one;
        }
        res.json(data);
    })

});

router.get('/classifyList', function (req, res, next) {

    var params = req.query;
    var page = Number(params.page);
    var offset = 10 * (page - 1);
    if (params.type == 1) { //按时间排序
        var paixu = 'a.create_time';
    } else { //按热度排序
        var paixu = 'a.point_count';
    }
    async.parallel([
        function (callback) {
            var c_sql =
                "select a.id,a.title,a.cover,a.abstract,a.point_count,a.comment_count,a.attention_count,b.nick from th_article a left join th_user b on b.id=a.user_id where a.status=1 and a.classify_id='" +
                params.classify_id + "' order by " + paixu + " desc limit " + offset + ", 10";
            query(c_sql, function (err, vals, fields) {
                if (err) {
                    callback('err');
                } else {
                    callback(null, vals);
                }
            })
        },
        function (callback) {
            var t_sql = "select count(*) as total from th_article where status=1 and classify_id=" +
                params.classify_id;
            query(t_sql, function (err, vals, fields) {
                if (err) {
                    callback('err');
                } else {
                    callback(null, vals);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            data['code'] = 0;
            data['body'] = '查询错误';
        } else {
            data['code'] = 200;
            data['body'] = {
                list: result[0],
                count: result[1][0]['total']
            }
        }
        res.json(data);
    })
});

router.get('/userList', function (req, res, next) {

    var params = req.query;
    var page = Number(params.page);
    var offset = 10 * (page - 1);
    if (params.type == 1) { //按时间排序
        var paixu = 'a.create_time',
            status = 1;
    } else if (params.type == 2) { //按热度排序
        var paixu = 'a.point_count',
            status = 1;
    } else if (params.type == 3) { //待审核
        var paixu = 'a.create_time',
            status = 0;
    }
    async.parallel([
        function (callback) {
            var c_sql =
                "select a.id,a.title,a.cover,a.abstract,a.point_count,a.comment_count,a.attention_count,b.nick from th_article a left join th_user b on b.id=a.user_id where a.status='" + status + "' and a.user_id='" +
                params.user_id + "' order by " + paixu + " desc limit " + offset + ", 10";
            query(c_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 0);
                } else {
                    callback(null, vals);
                }
            })
        },
        function (callback) {
            var t_sql = "select count(*) as total from th_article where status='" + status + "' and user_id=" + params
                .user_id;
            query(t_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 1);
                } else {
                    callback(null, vals);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            data['code'] = result;
            data['body'] = '查询错误';
        } else {
            data['code'] = 200;
            data['body'] = {
                list: result[0],
                count: result[1][0]['total']
            }
        }
        res.json(data);
    })

});

//文章详情下推荐文章列表
router.get('/article/recommendList', function (req, res, next) {

    var params = req.query;

    async.waterfall([
        function (callback) {
            var s_sql = "select id,title,cover,abstract,point_count,comment_count,attention_count from th_article where id!='" + params.article_id + "' and classify_id = '" + params.classify_id + "' order by point_count desc limit 0,10";
            query(s_sql, function (err, vals, fields) {
                if (err) {
                    callback('err', 0);
                } else {
                    callback(null, vals);
                }
            })
        },
        function (list, callback) {
            if (list.length < 10) { //数据少于10条
                let a_sql = "select id,title,cover,abstract,point_count,comment_count,attention_count from th_article where id!='" + params.article_id + "' and first_id = '" + params.first_id + "' and classify_id!='" + params.classify_id + "' order by point_count desc limit 0,10";
                query(a_sql, function (err, vals, fields) {
                    if (err) {
                        callback('err', 1);
                    } else {
                        list = list.concat(vals);
                        callback(null, list);
                    }
                })
            } else {
                callback(null, list);
            }
        }
    ], function (err, result) {
        if (err) {
            data['code'] = result;
            data['body'] = '推荐文章列表请求失败';
        } else {
            data['code'] = 200;
            data['body'] = result;
        }
        res.json(data);
    })

})

//草稿箱列表
router.get('/draft/list', async function (req, res, next) {
    var params = req.query;

    if (req.userInfo == 0) {
        data['code'] = 200;
        data['body'] = '需要登录，请先登录';
        res.json('data');
        return false;
    } else {
        var user_id = req.userInfo.id;
    }

    if (params.page == 1) {
        var page = 0;
    } else {
        var page = 10 * (params.page - 1);
    }

    function findList() {
        return new Promise((resolve, reject) => {
            var s_sql = "select draft_sign,title,cover,abstract from th_draft where user_id = ? order by create_time desc limit ?,10";
            query(s_sql, [user_id,page], function (err, vals, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(vals);
                }
            })
        })
    }

    function findcount() {
        return new Promise((resolve, reject) => {
            var sql = "select count(*) as total from th_draft where user_id = ?";
            query(sql, [user_id], function (err, vals, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(vals[0].total);
                }
            })
        })
    }

    let list, err1, count, err2;
    let awaitlist = findList();
    let awaitcount = findcount();
    [err1, list] = await fun.to(awaitlist);
    [err2, count] = await fun.to(awaitcount);

    try {
        if (err1) throw err1;
        if (err2) throw err2;
        data['code'] = 200;
        data['body'] = {
            list: list,
            count: count
        }
    } catch (e) {
        data['code'] = 400;
        data['body'] = e;
    }
    res.json(data);

})

//封面图列表
router.get('/cover/list', async function (req, res, next) {
    
    if(req.userInfo==0) {
        data['code'] = 400;
        data['body'] = '请先登录';
    }
    var params = req.query;
    if (params.page == 1) {
        var page = 0;
    } else {
        var page = 10 * (params.page - 1);
    }    
    function findCover() {
        return new Promise((resolve,reject)=>{
            let sql = "select cover from th_article where cover!='' and user_id = ? and status = 1 group by cover order by create_time DESC limit ?,10";
            query(sql,[req.userInfo.id,page],(err,vals)=>{
                if(err) {
                    reject(err);
                }else {
                    resolve(vals);
                }
            })
        })
    }
    function findCount() {
        return new Promise((resolve,reject)=>{
            let sql = "select count(*) as total from th_article where cover!='' and user_id = ? and status = 1 group by cover";
            query(sql,[req.userInfo.id],(err,vals)=>{
                if(err) {
                    reject(err);
                }else {
                    resolve(vals[0].total);
                }
            })
        })
    }

    let err,vals,err2,count;
    let awaitlist = findCover();
    let awaitcount = findCount();    
    [err,vals] = await fun.to(awaitlist);
    [err2,count] = await fun.to(awaitcount);
    try{
        if(err) throw err;
        if(err2) throw err2;
        data['code'] = 200;
        data['body'] = {
            list: vals,
            count: count
        };
    }catch(e) {
        data['code'] = 400;
        data['body'] = e;
    }
    res.json(data);
})

module.exports = router;