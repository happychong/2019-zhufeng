// 同步导入lodash
import lodash from 'lodash';
console.log(lodash);
// 同步导入mergeDeepObject
import mergeDeepObject from 'mergeDeepObject';
console.log(mergeDeepObject({a:1, b:2}));
// (1)：以上同步引入的 lodash 和 mergeDeepObject 都是 node_modules 下的包，所以被一起打包到 defaultVendors~index~login.min.js 中

// 同步导入vue
// 注意这里配置的 priority 需要高于 defaultVendors 的 priority， 代码才会被单独抽离，否则会被一同打包到 defaultVendors~index~login.min.js 中
import Vue from 'vue';
console.log(Vue);
// (2)：这里匹配到了 webpack -> optimization -> splitChunks -> cacheGroups -> vue  所以抽离打包到 vur~index~login.min.js 中

console.log('I am login.js');

// 动态导入 asyncImport   import()语法默认自动进行代码分割，不管webpack -> optimization -> splitChunks -> chunks 是 async 还是 initial
import(/*webpackChunkName: 'asyncImportName'*/'../asyncImport.js').then(data => {
  // 这里设置的名称 asyncImportName 会被传到 webpack-> output -> chunkFilename -> [name]，没写魔法字符串的话，name默认从0开始递增
  console.log(data.addSum(1, 2));
});
// (3)：以上动态导入 asyncImport 代码，代码抽离一个单独的模块，应用魔法字符串的名字，asyncImportName.min.js

// 同步引入 multipleImportFile 模块
import multipleImportFile from './multiple-import-file';
console.log(multipleImportFile(2, 4));
// (4)：以上匹配到 webpack -> optimization -> splitChunks -> cacheGroups -> common  所以抽离打包到 common~index~login.min.js 中
