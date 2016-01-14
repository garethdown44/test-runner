var gulp                  = require('gulp');
var changed               = require('gulp-changed');
var gutil                 = require('gulp-util');
var source                = require('vinyl-source-stream');
var babelify              = require('babelify');
var watchify              = require('watchify');
var exorcist              = require('exorcist');
var browserify            = require('browserify');
var browserSync           = require('browser-sync').create();
var streamify             = require('gulp-streamify');
var less                  = require('gulp-less');
var lessPluginCleanCss    = require('less-plugin-clean-css');
var lessPluginAutoprefix  = require('less-plugin-autoprefix');
var karma                 = require('karma');
var eslint                = require('gulp-eslint');

var cleanCss = new lessPluginCleanCss({
  removeComments: true,
  advanced: true
});

var autoPrefix = new lessPluginAutoprefix({
  browsers: ['last 2 versions']
});

// Input file.
watchify.args.debug = true;
var b = browserify('./src/app.js', watchify.args)

var bundler = watchify(b);

// Babel transform
bundler.transform(babelify.configure({
    sourceMapRelative: 'src'
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {

  gutil.log('Compiling JS...');

  return bundler
      //.transform(babelify)
      .bundle()
      .on('error', function (err) {
          gutil.log(err.message);
          browserSync.notify("Browserify Error!");
          this.emit("end");
      })
      .pipe(exorcist('dist/js/bundle.js.map'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist/js'))
      .pipe(browserSync.stream({once: true}));
}

gulp.task('bundle', function () {
  return bundle();
});

gulp.task('less', function(){
    gulp.src('../common/styles/less/site.less')
    .pipe(less({
      plugins: [autoPrefix]
    }))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('img', function() {
  gulp.src('../common/img/**/*.*')
    .pipe(changed('dist/img'))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function() {
  gulp.src('../common/fonts/**/*.*')
    .pipe(changed('dist/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('lib-js', function() {
  gulp.src('lib/js/**/*.*')
    .pipe(changed('dist/js/'))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('lib-css', function() {
  var DEST = 'dist/css/';
  gulp.src('lib/css/**/*.css')
    .pipe(changed(DEST))
    .pipe(gulp.dest(DEST));
});

gulp.task('views', function() {
  gulp.src('src/*.*').pipe(gulp.dest('dist/'));
});

gulp.task('copy-web-config', function() {
  gulp.src('src/web.config').pipe(gulp.dest('dist/'));
});

gulp.task('src-to-dist', [ 'views', 'img', 'fonts', 'copy-web-config' ]);
gulp.task('lib-to-dist', [ 'lib-js', 'lib-css' ]);

/**
 * First bundle, then serve from the ./app directory
 */
gulp.task('default', ['lib-to-dist', 'src-to-dist', 'less', 'bundle'], function () {
  browserSync.init({
      server: "./dist",
      port: 8085,
      ghostMode: false,
      ui: false
  });

  gulp.watch(['../common/styles/less/*.less'], ['less']);
  gulp.watch([ 'src/**/*.html', 'src/fonts/**/*.*', 'src/img/**/*.*' ], [ 'views', 'img', 'fonts' ]);
  gulp.watch([ 'lib/**/*.*' ], [ 'lib-js', 'lib-css' ]);
  //gulp.watch([ 'src/**/*.js'], ['lint']);
});

gulp.task('serve', function() {
  browserSync.init({
      server: "./dist",
      port: 8085,
      ghostMode: false,
      ui: false
  });
});

gulp.task('test', function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start()
});

gulp.task('test-chrome', function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.chrome.conf.js',
    singleRun: false
  }, done).start()
});

gulp.task('test-teamcity', function (done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    reporters: ['teamcity']
  }, done).start()
})

gulp.task('tdd', ['test'], function() {
  gulp.watch(['src/**/*.js'], ['test']);
});

// function lint() {
//   return gulp.src(['src/**/*.js'])
//     .pipe(eslint())
//     .pipe(eslint.format());
// }

// gulp.task('lint', function () {
//     return lint();
//     //.pipe(eslint.failAfterError)
// });

gulp.task('bundle-teamcity', function() {

  var bundle = browserify('./src/app.js')
      .transform(babelify.configure({
          sourceMapRelative: 'src'
      }))
      .bundle()
      //.pipe(exorcist('dist/js/bundle.js.map')) // commented on purpose - otherwise it mangles the javascript source (not sure why)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./dist/js'));
});

gulp.task('teamcity', ['src-to-dist', 'lib-to-dist', 'less', 'bundle-teamcity']);
