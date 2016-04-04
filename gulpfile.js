// Gulp Dependencies
var gulp = require('gulp'),

    // Build Dependencies
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    source = require('vinyl-source-stream'),

    // Style Dependencies
    minifyCSS = require('gulp-minify-css'),

    // React Dependencies
    babelify = require("babelify");

var packageJson = require('./package.json');
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});

gulp.task('default', ['watch']);

gulp.task('copy-html', function() {
  return gulp.src('src/*.html').pipe(gulp.dest('build'));
});

gulp.task('copy-example', function() {
  return gulp.src('src/example.*').pipe(gulp.dest('build'));
});

gulp.task('copy-css', function() {
  return gulp.src('src/css/**/*.css').pipe(gulp.dest('build/assets/stylesheet'));
});

gulp.task('copy-image', function() {
  return gulp.src('src/image/**/*').pipe(gulp.dest('build/assets/image'));
});

gulp.task('vendors', function () {
    return browserify({
            debug: false,
            require: dependencies
        }).bundle()
          .pipe(source('vendors.js'))
          .pipe(gulp.dest('build/assets/javascript'));
});

gulp.task('browserify', function() {
  var stream = browserify({
    debug: true,
    entries: ['src/javascript/main.js'],
    transform: babelify.configure({
      presets: ['es2015', 'react']
    })
  });

  stream.external(dependencies);

  return stream.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('build/assets/javascript'));
});

gulp.task('jshint', function() {
  return gulp.src('src/javascript/**/*.js')
    .pipe(babelify.configure({presets: ['es2015', 'react']}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('uglify', ['browserify', 'vendors'], function() {
  return gulp.src('build/assets/javascript/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/javascript'));
});

gulp.task('minify', ['copy-css'], function() {
  return gulp.src('build/assets/stylesheet/**/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/assets/stylesheet'));
});

gulp.task('watch', function() {
  gulp.watch('package.json', ['vendors']);
  gulp.watch('src/javascript/**/*.js', [ 'jshint', 'browserify']);
  gulp.watch('src/css/**/*.css', ['copy-css']);
  gulp.watch('src/**/*.html', ['copy-html']);
  gulp.watch('src/image/**/*', ['copy-image']);
});

gulp.task('build', ['uglify', 'minify', 'copy-html', 'copy-image', 'copy-example']);