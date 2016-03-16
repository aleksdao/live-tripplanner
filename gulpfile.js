var gulp = require('gulp');
var sass = require('gulp-sass');
 
var cssPattern = './assets/stylesheets/**/*.scss';

gulp.task('sass', function () {
  return gulp.src(cssPattern)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/stylesheets/'));
});
 
gulp.task('sass:watch', ['sass'], function () {
  gulp.watch(cssPattern, ['sass']);
});
