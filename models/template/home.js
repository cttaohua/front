var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var fun = require('../../config/fun.js');

// /* GET home page. */
router.get('/', function (req, res, next) {
    delete require.cache[require.resolve('../../config/env.js')];
    var env = require('../../config/env.js');
    env['header']['index'] = 1;
    env['header']['userInfo'] = req.userInfo;
    
    async.parallel([
        function (callback) {
            fun.selectClassify(callback);
        },
		function (callback) {
			fun.indexList(callback,0);
		}
    ], function (err, result) {
        res.render('index', {
			header: env['header'],
			meta: env['meta'],
            classify: result[0],
            list: result[1]
        });
    })

});

//退出登录
router.get('/layout', function (req, res, next) {
     res.clearCookie('userInfo');
	 //页面重定向
	 res.redirect('/');
})

module.exports = router;
