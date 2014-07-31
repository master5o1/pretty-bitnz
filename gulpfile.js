var gulp 		= require('gulp');
// var uglify 		= require('gulp-uglify');
var concatter 	= require('gulp-concat');
var watch 		= require('gulp-watch');
var ngmin 		= require('gulp-ngmin');
var less 		= require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('compile-js', function(){	
	gulp.src([
		"bower_components/angular/angular.js",
		"bower_components/json3/lib/json3.js",
    	"bower_components/angular-resource/angular-resource.js",
	    "bower_components/angular-sanitize/angular-sanitize.js",
	    "bower_components/angular-animate/angular-animate.js",
	    "bower_components/angular-touch/angular-touch.js",
	    "bower_components/angular-route/angular-route.js",
	    "app/scripts/**/*.js",
	    '!app/scripts/min/*.js', // Exclude all files in lib js folder
	])
	.pipe(concatter("scripts.min.js"))
	// .pipe(ngmin())	
	// .pipe(uglify({ mangle : false}))
	.pipe(gulp.dest('app/scripts/min'))
});

gulp.task('compile-less', function(){
	gulp.src(['bower_components/pure/pure-min.css', 'app/styles/*.less'])
	.pipe(sourcemaps.init())
	.pipe(less())
  	.pipe(sourcemaps.write())
  	.pipe(gulp.dest('app/styles'));
});

gulp.task('watch-scripts', function() {
	gulp.src('app/**/*.js', { read: false })
	.pipe(watch({ emit: 'all' }, function(files) {
		gulp.run('compile-js');
	}));
});

gulp.task('watch-less', function() {
	gulp.src(['bower_components/pure/pure-min.css', 'app/styles/*.less'], { read: false })
	.pipe(watch({ emit: 'all' }, function(files) {
		gulp.run('compile-less')
	}))
});

gulp.task('watch', ['watch-scripts', 'watch-less']);

gulp.task('default', ['compile-js', 'compile-less']);