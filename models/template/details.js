var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var env = require('../../config/env');

// /* GET details page. */
router.get('/p/:id', function (req, res, next) {
    
    var word_id = req.params.id;
	
	async.series({
		one: function(callback) {
			var s_sql = "select a.*,b.* from th_article a left join th_user b on a.user_id=b.id where a.status=1 and a.id='"+word_id+"'";
		    query(s_sql,function(err, vals, fields){
				if(err) {
					callback('err');
				}else if(!vals.length) {
					callback('err');
				}else {
					callback(null,vals);
				}
			})
		}
	},function(err,result){
		if(err) {
			res.render('error/error');
		}else {
			res.render('details', {
				title: '桃花源',
				env: env,
				msg: result.one[0]
			});
		}
	})
});

module.exports = router;
