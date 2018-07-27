module.exports = function(app) {
	var login = require('../models/api/login.js'); 
	app.use('/api',login);
}
