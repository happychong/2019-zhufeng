// 自执行函数 参数为应用到的模块
(function(modules){ // webpackBootstrap : 启动函数
  var installedModules = {}; // The module cache ： 模块缓存
  function __webpack_require__(moduleId) { // The require function ：webpack 实现的浏览器的 require 方法
    // Check if module is in cache ： 检查模块是否在缓存中，有的话直接返回模块的exports
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)：创建一个新的模块 （并且放入缓存中）
    var module = installedModules[moduleId] = {
      i: moduleId, // i - index - 模块id
      l: false, // l - loaded - 模块是否加载完成
      exports: {} // 模块的导出对象
    };
    // Execute the module function ： 执行模块的方法
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // Flag the module as loaded ： loaded设置为true
    module.l = true;
    // Return the exports of the module ： 返回模块的导出对象(module.exports)
    return module.exports;
  }
  // Load entry module and return exports : 加载入口模块并返回道处对象 __webpack_require__.s = 入口模块Id
  return __webpack_require__('./src/index.js');
})({
  './src/index.js': (function (module, exports, __webpack_require__) {
    let title = __webpack_require__('./src/title.js');
    console.log(title);
  }),
  './src/title.js': (function (module, exports, __webpack_require__) {
    module.exports = 'title';
  })
})