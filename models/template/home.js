var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var env = require('../../config/env.js');
var fun = require('../../config/fun.js');

// /* GET home page. */
router.get('/', function (req, res, next) {

    env['header']['index'] = 1;
    env['header']['userInfo'] = req.userInfo;

    async.parallel([
        function (callback) {
            fun.selectClassify(callback);
        }
    ], function (err, result) {
        res.render('index', {
            title: '桃花源',
            version: env['version'],
            classify: result[0],
            header: env['header']
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
