const gulp = require("gulp"),
  RevAll = require("gulp-rev-all"),
  babel = require('gulp-babel'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  notify = require('gulp-notify'),
  del = require('del'), fs = require('fs'), path = require('path');

const PWD_PATH= process.env.PWD_PATH;
console.log(PWD_PATH);
const json = fs.readFileSync(path.join(PWD_PATH, process.env.JSON_PATH), 'utf8');
const config = JSON.parse(json || '{}');

config.IGNORE_LIST = config.IGNORE_LIST || [];
ignoreList = config.IGNORE_LIST.concat([/^\/favicon.ico$/g, 'Dockerfile', '.gulpStaticJson.json']);

const PUBLIC_PATH = config.PUBLIC_PATH || '';//cdn连接地址
const SOURCE_PATH = path.join(PWD_PATH,config.SOURCE_PATH||'src');//源码地址
const DIST_PATH = config.DIST_PATH || 'copy_src_dist';//处理目录  明白不能重复
const SAVE_PATH = path.join(SOURCE_PATH, config.SAVE_PATH || 'cdn');//保存地址
const IGNORE_LIST = ignoreList;//忽略处理的文件 可以使用正则

let CopyPath=[`${SOURCE_PATH}/**`, `!${SOURCE_PATH}/node_modules/**`, `!Dockerfile`];

config.IGNORE_CALC=config.IGNORE_CALC.map((item)=>{
  return `!${path.join(SOURCE_PATH,item)}`
})


CopyPath=CopyPath.concat(config.IGNORE_CALC||[]);

console.log('CopyPath',CopyPath);
console.log('PUBLIC_PATH',PUBLIC_PATH);
console.log('SOURCE_PATH',SOURCE_PATH);
console.log('DIST_PATH',DIST_PATH);
console.log('SAVE_PATH',SAVE_PATH);
console.log('IGNORE_LIST',IGNORE_LIST);


gulp.task('css', function async() {
  return gulp.src(`${DIST_PATH}/**/*.css`)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(notify({message: 'css 文件压缩完成'}));
});

// js 代码合并和压缩
gulp.task('js', function () {
  return gulp.src(`${DIST_PATH}/**/*.js`, {allowEmpty: true})
    .pipe(babel({
      presets: 'es2015'
    }))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(notify({message: 'js 文件编译完成'}));
});


gulp.task('copyAll', function () {
  return gulp.src(CopyPath).pipe(gulp.dest(DIST_PATH)).pipe(notify({message: 'copy文件完成'}));
});

gulp.task('clean', () => {
  return del([DIST_PATH, SAVE_PATH], {force: true});
});

gulp.task('cdn', function () {
  return gulp.src(`${DIST_PATH}/**`)
    .pipe(RevAll.revision({
      dontRenameFile: IGNORE_LIST,
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
gulp.task('build', gulp.series('clean', 'copyAll', gulp.parallel('css', 'js'), 'cdn', (done) => {
  console.log('----------success-------------');
  console.info(`    执行完毕,代码存放${SAVE_PATH}    `);
  console.log('----------success-------------');
  done();
}));
