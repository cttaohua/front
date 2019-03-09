var express = require('express');
var router = express.Router();
const fun = require('../../config/fun.js');
const query = require('../../config/node-mysql.js');

//聊天页面
router.get('/chat', async function (req, res, next) {
	
	//未登录
	if(req.userInfo==0) {  
		res.redirect('/login');
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '好友畅聊 - 桃花源';
	env.header['index'] = 3;

	//查询用户信息
	let err,user_msg;
	[err,user_msg] = await fun.to(fun.selectUserBaseMsg(req.userInfo.id));
	if(err) {
		res.render('error/error');
	}else {
		user_msg = JSON.stringify(user_msg[0]);
		res.render('notify/chat', {
			meta: env.meta,
			header: env.header,
			user_msg: user_msg
		});
	}
    
});

//跳转到聊天界面
router.get('/with/linkman/:id', async function(req,res,next){
	//未登录
	if(req.userInfo==0) {  
		res.redirect('/login');
		return false;
	}
	let user_id = req.userInfo.id,
		relation_id = req.params.id;

	function queryUser() {
		return new Promise((resolve,reject)=>{
			let sql = "select id from th_contacts where user_id = ? and relation_id = ?";
			query(sql,[user_id,relation_id],function(err,vals,fields){
				if(err) {
					reject(err);
				}else {
					if(vals.length) {  //有结果
						resolve(vals);
					}else {		//没结果
						reject('没有互相添加联系人')
					}
				}
			})
		})
	}

	function insertUser() {
		return new Promise((resolve,reject)=>{
			let nowDate = (Date.parse(new Date()));
			let sql = "insert into th_contacts (user_id,relation_id,create_time,lately_time) values (?,?,?,?)";
			query(sql,[user_id,relation_id,nowDate,nowDate],function(err,vals,fields){})
			query(sql,[relation_id,user_id,nowDate,nowDate],function(err,vals,fields){
				if(err) {
					reject(err);
				}else {
					resolve('ok');
				}
			})
		})
	}

	let err,result1;
	[err,result1] = await fun.to(queryUser());
	if(err) {  //没有添加联系人
		let err2,result2;
		[err2,result2] = await fun.to(insertUser());
	}else {	  //已经添加了联系人

	}
	res.redirect('/notify/chat');	
})

module.exports = router;