# tree shaking
>> 删除未引用代码

## 为了学会使用 _tree shaking_，你必须……
   1.使用 ES2015 模块语法（即 import 和 export）。
   2.在项目 package.json 文件中，添加一个 "sideEffects" 入口。
   3.引入一个能够删除未引用代码(dead code)的压缩工具(minifier)（例如 **UglifyJSPlugin**）。
