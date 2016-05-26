/**
 *  All gulp tasks are stored in separate files/folders and just included here for neatness
 */
// dev flag?
if (process.argv.indexOf('--dev') != -1)
  global.devMode = true;
global.devPath = './dev';
global.distPath = './dist';

var gulp = require('gulp');
gulp.task('sass',require('./gulp-tasks/sass'));
gulp.task('scripts',require('./gulp-tasks/scripts'));

// watch
gulp.task('dev',['scripts','sass'], function (done) {
  global.devMode = true;
  gulp.watch(['dev/scss/**/*'],['sass']);
  gulp.watch(['dev/js/**/*'],['scripts']);
});
// watch alias
gulp.task('watch',['dev']);

// build
gulp.task('build',['sass','scripts']);
