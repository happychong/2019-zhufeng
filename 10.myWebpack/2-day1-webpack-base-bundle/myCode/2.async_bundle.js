(function(modules) {
	var installedModules = {}; // 模块缓存
	var installChunks = {
		main: 0
	};
	// 1：标记 installChunks[x] 为0表示加载成功
	// 2：modules 中加入新加载的模块，使新的模块可以被require
	// 2：执行异步加载的resolve方法
	function webpackJsonpCallback(data) {
		// data 格式如下
		// [["title"],{
		// 	"./src/title.js":
		// 	(function(module, exports) {
		// 		module.exports = 'title';
		// 	})
		// }]
		let chunkIds = data[0]; // ["title"]
		let moreModules = data[1]; // {"./src/title.js": (fn)}
		let resolves = [];
		for (let i = 0; i < chunkIds.length; i++) {
			let chunkId = chunkIds[i];
			resolves.push(installChunks[chunkId][0]);
			installChunks[chunkId] = 0; // 0:加载成功  原本是数组 这里重置为0
		}
		// 模块中（modules）加入新加载的模块 ，加入后就可以require（__webpack_require__）了
		for (let moduleId in moreModules) {
			modules[moduleId] = moreModules[moduleId];
		}
		while(resolves.length) {
			resolves.shift()(); // 取出第一个元素，并执行
		}
		// if (parentJsonFunction) {
		// 	parentJsonFunction(data);
		// }
	}
	// 加载模块 - 同步
	function __webpack_require__(moduleId) { // webpack 实现的浏览器的 require 方法
    // 检查模块是否在缓存中，有的话直接返回模块的exports
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 创建一个新的模块 （并且放入缓存中）
    var module = installedModules[moduleId] = {
      i: moduleId, // i - index - 模块id
      l: false, // l - loaded - 模块是否加载完成
      exports: {} // 模块的导出对象
    };
    // 执行模块的方法
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // loaded设置为true
    module.l = true;
    // 返回模块的导出对象(module.exports)
    return module.exports;
	}
	// 把模块的exports抛出为下一步then的参数
	__webpack_require__.t = function (value, mode) {
		// value="./src/title.js"     mode+7
		value = __webpack_require__(value); // module.exports = 'title';
		let ns = Object.create(null);
		Object.defineProperty(ns, '__esModule', { value: true }); // 表示这是一个es6modules
		Object.defineProperty(ns, 'default', { value });
		return ns; // {__esModule: true, default: 'title'}
	}
	// .e 加载模块 - 异步jsonp
	__webpack_require__.e = function (chunkId) { // title
		// let promises = []; // 声明一个promise
		var installChunkData = installChunks[chunkId]; // 取老的代码块数据
		let promise = new Promise(function (resolve, reject) {
			// 如果调用了resolve方法，此promise会变成成功态
			installChunkData = installChunks[chunkId] = [resolve, reject];
		});
		installChunkData[2] = promise; // installChunkData = [resolve, reject, promise]

		var script = document.createElement('script'); // 创建一个脚本标签
		script.src = chunkId + '.bundle.js'; // title.bundle.js
		document.head.appendChild(script); // jsonP原理，script标签加到页面里，立刻会请求服务器的文件，执行脚本
		return promise;
	}
	// .e 方法加载的脚本立即执行，执行时候执行了window['webpackJsonp'].push方法，下面代码重写了push方法，指向了webpackJsonpCallback
	var jsonArray = (window['webpackJsonp'] = window['webpackJsonp'] || []); // jsonArray = window['webpackJsonp'] || [];
	var oldJsonpFunction = jsonArray.push.bind(jsonArray); // oldJsonpFunction = jsonArray原有的push方法
	jsonArray.push = webpackJsonpCallback; 	// 重写jsonArr的push方法
	var parentJsonFunction = oldJsonpFunction; // 

  // 加载入口模块并返回道处对象 __webpack_require__.s = 入口模块Id
  return __webpack_require__('./src/index.js');
})({
	'./src/index.js': (function(module, exports, __webpack_require__) {
		// 同步加载
		// let title = require('./title.js');
		// console.log(title);
	
		// 异步加载
		let button = document.createElement('button');
		button.innerHTML = '点我异步加载';
		button.addEventListener('click', () => {
			__webpack_require__.e(/*! import() | title */ "title")
			.then(__webpack_require__.t.bind(null, /*! ./title.js */ "./src/title.js", 7))
			.then(result => {
				console.log(result.default);
			})
		})
		document.body.appendChild(button);
	
	})
});