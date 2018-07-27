module.exports = function(app) {
	var home = require('../models/template/home.js');
	var write = require('../models/template/write.js');
	var login = require('../models/template/login.js');
	app.use('/',home);
	app.use('/',write);
	app.use('/',login);
}