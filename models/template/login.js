var express = require('express');
var router = express.Router();



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

module.exports = router;