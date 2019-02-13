const request = require('request');
const env = require('../config/env.js');
const query = require('../config/node-mysql.js');
const tool = require('../config/tool.js');
const db = require('../db/package.js');

let appid = env.qq.appid,
    appkey = env.qq.appkey,
    qqAuthPath = 'http://taohuayuanskill.com/qqcallback';

//获取access_token
function selectAccess_token(code) {
    return new Promise((resolve, reject) => {
        request({
            url: `https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=${appid}&client_secret=${appkey}&code=${code}&redirect_uri=${encodeURIComponent(qqAuthPath)}`,
            method: "GET", //请求方式，默认为get
            headers: { //设置请求头
                "content-type": "application/json",
            },
            json: true,
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    let arr = body.split('&');
                    let obj = {};
                    arr.forEach((curr) => {
                        let item = curr.split('=');
                        obj[item[0]] = item[1];
                    });
                    resolve(obj);
                } catch (e) {
                    reject(e);
                }

            } else {
                reject('请求出错');
            }
        });
    })
}
//获取openid
function selectOpenid(token) {
    return new Promise((resolve,reject)=>{
        request({
                url: `https://graph.qq.com/oauth2.0/me?access_token=${token}`,
                method: "GET",  
                headers: {  
                    "content-type": "application/json",
                },
                json: true,
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    let point1 = body.indexOf('{');
                    let point2 = body.indexOf('}') + 1;
                    let str = body.substring(point1,point2);
                    str = JSON.parse(str);
                    resolve(str);
                }catch(e) {
                    reject(e);
                }
            }else {
                reject('请求出错');
            }
        }); 
    })
}
//获取用户信息
function selectUserinfo(token,openid) {
    return new Promise((resolve,reject)=>{
        request({
                url: `https://graph.qq.com/user/get_user_info?access_token=${token}&oauth_consumer_key=${appid}&openid=${openid}`,
                method: "GET",  
                headers: {  
                    "content-type": "application/json",
                },
                json: true,
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                try {
                    resolve(body);
                }catch(e) {
                    reject(e);
                }
            }else {
                reject('请求出错');
            }
        }); 
    })
}
//检查qq openid是否已经存在
function inspectopenid(openid) {
    return new Promise((resolve,reject)=>{
        var sql = "select * from th_user where qq_openid = ?";
        query(sql,[openid],function(err,vals,fields){
            if(err) {
                reject(err);
            }else {
                resolve(vals);
            }
        })
    })
}
//新增用户
function addqquser(openid,user_msg,path) {
    return new Promise((resolve,reject)=>{
        var nowDate = (Date.parse(new Date())); 
        var r = tool.getRandomStr();
        var sex = 1;
        if(user_msg.gender=='男') {
            sex = 1;
        }else if(user_msg.gender=='女'){
            sex = 2;
        }else {
            sex = 3;
        }
        var obj = {
            sign: r,
            nick: user_msg.nickname,
            qq_openid: openid,
            head: path,
            create_time: nowDate,
            sex: sex
        }
        db.insert('th_user',obj,function(err,vals){
            if(err) {
                reject(err);
            }else {
                resolve(vals);
            }
        })
    })
}

module.exports = {
    selectAccess_token,
    selectOpenid,
    selectUserinfo,
    inspectopenid,
    addqquser
}