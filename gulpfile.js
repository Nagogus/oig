/* jshint node:true */
'use strict';
// generated on 2014-12-11 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var concat = require('gulp-concat-util');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');


gulp.task('jshint', function () {
  return gulp.src('app/src/oig/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('concat', function () {
  gulp.src('app/src/oig/**/*.js')
    .pipe(concat('oig.js'))
    .pipe(concat.header('(function () {\n'))
    .pipe(concat.footer('\n}());\n'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', require('del').bind(null, ['dist']));

gulp.task('connect', function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('app'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {

});

gulp.task('watch', ['connect'], function () {
  livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'src/**/*.js'
  ]).on('change', livereload.changed);

  gulp.watch('bower.json');
});

gulp.task('build', ['jshint', 'concat'], function () {
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
