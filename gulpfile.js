/*eslint-disable strict*/
/*eslint dot-location: [2, "property"]*/
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var glob = require('glob');
var fs = require('fs');

var globals = {
    appname: 'fib'
};

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('static', function() {
    gulp.src(['./src/js/**/*', './src/img/**/*'], {base: './src/'})
        .pipe(gulp.dest('./dist'));
});

gulp.task('sass', function() {
    gulp.src('./src/css/scss/**/*.scss')
        .pipe($.plumber({
            errorHandler: handleError
        }))
        .pipe($.sass().on('error', $.util.log))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('html', function() {
    gulp.src('./src/html/views/*.ejs')
        .pipe($.plumber({
            errorHandler: handleError
        }))
        .pipe($.ejs({
            globals: globals
        }).on('error', $.util.log))
        .pipe(gulp.dest('./dist/views/'));
});

gulp.task('html:index', function() {
    var views = glob.sync('./dist/views/*.html');

    gulp.src('./src/html/index.ejs')
        .pipe($.plumber({
            errorHandler: handleError
        }))
        .pipe($.ejs({
            globals: globals,
            views: views
        }).on('error', $.util.log))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
    gulp.watch('./src/css/scss/**/*.scss', ['sass']);

    gulp.watch(['./src/js/**/*', './src/img/**/*'], ['static'])
        .on('change', browserSync.reload);

    gulp.watch('./src/index.ejs', ['html:index'])
        .on('change', browserSync.reload);

    gulp.watch('./src/html/**/*.ejs', ['html', 'html:index'])
        .on('change', browserSync.reload);
});

gulp.task('sync', function() {
    browserSync.init({
        server: {
          baseDir: './dist'
        }
    });
});

gulp.task('default', $.sequence(['sass', 'html', 'html:index', 'static'], 'watch', 'sync'));
