var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var env = require('../../config/env.js');
var fun = require('../../config/fun.js');

// /* GET home page. */
router.get('/', function (req, res, next) {
    
	async.parallel([
		function(callback) {
            fun.selectClassify(callback);
		}
	],function(err,result){
		res.render('index', {
			title: '桃花源',
			env: env,
			classify: result[0]
		});
	})

});

module.exports = router;
