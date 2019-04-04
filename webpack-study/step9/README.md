# shimming

## 使用场景
1. webpack 编译器(compiler)能够识别遵循 ES2015 模块语法、CommonJS 或 AMD 规范编写的模块。然而，一些第三方的库(library)可能会引用一些全局依赖（例如 jQuery 中的 $）。这些库也可能创建一些需要被导出的全局变量。这些“不符合规范的模块”就是 shimming 发挥作用的地方
2. shimming 另外一个使用场景就是，当你希望 polyfill 浏览器功能以支持更多用户时。在这种情况下，你可能只想要将这些 polyfills 提供给到需要修补(patch)的浏览器（也就是实现按需加载）

## 全局变量
### **ProvidePlugin** 插件
通过 webpack 编译的每个模块中，通过访问一个变量来获取到 package 包。如果 webpack 知道这个变量在某个模块中被使用了，那么 webpack 将在最终 bundle 中引入我们给定的 package
````
plugins: [
	new webpack.ProvidePlugin({
		_: 'lodash'
	})
]
````
上面的本质为：
> 如果你遇到了至少一处用到 lodash 变量的模块实例，那请你将 lodash package 包引入进来，并将其提供给需要用到它的模块。

````
plugins: [
	new webpack.ProvidePlugin({
		// _: 'lodash'
		join: ['lodash', 'join']
	})
]
````
> 使用 ProvidePlugin 暴露某个模块中单个导出值, *[module, child, ...children?]* ,无论 join 方法在何处调用，我们都只会得到的是 lodash 中提供的 join 方法

## 细粒度shimming
1. 一些传统的模块依赖的 this 指向的是 window 对象
````index.js 
this.alert('Hmmm, this probably isn\'t a great idea...')
````
2. 当模块运行在 CommonJS 环境下这将会变成一个问题，也就是说此时的 this 指向的是 module.exports。在这个例子中，你可以通过使用 imports-loader 覆写 this
````
rules: [
    {
        test: require.resolve('index.js'),
        use: 'imports-loader?this=>window'
    }
]
````
3. 使用 exports-loader，将一个全局变量作为一个普通的模块来导出。例如，为了将 file 导出为 file 以及将 helpers.parse 导出为 parse，做如下调整：
````
{
	test: require.resolve('global.js'),
	use: 'exports-loader?file,parse=helpers.parse'
}
````
> 现在从我们的 entry 入口文件中(即 src/index.js)，我们能 import { file, parse } from './globals.js'; 

## 加载polyfills
**babel-polyfill**
**whatwg-fetch**