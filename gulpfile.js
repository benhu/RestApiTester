// Gulp Dependencies
var gulp        = require('gulp'),
    rename      = require('gulp-rename'),

// Build Dependencies
    browserify  = require('gulp-browserify'),
    uglify      = require('gulp-uglify'),
    jshint      = require('gulp-jshint'),

// Style Dependencies
    minifyCSS   = require('gulp-minify-css'),

// React Dependencies
    babelify    = require("babelify");

gulp.task('default', ['watch']);

gulp.task('development', function() {
    return process.env.NODE_ENV = 'development atom';
});

gulp.task('copy-html', function() {
  return gulp.src('src/*.html').pipe(gulp.dest('build'));
});

gulp.task('copy-css', function() {
  return gulp.src('src/css/**/*.css').pipe(gulp.dest('build/assets/stylesheet'));
});

gulp.task('copy-image', function() {
  return gulp.src('src/image/**/*').pipe(gulp.dest('build/assets/image'));
});

gulp.task('browserify-client', ['development'], function() {
  return gulp.src('src/javascript/main.js')
    .pipe(browserify({
      debug: true,
      transform: babelify.configure({presets: ['es2015', 'react']})
    }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('build/assets/javascript'));
});

//gulp.task('jshint', function() {
//  return gulp.src('src/javascript/**/*.js')
//    .pipe(babelify.configure({presets: ['es2015', 'react']}))
//    .pipe(jshint())
//    .pipe(jshint.reporter('jshint-stylish'));
//});

gulp.task('uglify', ['browserify-client'], function() {
  return gulp.src('build/assets/javascript/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/javascript'));
});

gulp.task('minify', ['copy-css'],function() {
  return gulp.src('build/assets/stylesheet/**/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/assets/stylesheet'));
});

gulp.task('watch', function() {
  gulp.watch('src/javascript/**/*.js', [/*'jshint',*/ 'browserify-client']);
  gulp.watch('src/css/**/*.css', ['copy-css']);
  gulp.watch('src/**/*.html', ['copy-html']);
  gulp.watch('src/image/**/*', ['copy-image']);
});

gulp.task('build', ['uglify', 'minify', 'copy-html', 'copy-image']);