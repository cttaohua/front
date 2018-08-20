var express = require('express');
var router = express.Router();

var env = require('../../config/env.js');


router.get('/basic', function (req, res, next) {
	
	//未登录
	if(req.userInfo==0) {  
		res.redirect('/');
		return false;
	}
	
	env.header['index'] = 0;
	env.header['userInfo'] = req.userInfo;
	
    res.render('setting/basic', {
        title: '桃花源',
		version: env.version,
		header: env.header,
    });
    
});

module.exports = router;