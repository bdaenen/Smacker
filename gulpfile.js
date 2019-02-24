(function() {
    'use strict';

    let gulp = require('gulp');
    let concat = require('gulp-concat');
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
              /* uncss({
                   html: htmlPaths,
                   htmlroot: __dirname
               }),*/
               autoprefixer()
             ]
           )
         )
         .pipe(gulp.dest('./build'));

       end();
    });

    gulp.task('script', function(end) {
        gulp.src([
          require.resolve('jquery/dist/jquery.min.js'),
          require.resolve('form-serializer/dist/jquery.serialize-object.min.js'),
          require.resolve('popper.js/dist/umd/popper.min.js'),
          require.resolve('bootstrap/dist/js/bootstrap.js'),
          require.resolve('@coreui/coreui/dist/js/coreui-utilities.js'),
          require.resolve('@coreui/coreui/dist/js/coreui.js'),
          require.resolve('pace-progress/pace.min.js'),
          require.resolve('perfect-scrollbar/dist/perfect-scrollbar.min.js'),
          require.resolve('select2/dist/js/select2.min.js'),
          'js/config.js',
          'js/app.js',
          'js/main.js',
          'js/**/*.js'
        ])
          .pipe(concat('build.js'))
          .pipe(gulp.dest('./build'));

        end();
    });

    gulp.task('build', gulp.series(['style', 'script']));

    gulp.task('watch', function() {
        gulp.watch('./sass/**/*.scss', {ignoreInitial: false}, gulp.series('style'));
        gulp.watch('./js/**/*.js', {ignoreInitial: false}, gulp.series('script'));
    });
}());
