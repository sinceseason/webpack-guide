# 缓存
> 我们使用 webpack 来打包我们的模块化后的应用程序，webpack 会生成一个可部署的 /dist 目录，然后把打包后的内容放置在此目录中。只要 /dist 目录中的内容部署到服务器上，客户端（通常是浏览器）就能够访问网站此服务器的网站及其资源。而最后一步获取资源是比较耗费时间的，这就是为什么浏览器使用一种名为 缓存 的技术。可以通过命中缓存，以降低网络流量，使网站加载速度更快，然而，如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本。由于缓存的存在，当你需要获取新的代码时，就会显得很棘手

## webpack3.x 升级到 4.x
webpack.optimize.CommonsChunkPlugin has been removed, please use **config.optimization.splitChunks** instead

## config.optimization.splitChunks
在每次修改后的构建结果中，将 webpack 的样板和 manifest 提取出来。通过指定 entry 配置中未用到的名称，此插件会自动将我们需要的内容提取到单独的包中
``` javascript
optimization: {
	splitChunks: {
		cacheGroups: {
			commons: {
				chunks: "initial",
				name: "manifest",
			}
		}
	}
}
```

## 代码提取
将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
``` javascript
vendor: {
	chunks: 'initial',
	name: 'vendor',
}
```

## 文件hash变化
* main bundle 会随着自身的新增内容的修改，而发生变化。
* vendor bundle 会随着自身的 module.id 的修改，而发生变化。
* manifest bundle 会因为当前包含一个新模块的引用，而发生变化。

## 修复 vendor 的 hash 变化问题，插件：
* NamedModulesPlugin
* HashedModuleIdsPlugin

## 结论
缓存从凌乱变得清晰直接
