(function() {
    'use strict';

    let gulp = require('gulp');
    let sass = require('gulp-sass');
    let moduleImporter = require('sass-module-importer');
    let postCss = require('gulp-postcss');
    let uncss = require('postcss-uncss');
    let autoprefixer = require('autoprefixer');
    let htmlPaths = ['./index.html', './fragments/**/*.html'];


    gulp.task('style', function(end) {
       gulp.src('./sass/style.scss')
         .pipe(sass({importer: moduleImporter()}).on('error', sass.logError))
         .pipe(
           postCss(
             [
               uncss({
                   html: htmlPaths,
                   htmlroot: __dirname
               }),
               autoprefixer()
             ]
           )
         )
         .pipe(gulp.dest('./css'));

       end();
    });

    gulp.task('watch', function() {
        gulp.watch('./sass/**/*.scss', gulp.series('style'));
    });
}());
