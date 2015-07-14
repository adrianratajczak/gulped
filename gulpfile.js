var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    path = 'style',
    imgpath = 'img',
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    notify = require("gulp-notify"),
    cssBase64 = require('gulp-css-base64'),
    imageop = require('gulp-image-optimization');

function ScssErrorAlert(error){
    notify.onError({title: "SCSS Error", message: error.toString(), sound: "Sosumi"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
};

gulp.task('images', function(cb) {
    gulp.src([imgpath+'/**/*.png','src/**/*.jpg','src/**/*.gif','src/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('public/images')).on('end', cb).on('error', cb);
});

gulp.task('styles', function() {
  return gulp.src(path+'/*.scss')
  	// .pipe(plumber({
   //      errorHandler: function (err) {
   //          console.log(err);
   //          this.emit('end');
   //      }}))
    .pipe(plumber({errorHandler: ScssErrorAlert}))
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest(path))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(path))
    .pipe(browserSync.stream())
});



gulp.task('watch', function() {
    gulp.watch(path+'/**/*.scss', ['styles']);
    gulp.watch(path+'/*.scss', ['styles']);
    gulp.watch('js/**/*.js', ['jshint']);

});

gulp.task('jshint', function() {
    return gulp.src('js/main.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));

});



// Favicon
// sprite
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "adrian.dev"
    });
    gulp.watch(path+"/*.scss", ['styles']);
    gulp.watch(path+'/**/*.scss', ['styles']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("js/*.js").on('change', browserSync.reload);
});

gulp.task('encode', function () {
    return gulp.src(path+'/main.min.css')
        .pipe(cssBase64())
        .pipe(gulp.dest(path));
});

gulp.task('default', ['watch', 'browser-sync', 'encode'], function() {

});
