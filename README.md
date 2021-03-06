# 简介
自动化编译less为css3兼容浏览器前缀并压缩，自动转化es6并压缩，热更新，自动更新版本号

## 初始化环境
1. 安装自动化构建工具
> npm install -g gulp

2. 命令窗口打开项目根目录，运行命令
> npm install

## 修改node_modules下依赖包的一些代码（可省略）
这一步为了避免构建工具修改引入外部文件名称，让版本号以条件的形式加入外链

1. 找到node_modules/gulp-rev/index.js  
> manifest[originalFile] = revisionedFile;\
> ↓ 改为 ↓\
> manifest[originalFile] = revisionedFile + '?v=' + file.revHash;

2. 找到node_modules/gulp-rev-collector/index.js\
注意 "`var cleanReplacement =`" 等号后面是两个空格，如果找不到换成一个空格
> var cleanReplacement =&nbsp;&nbsp;path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );\
> ↓ 改为 ↓\
> var cleanReplacement = path.basename(json[key]).split('?')[0];


3. 找到node_modules/rev-path/index.js 
> modifyFilename(pth, (filename, ext) => \`${filename}-${hash}${ext}\`);\
> ↓ 改为 ↓\
> return modifyFilename(pth, (filename, ext) => \`${filename}${ext}\`);

## 项目相关命令
1.  运行
> gulp os
2.  清理生成的文件夹及内部文件
> gulp del
