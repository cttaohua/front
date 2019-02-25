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
            var sql = "select a.*,b.head,b.nick,b.intro from th_contacts a left join th_user b on a.relation_id = b.id where a.user_id=?";
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

module.exports = router;
