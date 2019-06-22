var express = require('express');
var router = express.Router();
const query = require('../../config/node-mysql.js');
const async = require('async');
const fun = require('../../config/fun.js');

/* GET write page. */
router.get('/write', function (req, res, next) {

	//未登录
	if (req.userInfo == 0) {
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
		content: '',
		type: '1'
	});

});

/* GET write edit page */
router.get('/writeEdit/:id', function (req, res, next) {

	//未登录
	if (req.userInfo == 0) {
		res.redirect('/login');
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	const env = require('../../config/env.js');
	env.header['index'] = 0;
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '桃花源 - 写文章';
	const article_sign = req.params.id;

	async.parallel([
		function (callback) {
			let s_sql = "select id,user_id,content,title,cover,first_id,classify_id from th_article where article_sign = ?";
			query(s_sql, [article_sign], function (err, vals) {
				if (err) {
					callback('err');
				} else {
					if (vals.length) {
						callback(null, vals[0]);
					} else {
						callback(null, 0);
					}
				}
			})
		}
	], function (err, result) {
		if (err) {
			res.render('error/error');
		} else {
			if (result[0] != 0) {
				if (result[0].user_id == req.userInfo.id) { //是作者本人
					result[0].type = 'edit';
					let content = result[0].content;
					delete result[0].content;
					res.render('write', {
						meta: env.meta,
						header: env.header,
						word_msg: JSON.stringify(result[0]),
						content: content,
						type: '2'
					})
				} else {
					res.render('error/error');
				}
			} else {
				res.render('error/error');
			}
		}
	})

})

/* GET write draft page */
router.get('/writeDraft/:id', async function (req, res, next) {

	//未登录
	if (req.userInfo == 0) {
		res.redirect('/login');
		return false;
	}
	delete require.cache[require.resolve('../../config/env.js')];
	const env = require('../../config/env.js');
	env.header['index'] = 0;
	env.header['userInfo'] = req.userInfo;
	env.meta['title'] = '桃花源 - 写文章';
	const word_sign = req.params.id;

	function findMsg() {
		return new Promise((resolve, reject) => {
			let s_sql = "select id,user_id,content,title,cover,first_id,classify_id from th_draft where draft_sign=? and status = 1";
			query(s_sql, [word_sign], function (err, vals) {
				if (err) {
					reject(err);
				} else {
					if (vals.length) {
						resolve(vals[0]);
					} else {
						reject('当前无草稿');
					}
				}
			})
		})
	}

	let msg, err;
	[err, msg] = await fun.to(findMsg());

	try {
		if (err) throw err;
		msg.type = 'draft';
		let content = msg.content;
		delete msg.content;
		if (msg.user_id == req.userInfo.id) { //是作者本人
			res.render('write', {
				meta: env.meta,
				header: env.header,
				word_msg: JSON.stringify(msg),
				content: content,
				type: '1'
			})
		} else {
			res.render('error/error');
		}
	} catch (e) {
		res.render('error/error');
	}

})

module.exports = router;
