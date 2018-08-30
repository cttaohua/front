var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var logger = require('morgan');
var swig = require('swig');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


//默认设置
swig.setDefaults({
    cache: false
}); //模板设置为不缓存

app.use(logger('dev'));
app.use(express.json());
app.use(compression()); //压缩
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    var user_msg;
    if (req.cookies.userInfo) {
        user_msg = JSON.parse(new Buffer(req.cookies.userInfo, 'base64').toString());
    }else {
		user_msg = 0;
	}
    req.userInfo = user_msg;
    next();
})

//路由设置
indexRouter(app);
apiRouter(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error/error');
});


module.exports = app;
