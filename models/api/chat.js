var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
const fun = require('../../config/fun.js');

//查询联系人列表
router.get('/getContacts/list', async function(req,res,next){

    if(req.userInfo==0) {  //未登录
        data['code'] = '400';
        data['body'] = '请先登录';
        res.json(data);
        return false;
    }

    function selectList() {
        return new Promise((resolve,reject)=>{
            var sql = "select a.*,b.head,b.nick,b.intro from th_contacts a left join th_user b on a.relation_id = b.id where a.user_id=? order by lately_time DESC";
            query(sql,[req.userInfo.id],function(err,vals,fields){
                if(err) {
                    reject(err);
                }else {
                    resolve(vals);
                }
            })
        })
    }

    let err,contacs;
    [err,contacs] = await fun.to(selectList());
    
    try {
        if(err) throw err;
        data['code'] = 200;
        data['body'] = contacs;
    }catch(e) {
        data['code'] = 400;
        data['body'] = '查询失败';
    }
    res.json(data);

})

//查询单个的联系人
router.get('/getContacts/single', async function(req,res,next){

    if(req.userInfo==0) {  //未登录
        data['code'] = '400';
        data['body'] = '请先登录';
        res.json(data);
        return false;
    }

    let params = req.query,
        relation_id = params.relation_id;
    
    function selectSingle() {
        return new Promise((resolve,reject)=>{
            let sql = "select a.*,b.head,b.nick,b.intro from th_contacts a left join th_user b on a.relation_id = b.id where a.user_id = ? and a.relation_id = ?";
            query(sql,[req.userInfo.id,relation_id],function(err,vals,fileds){
                if(err) {
                    reject(err);
                }else {
                    resolve(vals);
                }
            })
        })
    }    

    let err,single;
    [err,single] = await fun.to(selectSingle());
    
    try{
        if(err) throw err;
        data['code'] = 200;
        data['body'] = single[0];
    }catch(e) {
        data['code'] = 400;
        data['body'] = '查询失败';
    }
    res.json(data);

})

//查询聊天记录
router.get('/getChat/list', async function(req,res,next){

    if(req.userInfo==0) {  //未登录
        data['code'] = '400';
        data['body'] = '请先登录';
        res.json(data);
        return false;
    }

    var params = req.query,
        master = params.master,
        guest = params.guest,
        page = Number(params.page - 1) * 20;

    function selectChatList() {
        return new Promise((resolve,reject)=>{
            var sql = 'select * from th_chat where (`from` = ? and `to` = ?) or (`from` = ? and `to` = ?) and status=1 order by create_time DESC limit ?,20';
            query(sql,[master,guest,guest,master,page],function(err,vals,fields){
                if(err) {
                    reject(err);
                }else {
                    resolve(vals);
                }
            })
        })
    }

    function selectUserMsg() {
        return new Promise((resolve,reject)=>{
            var sql = 'select head from th_user where id = ?';
            query(sql,[guest],function(err,vals,fields){
                if(err) {
                    reject(err);
                }else {
                    resolve(vals);
                }
            })
        })
    }

    let err,chatlist,err2,user_msg;
    let awaitlist = selectChatList(),
        awaitMsg = selectUserMsg();
    [err,chatlist] = await fun.to(awaitlist);
    [err2,user_msg] = await fun.to(awaitMsg);
    try {
        if(err) throw err;
        if(err2) throw err2;
        data['code'] = 200;
        data['body'] = {
            list: chatlist,
            user_msg: user_msg
        };
    }catch(e) {
        data['code'] = 400;
        data['body'] = '查询失败';
    }

    res.json(data);

})

module.exports = router;
