Logline
=======

[![Build Status][travis-image]][travis-url]

logline是一个轻量，实用和用户级的前端客户端日志记录工具。


为何前端定位问题很困难
-----------------
前端同学对此肯定深有体会，代码发出去之后，犹如脱缰的野马，运行在万千的客户终端上，等到产品和后台反馈问题到我们这边，很多时候定位问题只能靠猜，尤其是一些偶发诱因，因为根本不知道用户是如何操作的、随机因素的生成结果，因此很难回放用户的操作来还原现场找到原因。这个时候，我们想，如果有一个像后台一样详实的可分类和检索的运行日志，无疑将会提供巨大的帮助。

特性支持
------

+ 基本的日志记录功能
+ 命名空间
+ websql/localStorage两种存储方案
+ 日志等级分类
+ 日志清理
+ 日志上传
+ 无外部依赖
+ 用户级，针对单个用户的分析

快速上手
------

##### 引入脚本

``` javascript
// AMD/CMD
// 使用websql协议
var Logcat = require('./mod/logcat').using('websql');

// Script Tag
<script src="./mod/logcat.js"></script>
<script>
	// 使用localStorage协议
	Logcat.using('localstorage');
</script>
```
	
##### 配置上传地址

``` javascript
Logcat.reportTo('https://hostname.com/cgi-bin/weblog.cgi');
```
	
##### 清理日志

``` javascript
Logcat.keep(.5); // 保留半天以内的日志，如果不传参则清空日志
Logcat.clean(); // 清空日志并删除数据库
```
	
##### 记录日志

``` javascript
// 不同的模块使用不同的日志会话
var spaLog = Logcat('spa'),
	sdkLog = Logcat('sdk');
	
// 不包含数据的，描述为 init.succeed 的记录
spaLog.info('init.succeed');
	
// 包含错误描述数据，描述为 init.failed 的记录
spaLog.error('init.failed', {
	retcode: 'EINIT',
	retmsg: 'invalid signature'
});
	
// 不包含数据的，描述为 outdated 的记录
sdkLog.warning('outdated');
	
// 包含错误描述数据，描述为 system.vanish 的记录
sdkLog.critical('system.vanish', {
    // debug infos here
});
```

##### 上传日志

``` javascript
Logcat.deploy(
	'upload reason description for this time',
	function ticker(percentage) {
		console.log('已上传' + percentage + '%');
	},
	function successHandler() {
		alert('上传成功');
	},
	function errorHandler() {
		alert('上传失败');
	}
);
```


日志分析 [logline-viewer]()
-------------------------
由于Logline上传的日志格式符合Unix标准，因此具有良好的可阅读性，因此我们可以在某种程度上直接使用Unix的工具或者编辑器来阅读。但是对类Unix系统不熟悉的用户使用可能仍然有困难，因此有必要使用Web技术栈搭建一个易于使用并且视觉良好的工具。我们希望这套工具可以不依赖与后端，既可以部署在服务器端，也可以当做本地网页直接双击打开，也可以被简单的包一层外壳而当做桌面APP来使用。作为日志，承载的最主要的内容便是大量的纯文本，在调研了一些方案后，我们认为H5规范中的FileReader.readAsText可以很好的做到这一点，结合拖放事件，我们便可以很大致构建出一个不错的方案：用户将一个或者多个日志文件拖放至网页中，即可对这些日志批量分析和检索。



[travis-image]: https://api.travis-ci.org/latel/logline.svg
[travis-url]: https://travis-ci.org/latel/logline
[logline-viewer]: https://github.com/latel/logline-viewer