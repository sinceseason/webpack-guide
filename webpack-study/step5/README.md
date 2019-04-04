# 生产环境构建

## 配置
1. 为每个环境编写 **彼此独立** 的 webpack 配置
2. 使用 **_webpack-merge_** 配置

## 压缩代码 插件
> 删除未引用代码
1. UglifyJSPlugin
2. BabelMinifyWebpackPlugin
3. ClosureCompilerPlugin

## source map
+ 生产环境 soruce-map
+ 开发环境 inline-source-map

## 指定环境
**DefinePlugin** 插件定义系统环境变量

## 分离css
使用 **ExtractTextPlugin** 将css分离为单独的文件