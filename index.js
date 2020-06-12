#!/usr/bin/env node

const fs = require('fs');
const params = process.argv[2];
const pkg = require('./package');
const path = require('path');

/**
 * @name 初始化
 */
function init() {
  const res = fs.writeFileSync('./.gulpStaticJson.json', `{
  "PUBLIC_PATH": "cdn地址",
  "SOURCE_PATH": "源码地址 必须为根路径",
  "DIST_PATH": "处理目录 默认为copy_src_dist",
  "SAVE_PATH": "编译后的保存目录 相对于SOURCE_PATH的目录 模式为src"
}`, {encoding: 'utf8'});
  if (res) {
    throw Error(res);
  }
  return console.log('success  .gulpStaticJson.json已生成(项目根目录)');
}

/**
 * @name 编译
 */
function build() {
  const flag = fs.existsSync('./.gulpStaticJson.json');
  if (!flag) {
    return  console.log('请先执行 htmlbuild init   生成配置文件');
  }
  const json = fs.readFileSync('./.gulpStaticJson.json', 'utf8');
  const config = JSON.parse(json || '{}');
  if (!config.SOURCE_PATH) {
    return Error('源码地址不能为空');
  }
  process.env.PJ_PATH = config.SOURCE_PATH;
  // process.argv.splice(1, 1);
  process.argv.push(
    '--gulpfile',
    // __dirname是全局变量，表示当前文件所在目录
    path.join(__dirname, 'gulpfile.js')
  );
  require('gulp/bin/gulp');

}

/**
 * @name 获取版本信息
 */
function getVersion() {
  console.log(`版本信息:${pkg.version || '未知'}`)
}

if (params === 'init') {
  init();
  return;
}

if (params === 'build') {
  build();
  return;
}

if (params === '-v') {
  getVersion();
  return;
}
console.log('init 初始化||build 编译||-v 查看版本');
