var express = require('express');
var router = express.Router();




router.get('/draft', function (req, res, next) {
	
	//未登录
	if(req.userInfo==0) {  
		res.redirect('/login');
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '草稿箱 - 桃花源';
    res.render('article/draft', {
        meta: env.meta,
		header: env.header,
		index: 0
    });
    
});

module.exports = router;