var express = require('express');
var router = express.Router();
var query = require('../../config/node-mysql.js');
var async = require('async');
var env = require('../../config/env');

// /* GET home page. */
router.get('/', function (req, res, next) {


    res.render('index', {
        title: '桃花源',
        env: env
    });

});

module.exports = router;
