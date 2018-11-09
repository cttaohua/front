var express = require('express');
var router = express.Router();
const query = require('../../config/node-mysql.js');
const async = require('async');

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
		header: env.header,
		word_msg: '',
		content: ''
    });
    
});

/* GET write edit page */
router.get('/writeEdit/:id',function(req,res,next) {
	
    //未登录
	if(req.userInfo==0) {  
		res.redirect('/login');
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	const env = require('../../config/env.js');
	env.header['index'] = 0;
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '桃花源 - 写文章';
	const word_id = req.params.id;

	async.parallel([
		function(callback) {
           let s_sql = "select * from th_article where id="+word_id;
           query(s_sql,function(err,vals){
           	  if(err) {
           	  	callback('err');
           	  }else {
           	  	if(vals.length) {
           	  		callback(null,vals[0]);
           	  	}else {
                    callback(null,0);
           	  	}
           	  }
           })
		}
	],function(err,result){
        if(err) {
        	res.render('error/error');
        }else {
        	if(result[0]!=0) {
                if(result[0].user_id==req.userInfo.id) {  //是作者本人
                     res.render('write', {
				        meta: env.meta,
						header: env.header,
						word_msg: JSON.stringify(result[0]),
                        content: result[0].content
				    })
                }else {
                    res.render('error/error');
                }
        	}else {
        		res.render('error/error');
        	}
        	
        }
	})

})

module.exports = router;