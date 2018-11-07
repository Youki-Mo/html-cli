var gulp = require('gulp')
var browser = require('browser-sync') // 创建服务端口及热更新
var less = require('gulp-less') // less编译
var auto = require('gulp-autoprefixer') // 自动给css兼容浏览器前缀
var uglify = require('gulp-uglify') // 压缩js
var cleancss = require('gulp-clean-css') // 压缩css
var babel = require('gulp-babel') // 编译
var clean = require('gulp-clean') // 清理文件夹
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')

var app = {
    src: 'src', // 源码环境
    dev: 'dist', // 开发环境
    prd: 'build', // 生产环境
    rev: 'rev', // 外链对应版本号
}

gulp.task('lib', function() {
    gulp.src(app.src + '/plugins/**/*')
        .pipe(rev())
        .pipe(gulp.dest(app.dev + '/plugins'))
        .pipe(gulp.dest(app.prd + '/plugins'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(app.rev + '/plugins'))
})

gulp.task('images', function() {
    gulp.src(app.src + '/images/**/*')
        .pipe(gulp.dest(app.dev + '/images'))
        .pipe(gulp.dest(app.prd + '/images'))
})

gulp.task('html', function() {
    gulp.src([app.rev + '/**/*.json', app.src + '/**/*.html'])
        .pipe(revCollector())
        .pipe(gulp.dest(app.dev))
        .pipe(gulp.dest(app.prd))
        .pipe(browser.reload({ stream: true }))
})

gulp.task('less', function() {
    gulp.src(app.src + '/less/style.less')
        .pipe(less())
        .pipe(rev())
        .pipe(auto({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest(app.dev + '/css'))
        .pipe(cleancss())
        .pipe(gulp.dest(app.src + '/css'))
        .pipe(gulp.dest(app.prd + '/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(app.rev + '/css'))
        .pipe(browser.reload({ stream: true }))
})

gulp.task('js', function() {
    gulp.src(app.src + '/js/**/*.js')
        .pipe(babel())
        .pipe(rev())
        .pipe(gulp.dest(app.dev + '/js'))
        .pipe(uglify())
        .pipe(gulp.dest(app.prd + '/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest(app.rev + '/js'))
        .pipe(browser.reload({ stream: true }))
})

gulp.task('server', function() {
    browser({
        server: {
            baseDir: './' + app.prd,
        },
        ghostMode: false,
        port: 1500
    })
})

gulp.task('del', function() { //清除自动化复制的文件
    gulp.src([app.dev, app.prd]).pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch(app.src + '/plugins/**/*', ['lib'])
    gulp.watch(app.src + '/images/**/*', ['images'])
    gulp.watch(app.src + '/**/*.html', ['html'])
    gulp.watch(app.src + '/less/**/*', ['less'])
    gulp.watch(app.src + '/js/**/*', ['js'])
})

gulp.task('os', ['watch', 'lib', 'images', 'html', 'less', 'js', 'server'])