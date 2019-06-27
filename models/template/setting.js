var express = require('express');
var router = express.Router();




router.get('/basic', function (req, res, next) {

	//未登录
	if(req.userInfo==0) {
		res.redirect('/login?originalUrl='+req.originalUrl);
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '基础设置 - 桃花源';
    res.render('setting/basic', {
        meta: env.meta,
		header: env.header,
		index: 0
    });

});

router.get('/reward', function(req,res,next){

	//未登录
	if(req.userInfo==0) {
		res.redirect('/login?originalUrl='+req.originalUrl);
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '赞赏设置 - 桃花源';
	res.render('setting/reward', {
		meta: env.meta,
		header: env.header,
		index: 1
	})

})

router.get('/help',function(req,res,next){

	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '帮助与反馈 - 桃花源';
	res.render('setting/help', {
		meta: env.meta,
		header: env.header,
		index: 2
	})

})

module.exports = router;
