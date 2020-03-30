(function(modules) { // webpackBootstrap : 启动函数
	// The module cache ： 模块缓存
	var installedModules = {};

	// The require function ：webpack 实现的浏览器的 require 方法
	function __webpack_require__(moduleId) {
		// Check if module is in cache ： 检查模块是否在缓存中，有的话直接返回模块的exports
		if(installedModules[moduleId]) {
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


	// expose the modules object (__webpack_modules__)
	__webpack_require__.m = modules;

	// expose the module cache
	__webpack_require__.c = installedModules;

	// define getter function for harmony exports
	__webpack_require__.d = function(exports, name, getter) {
		if(!__webpack_require__.o(exports, name)) {
			Object.defineProperty(exports, name, { enumerable: true, get: getter });
		}
	};

	// define __esModule on exports
	__webpack_require__.r = function(exports) {
		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
		}
		Object.defineProperty(exports, '__esModule', { value: true });
	};

	// create a fake namespace object
	// mode & 1: value is a module id, require it
	// mode & 2: merge all properties of value into the ns
	// mode & 4: return value when already ns object
	// mode & 8|1: behave like require
	__webpack_require__.t = function(value, mode) {
		if(mode & 1) value = __webpack_require__(value);
		if(mode & 8) return value;
		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
		var ns = Object.create(null);
		__webpack_require__.r(ns);
		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
		return ns;
	};

	// getDefaultExport function for compatibility with non-harmony modules
	__webpack_require__.n = function(module) {
		var getter = module && module.__esModule ?
			function getDefault() { return module['default']; } :
			function getModuleExports() { return module; };
		__webpack_require__.d(getter, 'a', getter);
		return getter;
	};

	// Object.prototype.hasOwnProperty.call
	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

	// __webpack_public_path__
	__webpack_require__.p = "";

  // Load entry module and return exports : 加载入口模块并返回道处对象 __webpack_require__.s = 入口模块Id
	return __webpack_require__(__webpack_require__.s = "./src/index.js");
})({
  "./src/index.js": (function(module, exports, __webpack_require__) {
    let title = __webpack_require__("./src/title.js");
    console.log(title);
  }),
  "./src/title.js": (function(module, exports) {
    module.exports = 'title';
  })
});