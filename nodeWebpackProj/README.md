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
```
const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const app = new Koa()

//设置静态资源的路径 
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

打开http://localhost:3000/ 会默认显示index.html中的内容，效果同http://localhost:3000/index.html

打开http://localhost:3000/demo.js 或http://localhost:3000/koa.jpg (后面是静态资源的文件名)，会在网页中显示静态资源的文件内容。

输入其他url会显示helloworld。
```
```
**********************************
4. **log4js** 是一个 nodejs 日志管理工具，可以将日志以各种形式输出到各种渠道
> 默认不会有任何输出，`level`默认等级为`off`

5. **handlebars** 模板引擎
6. **Nunjucks** 模板引擎
> `Environment` 类用来管理模板，使用他可以加载模板，模板之间可以继承和包含