var gulp = require('gulp');
var sass = require('gulp-sass');

/* javascript */
// var gutil = require('gulp-util');
// var concat = require('gulp-concat');
// var uglify = require('gulp-uglifyjs');
// var babel = require('gulp-babel');

var browserSync = require('browser-sync').create();

// Sync Changes
gulp.task('browser-sync', ['sass'], function () {
  browserSync.init({
    server: { baseDir: __dirname },
    notify: false
  });
});

// Compile sass files
gulp.task('sass', function () {
  return gulp.src('./scss/*.scss')
    .pipe(sass({ outputStyle: 'expanded', onError: browserSync.notify }))
    .on('error', errorHandler)
    .pipe(gulp.dest('../themes/codediger/static/css'))
    .pipe(browserSync.reload({ stream: true }))
});

// gulp.task('js', function () {
//   gulp.src('./js/*.js')
//     .pipe(
//     babel({ presets: ['env'] })
//       .on('error', gutil.log)
//     )
//     .pipe(uglify())
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('../static'));
// });

// Watch Sass Files
gulp.task('watch', ['browser-sync', 'sass'], function () {
  gulp.watch('./scss/*.scss', ['sass']);
  // gulp.watch('*.html', browserSync.reload);
});


function errorHandler(e) {
  console.log(e.toString())
  this.emit('end')
}

//  Default task
gulp.task('default', ['watch']);
