# 代码分离
> 将代码分离到不同得 bundle 中，并实现按需加载

## 3种常用得代码分离方法
* 入口起点：使用 entry 配置手动地分离代码。
* 防止重复：使用 CommonsChunkPlugin 去重和分离 chunk。
* 动态导入：通过模块的内联函数调用来分离代码。

## 入口起点

## 防止重复
**CommonsChunkPlugin** 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk

## 分离代码插件和loaders
* ExtractTextPlugin: 用于将 CSS 从主应用程序中分离。
* bundle-loader: 用于分离代码和延迟加载生成的 bundle。
* promise-loader: 类似于 bundle-loader ，但是使用的是 promises。
