module.exports = function(app) {
	var login = require('../models/api/login.js'); 
	var article = require('../models/api/article.js');
	var basic = require('../models/api/basic.js');
	var list = require('../models/api/list.js');
	var comment = require('../models/api/comment.js');
	app.use('/api',login);
	app.use('/api',article);
	app.use('/api',basic);
	app.use('/api',list);
	app.use('/api',comment);
}
