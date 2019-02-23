var express = require('express');
var router = express.Router();
const env = require('../../config/env.js');
const fun = require('../../config/fun.js');
const tool = require('../../config/tool.js');
const qq = require('../../library/qqlogin.js');
const Ut = require('../../library/image.js');



/* GET login page. */
router.get('/login', function (req, res, next) {
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env');
	env['meta']['title'] = '登录 - 桃花源';
	env['meta']['description'] = '加入桃花源，开启你的创作之路，来这里接受全世界的认同';
	
    res.render('login', {
		    meta: env.meta,
    });
	
});

/* GET qq登录 */
router.get('/auth/qq_connect',function(req,res,next){
		let appid = env.qq.appid,
				appkey = env.qq.appkey,
				state = env.qq.state,
				qqAuthPath = 'http://taohuayuanskill.com/qqcallback';
		var	url =	`https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${appid}&redirect_uri=${encodeURIComponent(qqAuthPath)}&state=${state}`;
		res.redirect(url);
})

/* GET qq登录回调 */
router.get('/qqcallback', async function(req,res,next){

		let params = req.query;
		
		if(params.state!=env.qq.state) {
			res.send('error/error');
			return false;
		}
		
		let code = params.code;

		let err,access_obj;
		[err,access_obj] = await fun.to(qq.selectAccess_token(code));
		if(err) {
			res.render('error/error');
			return false;
		}

		let err2,open_obj;
		[err2,open_obj] = await fun.to(qq.selectOpenid(access_obj.access_token));
		if(err2) {
			res.render('error/error');
			return false;
		}
		//已经拿到openid
		let err3,inspect_result;
		[err3,inspect_result] = await fun.to(qq.inspectopenid(open_obj.openid));
		if(err3) {
			res.render('error/error');
			return false;
		}

		if(inspect_result.length) {  //openid已经存在，直接登录
			var user_base = new Buffer(JSON.stringify(inspect_result[0])).toString('base64');
			var user_base_id = fun.encodeStr(String(inspect_result[0].id));
			req.session.userInfo = user_base;
			res.cookie("userId",user_base_id,{maxAge: 30*24*60*60*1000});
			res.redirect('/');  //登录成功
			return false;
		}else {  //openid不存在，是新用户
			let err4,user_msg;
			[err4,user_msg] = await fun.to(qq.selectUserinfo(access_obj.access_token,open_obj.openid));
			if(err4) {
				res.render('error/error');
				return false;
			}
			//保存头像到本地
			let err5,imgPath;
			let opts = {
				url: user_msg.figureurl_2
			}
			let savePath = `/uploadImg/head/${tool.random(8)}.png`;
			imgPath = `public`+savePath;
			[err5,imgPath] = await fun.to(Ut.downImg(opts,imgPath));
			if(err5) {
				res.render('error/error');
				return false;
			}
			let err6,add_result;
			[err6,add_result] = await fun.to(qq.addqquser(open_obj.openid,user_msg,savePath));
			if(err6) {
				res.render('error/error');
				return false;
			}
			//创建成功，查询此条用户信息
			let err7,final_result;
			
			[err7,final_result] = await fun.to(qq.inspectopenid(open_obj.openid));
			if(err7) {
				res.render('error/error');
				return false;
			}
			if(final_result.length) {  //存在用户
				var user_base = new Buffer(JSON.stringify(final_result[0])).toString('base64');
				var user_base_id = fun.encodeStr(String(final_result[0].id));
				req.session.userInfo = user_base;
				res.cookie("userId",user_base_id,{maxAge: 30*24*60*60*1000});
				res.redirect('/');
				return false;
			}else {
				res.render('error/error');
				return false;
			}
		}
		
        // { ret: 0,
		// 	msg: '',
		// 	is_lost: 0,
		// 	nickname: 'Chen 迷╮ ',
		// 	gender: '男',
		// 	province: '河北',
		// 	city: '石家庄',
		// 	year: '1994',
		// 	constellation: '',
		// 	figureurl: 'http://qzapp.qlogo.cn/qzapp/101544479/C24AC453B3231BBE72100F2CE144A5DA/30',
		// 	figureurl_1: 'http://qzapp.qlogo.cn/qzapp/101544479/C24AC453B3231BBE72100F2CE144A5DA/50',
		// 	figureurl_2: 'http://qzapp.qlogo.cn/qzapp/101544479/C24AC453B3231BBE72100F2CE144A5DA/100',
		// 	figureurl_qq_1: 'http://thirdqq.qlogo.cn/qqapp/101544479/C24AC453B3231BBE72100F2CE144A5DA/40',
		// 	figureurl_qq_2: 'http://thirdqq.qlogo.cn/qqapp/101544479/C24AC453B3231BBE72100F2CE144A5DA/100',
		// 	is_yellow_vip: '0',
		// 	vip: '0',
		// 	yellow_vip_level: '0',
		// 	level: '0',
		// 	is_yellow_year_vip: '0' }

})

module.exports = router;