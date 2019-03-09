const query = require('../../config/node-mysql.js');
const db = require('../../db/package.js');
const fun = require('../../config/fun.js');

class Chat {
    constructor() {

    }
    /*
       保存聊天记录，并更新最近聊天时间
    */
    static save(obj) {
        var nowDate = (Date.parse(new Date()));
        var sql = "insert into th_chat (`from`,`to`,`msg`,`type`,`create_time`,`status`) values (?,?,?,?,?,?)";
        query(sql,[Number(obj.from),obj.to,obj.text,obj.type,nowDate,'1'],function(err,vals,fields){});
        var sql2 = "update th_contacts set lately_time= ? where user_id = ? and relation_id = ?";
        query(sql2,[nowDate,Number(obj.from),obj.to],function(err,vals,fields){});
        query(sql2,[nowDate,obj.to,Number(obj.from)],function(err,vals,fields){});
    }

}

module.exports = Chat;
