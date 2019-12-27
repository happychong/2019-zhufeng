import React from 'react';
import { render } from 'react-dom';
import './styles/index.css';

render(<h1 className="title">hello</h1>, document.getElementById('root'))

// import $ from 'jquery';
// import 引入 jquery的形式，内容都会被打包到bundle里，文件体谅大，需要按需引入
// 现在在index.html 中 引入了cdn 链接 https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// 这里就不需要import $ ，就可以直接用了，但是直接用比较怪异
// 所以我们还是把 import $ from 'jquery' 写到这里，但是这个 $ 应该是cdn加载进来的, webpack配置externals
import $ from 'jquery';
console.log($);


// tree-shaking 去掉没用的代码，只支持es6模块 （webpack自带功能）
import { minus } from './calc';
console.log(minus(1, 2));


// package.json 设置 "sideEffects", 打包删除副作用代码（test.js)
import test from './test';
// 但是设置sideEffects后，这样导入样式又会被忽略掉
// 解决办法1：用require动态导入方式引入样式（low的办法）
// 解决办法2：package.json，用数组的方式设置，生命css文件不是副作用代码
import './styles/index.css'
// require('./styles/index.css')



// scope-Hoisting
import d from './scope-Hoisting';
// 导出d，打包后导出的是一个函数（消耗内存），如下
// (function () {
//     return 6
// })()
console.log(d);
