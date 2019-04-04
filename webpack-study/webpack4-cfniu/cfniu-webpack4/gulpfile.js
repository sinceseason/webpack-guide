var argv = require('yargs').argv;
var gulp = require('gulp');
var rename = require('gulp-rename');
var zip = require('gulp-zip');
var clean = require('gulp-clean');
var moment = require('moment');

var env = argv.env || 'dev';
console.log('gulp env:' + env);

gulp.task('clean', () => {
    return gulp.src('./dist', {
            read: false
        })
        .pipe(clean());
})

gulp.task('build:env', () => {
    return gulp.src('./config/env.' + env + '.conf')
        .pipe(rename((path) => {
            path.basename = '.env';
            path.extname = '';
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('build:zip', () => {
    return gulp.src([
            './.env',
            './**/*',
            '!./node_modules', '!./node_modules/**/*',
            '!./dist', '!./dist/**/*',
            '!./log', '!./log/**'
        ])
        .pipe(zip(moment().format("YYYY-MM-DD") + '-pc.zip'))
        .pipe(gulp.dest('dist'))
})

gulp.task('build:seo', () => {
    return gulp.src([
            './seo/**'
        ])
        .pipe(gulp.dest('public'))
})
gulp.task('build:production', ['clean', 'build:seo', 'build:env', 'build:zip']);