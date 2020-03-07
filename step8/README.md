# 创建 library

## 基本配置
现在，让我们以某种方式打包这个 library，能够实现以下几个目标：
1. 不打包 lodash，而是使用 externals 来 require 用户加载好的 lodash。
2. 设置 library 的名称为 webpack-numbers.
3. 将 library 暴露为一个名为 webpackNumbers的变量。
4. 能够访问其他 Node.js 中的 library。

此外，用户应该能够通过以下方式访问 library：
1. ES2015 模块。例如 import webpackNumbers from 'webpack-numbers'。
2. CommonJS 模块。例如 require('webpack-numbers').
3. 全局变量，当通过 script 脚本引入时

webpack.config.js
```js
var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
  },
};
```

## 外部化 lodash
现在，如果执行 webpack，你会发现创建了一个非常巨大的文件。如果你查看这个文件，会看到 lodash 也被打包到代码中。在这种场景中，我们更倾向于把 lodash 当作 peerDependency。也就是说，用户应该已经将 lodash 安装好。因此，你可以放弃对外部 library 的控制，而是将控制权让给使用 library 的用户。

这可以使用 **externals** 配置来完成
webpack.config.js
```js
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
    },
+   externals: {
+     lodash: {
+       commonjs: 'lodash',
+       commonjs2: 'lodash',
+       amd: 'lodash',
+       root: '_'
+     }
+   }
  };
```

## 暴露 library
使用 **library**, **libraryTarget** 属性
webpack.config.js
```js
  var path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'webpack-numbers.js',
+     library: 'webpackNumbers',
+     libraryTarget: 'umd',
    },
    externals: {
      lodash: {
        commonjs: 'lodash',
        commonjs2: 'lodash',
        amd: 'lodash',
        root: '_'
      }
    }
  };
```
library 设置方法:
* 变量：作为一个全局变量，通过 script 标签来访问（libraryTarget:'var'）。
* this：通过 this 对象访问（libraryTarget:'this'）。
* window：通过 window 对象访问，在浏览器中（libraryTarget:'window'）。
* UMD：在 AMD 或 CommonJS 的 require 之后可访问（libraryTarget:'umd'）。

如果设置了 library 但没设置 libraryTarget，则 libraryTarget 默认为 var。

## 暴露样式表
为了暴露和 library 关联着的样式表，你应该使用 **ExtractTextPlugin**。然后，用户可以像使用其他样式表一样使用和加载这些样式表。 