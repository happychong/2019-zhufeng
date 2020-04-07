let fs = require('fs');

// plugin 是一个类，要有apply方法可以调用
class NodeEnvironmentPlugin {
  apply(compiler) {
    // 读文件的时候使用的模块
    compiler.inputFileSystem = fs;
    // 写文件的时候使用的模块
    compiler.outputFileSystem = fs;
  }
}
module.exports = NodeEnvironmentPlugin;