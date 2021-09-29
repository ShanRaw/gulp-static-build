# gulp-static-build

### gulp 自动对html的所有资产压缩 babel 添加前缀 添加cdn等操作

#### 内网私有仓库安装

```bash
yarn global add @jysd/gulp-static-build --registry http://192.168.8.6:8081/repository/npm-group/

npm install -g @jysd/gulp-static-build --registry http://192.168.8.6:8081/repository/npm-group/

#yarn global add http://gitlab.joinuscn.com/zhuwenbo/gulp-static-build.git

```

#### 一般安装

```bash
yarn global add @jysd/gulp-static-build

npm install -g @jysd/gulp-static-build
```

#### git 安装

```bash
yarn global add http://gitlab.joinuscn.com/zhuwenbo/gulp-static-build.git
```

使用:

- 初始化会在根目录生成一个配置文件

```bash
htmlbuild init
```

```json
/// success  .gulpStaticJson.json已生成(项目根目录
{
  "PUBLIC_PATH": "cdn地址",
  "SOURCE_PATH": "源码地址 必须为根路径",
  "DIST_PATH": "处理目录 默认为copy_src_dist",
  "SAVE_PATH": "编译后的保存目录 相对于SOURCE_PATH的目录 模式为src",
  "IGNORE_LIST":["index.html"],
  "IGNORE_CALC":['cdn']
}
```

> .gulpStaticJson.json 这个文件可以随意更改名字

- 默认使用 .gulpStaticJson.json 也可以传入参数

```bash
htmlbuild build 
htmlbuild build .cdn.json
```
