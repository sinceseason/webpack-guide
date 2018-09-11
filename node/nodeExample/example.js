const path = require('path');

console.log(__dirname);     // D:\custom\node\nodeExample
console.log(__filename);    // d:\custom\node\nodeExample\example.js

path.resolve(__dirname, 'src');     // "d:\custom\node\nodeExample\src"
path.resolve(__dirname, '/src');    // "d:\src"
path.resolve('/foo/bar', './baz');  // 返回: "d:\foo\bar\baz"
path.resolve('/foo/bar', '../baz');  // 返回: "d:\foo\baz"
path.resolve('/foo/bar', '/tmp/file/');     // 返回: 'd:/tmp/file'
path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 当前工作目录为 d:/custom，返回"d:\custom\wwwroot\static_files\gif\image.gif"

path.join(__dirname, 'dist');   // "d:\custom\node\nodeExample\dist"
path.join(__dirname, '/dist');  // "d:\custom\node\nodeExample\dist"
path.join(__dirname, './dist');  // "d:\custom\node\nodeExample\dist"
path.join(__dirname, '../dist');  // "d:\custom\node\dist"
path.join(__dirname, '..', 'dist')  // "d:\custom\node\dist"