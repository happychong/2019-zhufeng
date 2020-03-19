import React from 'react';
import { render } from 'react-dom';
import './styles/index.css';

render(
  <h1 className="title">hello</h1>,
  document.getElementById('root')
)

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


// 动态加载文件
// 场景：页面上有个按钮，按钮点击方法中调用了 asyncImport.js 中的 addSum 方法，如果 asyncImport.js 文件比较大，而页面上按钮并没有被点击，那么页面初始化的时候加载 asyncImport.js 文件就是浪费的，我们希望当点击按钮的时候，再加载 asyncImport.js 文件，这样比较合理
// 注释掉，改为 click 中动态导入
// import { addSum } from './asyncImport.js';
let button = document.createElement('button');
button.addEventListener('click', () => {
  // console.log(addSum(1, 2)); // 注释掉，改为下面的动态导入

  // import语法：动态导入文件  类似路由的懒加载
  // 返回一个promise
  import(/*webpackChunkName: 'asyncImportName'*/'./asyncImport.js').then(data => {
    // /*webpackChunkName: 'asyncImportName'*/ 是魔法字符串，格式就是这样类似注释
    // 这里设置的名称 asyncImportName 会被传到webpack-> output -> chunkFilename -> [name]
    console.log(data.addSum(1, 2));
  });
  // webpack 会默认把import()这样的语法单独打包成一个文件，当点击的时候，会用jsonp动态加载这个文件，可以实现代码分割
});
button.innerHTML = '点我异步加载文件，运行文件中的方法';
document.body.appendChild(button);