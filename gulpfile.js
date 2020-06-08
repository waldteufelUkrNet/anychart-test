'use strict'
// gulpfile for gulp 4.0.0
// waldteufel@ukr.net

// gulp.series(['pug', 'sass'])   - послідовне виконання
// gulp.parallel(['pug', 'sass']) - асинхронне виконання

// VARIABLES
var gulp         = require('gulp'),                  //
    autoprefixer = require('gulp-autoprefixer'),     // додавання вендорних префіксів
    babel        = require("gulp-babel"),            // ES6 -> ES5
    browserSync  = require('browser-sync').create(), // створення віртуального серверу  для live reload
    cache        = require('gulp-cache'),            // бібліотека кешування
    concat       = require('gulp-concat'),           // склеювання js-файлів
    // cssconcat    = require('gulp-concat-css'),       // склеювання css-файлів
    // cssnano      = require('gulp-cssnano'),          // мініфікація css-файлів
    csso         = require('gulp-csso'),             // мініфікація css-файлів
    del          = require('del'),                   // видалення файлів і тек
    // gp           = require('gulp-load-plugins')(),   // щоб не оголошувати кожну змінну, застосовується для плагінів із префіксом gulp-
    imagemin     = require('gulp-imagemin'),         // робота із зображеннями
    notify       = require('gulp-notify'),           // обробка повідомлень про помилки
    pngquant     = require('imagemin-pngquant-gfw'), // потрібен для роботи gulp-imagemin
    pug          = require('gulp-pug'),              // перетворення pug в html
    // purge        = require('gulp-css-purge'),        // видалення дублюючого коду css
    // rename       = require('gulp-rename'),           // перейменовування файлів
    sass         = require('gulp-sass'),             // перетворення sass/scss в css
    // sourcemaps   = require('gulp-sourcemaps'),       //
    uglify       = require('gulp-uglify');           // мініфікація js-файлів


// TASKS
// перетворення pug в html
gulp.task('pug', function() {
  return gulp.src('app/*.pug')
    .pipe(pug({
      pretty : true
    }))
    .on('error', notify.onError({
      message : 'Error: <%= error.message %>',
      title   : 'PUG error'
    }))
    .pipe(gulp.dest('app/'))
});

// створення віртуального серверу  для live reload
gulp.task('browser-sync', function() {
  browserSync.init({
    server : {
      baseDir : 'app'
    },
    notify: false // відключення повідомлень browserSync
  });
});

// препроцесинг scss - style.scss
gulp.task('sass', function() {
  return gulp.src(['app/assets/scss/**/*.+(scss|sass)'])
  .pipe(sass({outputStyle: 'expanded'}))
  .on('error', notify.onError({
    message : 'Error: <%= error.message %>',
    title   : 'SASS error'
  }))
  .pipe(autoprefixer({
    browsers : ['last 10 versions', '> 1%', 'ie 8', 'ie 7'],
    cascade  : true
  }))
  // .pipe(csso({
  //   restructure : true, // злиття декларацій
  //   sourceMap   : false,
  //   debug       : false // виведення в консоль детальної інформації
  // }))
  .pipe(gulp.dest('app/assets/css'))
  .pipe(browserSync.reload({stream:true}))
});

// ES6 -> ES5, перенесення у іншу теку - main.js
gulp.task('js', function() {
  return gulp.src(['app/assets/js-expanded/*.js'])
    .pipe(babel())
    // .pipe(uglify())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

// ES6 -> ES5, склеювання, перенесення у іншу теку - modules
gulp.task('js-modules', function() {
  return gulp.src(['app/assets/modules/**/*.js', '!app/assets/modules/minjs/**/*.js'])
    .pipe(babel())
    .pipe(concat({ path: 'modules.js'}))
    // .pipe(uglify())
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true}));
});

// слідкування за змінами у збережених файлах, виклик препроцесингу та live reload
gulp.task('watch', gulp.parallel(
  gulp.series('sass', 'js-modules', 'js', 'pug', 'browser-sync'),
  function() {
    gulp.watch(['app/assets/scss/**/*.+(scss|sass)', 'app/assets/modules/**/*.scss'], gulp.series('sass'));

    gulp.watch(['app/assets/js-expanded/*.js'], gulp.series('js'));
    gulp.watch(['app/assets/modules/**/*.js', '!app/assets/modules/minjs/**/*.js'], gulp.series('js-modules'));

    gulp.watch(['app/**/*.pug'], gulp.series('pug'));

    gulp.watch('app/*.html').on('change',  browserSync.reload);
  }
));






// чищення каталогу dist
gulp.task('clean', function(done) {
  return del('dist');
  done();
});

// обробка зображень
gulp.task('img', function() {
  return gulp.src('app/assets/img/**/*')
    .pipe(cache(imagemin({
      interlaced  : true,
      progressive : true,
      svgoPlugins : [{removeViewBox: false}],
      use         : [pngquant()]
    })))
    .pipe(gulp.dest('dist/assets/img'));
});

// перенесення файлів з каталогу app в dist
gulp.task('build', gulp.series(['clean', 'img'], function(done) {

  var buildCss = gulp.src('app/assets/css/*.css')
  .pipe(gulp.dest('dist/assets/css'))

  var buildFonts = gulp.src('app/assets/fonts/**/*')
  .pipe(gulp.dest('dist/assets/fonts'))

  var buildJs = gulp.src('app/assets/js/**/*')
  .pipe(gulp.dest('dist/assets/js'))

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

  // var buildVideo = gulp.src('app/assets/video/*.*')
  // .pipe(gulp.dest('dist/assets/video'));

  var buildCssLibs = gulp.src('app/assets/libs-css/*.*')
  .pipe(gulp.dest('dist/assets/libs-css'));

  var buildJsLibs = gulp.src('app/assets/libs-js/*.*')
  .pipe(gulp.dest('dist/assets/libs-js'));

  done();
}));

// очистка кешу
gulp.task('clear', function () {
    return cache.clearAll();
})

