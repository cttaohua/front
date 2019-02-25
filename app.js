var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var compression = require('compression');
// var logger = require('morgan');
var swig = require('swig');
var bodyParser = require('body-parser');
const config = require('./bin/config.js');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');


var app = express();


// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//默认设置
if(!config.setDefaults.cache) {
    swig.setDefaults(config.setDefaults); //模板设置为缓存/不缓存
}

// app.use(logger('dev'));

// app.use(express.json());
// app.use(express.urlencoded({
//     extended: false
// }));
//压缩
app.use(compression()); 
//处理大请求
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{
	maxAge: '30d'
}));

//session设置
app.use(session({
    secret : 'taohua-secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 30*24*60*60*1000, // 设置 session 的有效时间，单位毫秒
    }
}))

app.use(function (req, res, next) {
    var user_msg;
    if (req.session.userInfo) {
        user_msg = JSON.parse(new Buffer(req.session.userInfo, 'base64').toString());
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
