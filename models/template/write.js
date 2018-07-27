var express = require('express');
var router = express.Router();

var env = require('../../config/env');


/* GET write page. */
router.get('/write', function (req, res, next) {
    res.render('write', {
        title: '桃花源',
		env: env
    });
});

module.exports = router;