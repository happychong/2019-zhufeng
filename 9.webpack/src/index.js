let res = require('./a-module.js');

// 引入css
import './styles/index.css';
// 引入scss
// import './styles/a.scss'

// 引入图片 - 需要获取当前打包后的图片路径:loader帮我们做这个
import timg from './timg.jpg';
let img = document.createElement('img');
img.src = timg;
document.body.appendChild(img);


// js 转化 es6 -> es5
const fn = () => {}
fn();

// @babel/plugin-proposal-class-properties ： 类的转化插件
// 类的新语法 - 草案语法
@log
class A {
    a = 1;
}
new A;
function log(target) {}
// 作用同下注释
// class A {
//     constructor() {
//         this.a = 1;
//     }
// }

// es7 语法 默认不能转化实例上的语法
// 转化设置见 .babelrc > presets > useBuiltIns
[1, 2, 3].includes(1);

// react
import React from 'react';
import ReactDOM from 'react-dom';
ReactDOM.render(<div>hello</div>, document.getElementById('react-root'));
