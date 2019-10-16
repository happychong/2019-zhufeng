const path = require('path');
const fs = require('fs');
const vm = require('vm');

// node Module 源码核心逻辑 - require()
// Module._resolveFilename 解析文件的名字 获取文件的绝对路径
// module.load(filename) 加载模块
// fs.readFileSync(filename, 'utf8') 同步读取文件内容
// 根据内容生成函数
// 让函数执行 将module.exports 传入给用户，用户会给moudle.exports赋值
// 把module.exports返回

const wrapper = [
    '(function(exports, module, require){\r\n',
        // ';return module.exports',
    '\r\n})'
]

function Module(absPath) {
    this.id = absPath;
    this.exports = {};
}
Module.prototype.load = function () {
    let scriptStr = fs.readFileSync(this.id, 'utf8');
    let fnStr = wrapper[0] + scriptStr + wrapper[1];
    let fn = vm.runInThisContext(fnStr);
    // this指向
    fn.call(this, this.exports, this, req)
}

function req(file) {
    // 1) 把当前文件读取出来 把相对路径转化成绝对路径
    let absPath = path.resolve(__dirname, file);
    // 2)创建一个模块 模块就是要有一个exports属性
    let module = new Module(absPath);
    // 3)加载模块
    module.load();
    return module.exports
}

let a = req('./a.js');
console.log(a);
