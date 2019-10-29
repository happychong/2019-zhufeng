const path = require('path');
const fs = require('fs');
const vm = require('vm');
console.log(__dirname, '---useA');
// node Module 源码核心逻辑 - require()
// Module._resolveFilename 解析文件的名字 获取文件的绝对路径
// module.load(filename) 加载模块
// fs.readFileSync(filename, 'utf8') 同步读取文件内容
// 根据内容生成函数
// 让函数执行 将module.exports 传入给用户，用户会给moudle.exports赋值
// 把module.exports返回
const wrapper = [
    '(function(exports, require, module, __filename, __dirname){\r\n',
        // ';return module.exports',
    '\r\n})'
]

function Module(absPath) {
    this.id = absPath;
    this.exports = {};
}

Module.prototype.load = function () {
    let type = path.extname(this.id);
    // 根据扩展名不同，执行不同的方法
    Module.extensions[type](this);
}
Module._cache = {};
Module.extensions = {
    '.js'(module) {
        // 读取文件的内容
        let scriptStr = fs.readFileSync(module.id, 'utf8');
        let fnStr = wrapper[0] + scriptStr + wrapper[1];
        // vm.runInThisContext 让字符串变成js代码，变成了function
        let fn = vm.runInThisContext(fnStr);
        // this指向
        fn.call(module, module.exports, req, module, module.id, path.dirname(module.id))
    },
    '.json'(module) {
        // 首选读取文件
        let scriptStr = fs.readFileSync(module.id, 'utf8');
        // json类型，直接导出文件内容
        module.exports = JSON.parse(scriptStr)
    }
}
Module.resolvePath = function (filename) {
    // 1) 把当前文件读取出来 把相对路径转化成绝对路径
    let absPath = path.resolve(__dirname, filename);
    let realPath = null;
    let flag = fs.existsSync(absPath);
    if (!flag) {
        let keys = Object.keys(Module.extensions);
        for (let i = 0; i < keys.length; i++) {
            if (fs.existsSync(absPath + keys[i])) {
                realPath = absPath + keys[i];
                break;
            }
        }
    } else {
        realPath = absPath;
    }
    if (!realPath) {
        // 如果加完后缀名之后，还是没有文件，保存
        throw new Error(filename + '---文件路径不存在')
    }
    return realPath;
}
// node模块，会按照后缀名查找，先.js文件，没有再查找.json文件
function req(filename) {
    let realPath = Module.resolvePath(filename);
    if (Module._cache[realPath]) {
        return Module._cache[realPath].exports;
    }
    // 2)创建一个模块 模块就是要有一个exports属性
    let module = new Module(realPath);
    module.filename = realPath;
    // 3)加载模块
    module.load();
    Module._cache[realPath] = module;
    return module.exports
}

let a = req('./deep/a');
console.log(a);
let a2 = req('./a');
console.log(a2);
let b = req('./b');
console.log(b);
