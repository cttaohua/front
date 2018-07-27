var gulp = require('gulp');

// 引入组件
var sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'),        // js压缩
    concat = require('gulp-concat'),        // 合并文件
    rename = require('gulp-rename'),        // 重命名
    clean = require('gulp-clean');          //清空文件夹

//sass解析
gulp.task('stylesheets', function(){
  gulp.src('./sass/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('./css'));
});

// 合并、压缩、重命名文件
gulp.task('javascripts', function() {
  gulp.src('./js-build/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./js'));
});

// clean
gulp.task('clean', function() {
  var array = [];
  array.push('./css-build/*.css');
  array.push('./css/*.min.css');
  array.push('./js/*.min.js');
  
  return gulp.src(array, {read: false})
    .pipe(clean({force: true}));
});


// dev 监听 js,css
gulp.task('dev',function(){
  gulp.start('stylesheets','javascripts');
  gulp.watch('./sass/*.scss', ['stylesheets']);
  gulp.watch('./js-build/*.js', ['javascripts']);
});


// defalt 依赖 clean
gulp.task('default',['clean'], function() {
  gulp.start('dev');
});