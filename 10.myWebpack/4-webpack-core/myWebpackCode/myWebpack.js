let NodeEnvironmentPlugin = require('./plugins/NodeEnvironmentPlugin.js');
const Compiler = require('./Compiler.js');
const WebpackOptionsApply = require('./WebpackOptionsApply');

// webpack 是一个函数
function webpack (options, callback) {
  // context：上下文地址（重要），或者指向参数里的上下文，或者指向当前的工作目录
  options.context = options.context || process.cwd();
  // 本次编译对象，一次编译智慧有一个compiler
  let compiler = new Compiler(options.context);
  compiler.options = options;
  // 设置node的环境 读写用哪个模块来做
  new NodeEnvironmentPlugin().apply(compiler);
  // 执行所有的插件
  if (options.plugins && Array.isArray(options.plugins)) {
    options.plugins.forEach(plugin => plugin.apply(compiler));
  }
  // 触发environment事件执行
  compiler.hooks.environment.call();
  // 触发afterEnvironment事件执行
  compiler.hooks.afterEnvironment.call();
  new WebpackOptionsApply().process(options, compiler);
  return compiler
}
module.exports = webpack;