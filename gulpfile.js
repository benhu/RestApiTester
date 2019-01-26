process.env.NODE_ENV = 'production';

// Gulp Dependencies
const { src, dest, watch, series } = require('gulp');

const browserify = require('browserify');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const source = require('vinyl-source-stream');
const htmlreplace = require('gulp-html-replace');
const minifyCSS = require('gulp-clean-css');
const babelify = require("babelify");

const packageJson = require('./package.json');
const dependencies = Object.keys(packageJson && packageJson.dependencies || {});

function copyHtml() {
  return src('index.html')
        .pipe(htmlreplace({
          js: ['./assets/javascript/vendors.js', './assets/javascript/app.js']
        }))
        .pipe(dest('build'));
}

function copyExample() {
  return src('example.*').pipe(dest('build'));
}

function copyCss() {
  return src('assets/stylesheet/**/*.css').pipe(dest('build/assets/stylesheet'));
}

function copyImage() {
  return src('assets/image/**/*').pipe(dest('build/assets/image'));
}

function vendors() {
  return browserify({
            debug: false,
            require: dependencies
        }).bundle()
          .pipe(source('vendors.js'))
          .pipe(dest('build/assets/javascript'));
}

function browserifyJs() {
  var stream = browserify({
    debug: false,
    entries: ['assets/javascript/main.js'],
    transform: babelify.configure({
      presets: ['env', 'react']
    })
  });

  stream.external(dependencies);

  return stream.bundle()
    .pipe(source('app.js'))
    .pipe(dest('build/assets/javascript'));
}

function jshintReport() {
  return src('assets/javascript/**/*.js')
    .pipe(babelify.configure({
      presets: ['env', 'react']
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
}

function uglifyJs() {
  return src('build/assets/javascript/*.js')
    .pipe(uglify())
    .pipe(dest('build/assets/javascript'));
}

function minify() {
  return src('build/assets/stylesheet/**/*.css')
    .pipe(minifyCSS({compatibility: 'ie11'}))
    .pipe(dest('build/assets/stylesheet'));
}

function watchFiles() {
  watch('package.json', ['vendors']);
  watch('assets/javascript/**/*.js', ['jshint', 'browserify']);
  watch('assets/stylesheet/**/*.css', ['copy-css']);
  watch('**/*.html', ['copy-html']);
  watch('assets/image/**/*', ['copy-image']);
}

exports.jshint = jshintReport;
exports.default = watchFiles;
exports.watch = watchFiles;
exports.build = series(browserifyJs, vendors, uglifyJs, copyCss, minify, copyHtml, copyImage, copyExample);