var express = require('express');
var router = express.Router();
const fun = require('../../config/fun.js');

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

module.exports = router;