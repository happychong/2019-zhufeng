// 此文件功能：按loader的类别及loaders/#configuration配置获得要执行的loader绝对路径的数组
// loader 的4种类型：inline normal pre post
// ex：eslint 代码风格检查 一般用于前置

let path = require('path');
// 正常情况下module的查找路径（变量模拟）
let nodeModules = path.resolve(__dirname, 'node_modules');
// 模拟需要加载的文件 - 行内（inline）loader 
// 业务代码示例：import a from ''!inline-loader1!inline-loader2!./style.css'' 或者 require('!inline-loader1!inline-loader2!./style.css'u)
let request = '!inline-loader1!inline-loader2!./style.css';
// 模拟webpack loader 的配置
let rules = [
  // enforce ：配置loader类型-手动配置loader执行顺序
  { test: /\.css$/, enforce: 'pre', use:['pre-loader1', 'pre-loader2'] }, // pre 前置的
  { test: /\.css$/, use:['normal-loader1', 'normal-loader2'] }, // normal 普通的
  { test: /\.css$/, enforce: 'post', use:['post-loader1', 'post-loader2'] } // post 后置
];

// 以上模拟数据结束，一下开始原理部分

// Fn：把路径变为绝对路径
var resolveLoader = loader => path.resolve(nodeModules, loader + '.js');

// loaders/#configuration——特殊配置 相关
// 不要前置&普通的loader，只剩下inline&post
const noPreAutoLoaders = request.startsWith('-!');
// 不要普通的loader
const noAutoLoaders = noPreAutoLoaders || request.startsWith('!');
// 不要pre&post&auto，只剩下inline了
const noPrePostAutoLoaders = request.startsWith('!!');

let inlineLoaders = request.replace(/^-?!+/, '').replace(/^!!+/g, '!').split('!'); // ["inline-loader1", "inline-loader2", "./style.css"]
// 加载的资源
let resource = inlineLoaders.pop(); // "./style.css"

let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === 'pre') {
      preLoaders.push(...rule.use);
    } else if (rule.enforce === 'post') {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
let loaders = null;
if (noPrePostAutoLoaders) {
  loaders = [...inlineLoaders];
} else if (noPreAutoLoaders) {
  loaders = [...postLoaders, ...inlineLoaders];
} else if (noAutoLoaders) {
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}

// 把模块名转变成绝对路径
loaders = loaders.map(loader => resolveLoader(loader));
console.log(loaders);


