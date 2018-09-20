var express = require('express');
var router = express.Router();




/* GET write page. */
router.get('/write', function (req, res, next) {
	
	//未登录
	if(req.userInfo==0) {  
		res.redirect('/login');
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	var env = require('../../config/env.js');
	env.header['index'] = 2;
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '桃花源 - 写文章';
    res.render('write', {
        meta: env.meta,
		header: env.header
    });
    
});

module.exports = router;