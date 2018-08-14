var express = require('express');
var router = express.Router();

var env = require('../../config/env.js');


/* GET write page. */
router.get('/write', function (req, res, next) {
	
	env.header['index'] = 2;
	env.header['userInfo'] = req.userInfo;
	
    res.render('write', {
        title: '桃花源',
		version: env.version,
		header: env.header
    });
    
});

module.exports = router;