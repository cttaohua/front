module.exports = function(app) {
	var home = require('../models/template/home.js');
	var write = require('../models/template/write.js');
	var login = require('../models/template/login.js');
	var details = require('../models/template/details.js');
	app.use('/',home);
	app.use('/',write);
	app.use('/',login);
	app.use('/',details);
}