const gulp = require("gulp"),
  RevAll = require("gulp-rev-all"),
  babel = require('gulp-babel'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify'),
  del = require('del');

const PUBLIC_PATH = '';//cdn连接地址
const SOURCE_PATH = 'src';//源码地址
const DIST_PATH = 'copy_src_dist';//处理目录  明白不能重复
const SAVE_PATH = 'cdn';//处理目录  明白不能重复
const IGNORE_LIST = [/^\/favicon.ico$/g, /^\/index.html/g, 'Dockerfile'];//忽略处理的文件 可以使用正则


gulp.task('css', function async() {
  return gulp.src(`${SOURCE_PATH}/**/*.css`)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(notify({message: 'css 文件压缩完成'}));
});

// js 代码合并和压缩
gulp.task('js', function () {
  return gulp.src(`${SOURCE_PATH}/**/*.js`, {allowEmpty: true})
    .pipe(babel({
      presets: 'es2015'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(notify({message: 'js 文件编译完成'}));
});


gulp.task('copyAll', function () {
  return gulp.src(`${SOURCE_PATH}/**`).pipe(gulp.dest(DIST_PATH)).pipe(notify({message: 'copy文件完成'}));
});

gulp.task('clean', () => {
  return del([DIST_PATH, SAVE_PATH]);
});

gulp.task('cdn', function () {
  return gulp.src(`${DIST_PATH}/**`)
    .pipe(RevAll.revision({
      dontRenameFile: IGNORE_LIST,
      fileNameVersion: 'v1',
      // prefix: PUBLIC_PATH,
      transformPath: function (rev, source, path) {
        const pathUrlArr = path.path.split(DIST_PATH);
        const pathUrl = pathUrlArr[pathUrlArr.length - 1];
        return `${PUBLIC_PATH}${pathUrl}`;
      },
    }))
    .pipe(gulp.dest(SAVE_PATH)).pipe(notify({message: 'cdn完成'}));
});

// 设置默认任务（default）
gulp.task('default', gulp.series('clean', 'copyAll', gulp.parallel('css', 'js'), 'cdn', (done) => {
  console.log('----------success-------------');
  console.info(`    执行完毕,代码存放${SAVE_PATH}    `);
  console.log('----------success-------------');
  done();
}));
