var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect');


gulp.task('styles', function () {
	return sass('./public/sass/*.scss', {style: 'expanded', sourcemap: true})
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 version', 'safari 5', 'ie 6', 'opera 12.1', 'ios 6', 'android 4'],
			cascade: true,//是否美化属性值 默认：true 像这样：
			//-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
		}))
		.pipe(gulp.dest('./public/dist/css/'))
		.pipe(minifycss())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public/dist/css/'))
		.pipe(livereload())
		.pipe(notify({message: 'styles task complete'}));
});

gulp.task('scripts', function () {
	return gulp.src('./public/scripts/*.js')
		.pipe(plumber())
		.pipe(jshint('.jshintrc'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./public/dist/js/'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./public/dist/js/'))
		.pipe(livereload())
		.pipe(notify({message: 'scripts task complete'}));
});

gulp.task('images', function () {
	return gulp.src('./public/images/*')
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}	
		}))
		.pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('./public/dist/img/'))
		.pipe(livereload())
		.pipe(notify({message: 'images task complete'}));
});

gulp.task('connect', function() {
  	connect.server({
	    root: './public/',
	    port: 3000,
	    livereload: true,
	});
});

gulp.task('clean', function () {
	gulp.src(['./public/dist/css/', './public/dist/js/', './public/dist/img/'])
		.pipe(clean());
});

gulp.task('clear', function (done) {
	return cache.clearAll(done);
});

gulp.task('default', function () {
	gulp.start(['scripts', 'styles', 'images', 'connect']);
});

gulp.task('watch', ['default'], function () {

	gulp.watch('./public/sass/**/*.scss', ['styles']);
	gulp.watch('./public/scripts/**/*.js', ['scripts']);
	gulp.watch('./public/images/**/*', ['images']);

	livereload.listen();
});