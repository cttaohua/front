var express = require('express');
var router = express.Router();

var env = require('../../config/env');

/* GET login page. */
router.get('/login', function (req, res, next) {
	
	
    res.render('login', {
        title: '登录-桃花源',
		version: env.version
    });
	
});

module.exports = router;