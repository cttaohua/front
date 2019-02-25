module.exports = function(app) {
	var home = require('../models/template/home.js');
	var write = require('../models/template/write.js');
	var login = require('../models/template/login.js');
	var details = require('../models/template/details.js');
	var classes = require('../models/template/classes.js');
	var user = require('../models/template/user.js');
	var search = require('../models/template/searchPage.js');
	var setting = require('../models/template/setting.js');
	var article = require('../models/template/article.js');
	var notify = require('../models/template/notify.js')
	app.use('/',home);
	app.use('/',write);
	app.use('/',login);
	app.use('/',details);
	app.use('/',classes);
	app.use('/',user);
	app.use('/',search);
	app.use('/setting',setting);
	app.use('/article',article);
	app.use('/notify',notify);
}