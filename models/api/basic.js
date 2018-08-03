var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var data = require('../../config/env.js').data;
var async = require('async');
var fs = require('fs');

router.get('/getClassify', function (req, res, next) {
    var c_sql = "select * from th_classify where status=1";
    query(c_sql, function (err, vals, fids) {
		  if(err) {
			  data['code'] = 0;
			  data['body'] = '查询失败';
		  }else {
			  if(vals.length) {
				  data['code'] = 200;
				  data['body'] = vals;
			  }else {
				  data['code'] = 1;
				  data['body'] = '没有分类';
			  }
		  }
		  res.json(data);
    })
})

module.exports = router;
