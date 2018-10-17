## node
1. **nodemon** node 监听并自动重启
2. windows不支持NODE_ENV=development的设置方式,会报错,**cross-env**能够提供一个设置环境变量的scripts，让你能够以unix方式设置环境变量，然后在windows上也能兼容运行
3. **koa-static** 静态资源请求中间件
``` demo
|- demo12
|-- demo12.js
|--- xxx.html, xxx.js, xxx.jpg
******************************
demo12.js
``` javascript
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const app = new Koa()

// 设置静态资源的路径 
const staticPath = './demo12'

app.use(static(
  path.join( __dirname,  staticPath)
))

app.use( async ( ctx ) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.log('server is starting at port 3000')
})
``` 

打开[http://localhost:3000/] 会默认显示index.html中的内容，效果同[http://localhost:3000/index.html]

打开[http://localhost:3000/demo.js] 或[http://localhost:3000/koa.jpg] (后面是静态资源的文件名)，会在网页中显示静态资源的文件内容。

输入其他url会显示helloworld。
```
```
**********************************
4. **log4js** 是一个 nodejs 日志管理工具，可以将日志以各种形式输出到各种渠道
> 默认不会有任何输出，`level`默认等级为`off`

5. **handlebars** 模板引擎
6. **Nunjucks** 模板引擎
> `Environment` 类用来管理模板，使用他可以加载模板，模板之间可以继承和包含

7. http请求
> **bluebird.promise**(异步处理) + **requset**(发送请求)
> cookie 操作 ctx.headers.cookie

## webpack 打包工具
1. **entry** 多个入口
2. **output** 出口
3. **module** 模块
> `html-loader` 复用html模板 *坑* 无法处理 html 标签 中引入的图片资源
> `file-loader`
> `url-loader` 文件大小低于指定值的图片，转为base64字符串
> `babel-loader` babel-preset-env babel-polyfill
> `style-loader` `css-loader`
4. **plugin** 插件
> `clean-webpack-plugin`: clean-webpack-plugin: D:\public\js is outside of the project root. Skipping...
  此时需加上 root 配置
> `html-webpack-harddisk-plugin` + `html-webpack-plugin` 可以将文件写入disk
  ``` javascript
  new HtmlWebpackPlugin({
		alwaysWriteToDisk: true
	}),
  new HtmlWebpackHarddiskPlugin()
  ```
> **CopyWebpackPlugin** *坑* 处理 html 中引入的图片资源
> **ExtractTextPlugin** 分离文件 需安装最新版
> **config.optimization.splitChunks** 拆分代码
> **HashedModuleIdsPlugin** 该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境

## npm 
1. **npm-run-all**  run-p run-s