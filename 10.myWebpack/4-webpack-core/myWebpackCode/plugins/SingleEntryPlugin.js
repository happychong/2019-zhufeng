
class SingleEntryPlugin {
  constructor(context, entry, name) {
    this.context = context;
    this.entry = entry; // 入口文件 相对路径
    this.name = name; // 名称 main
  }
  apply(compiler) {
    // make 是一个异步的钩子
    compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
      // compilation 一次编译对象
      let { context, entry, name } = this;
      // 开始从入口文件进行递归编译
      console.log('make.tapAsync');
      compilation.addEntry(context, entry, name, callback);
    });
  }
}
module.exports = SingleEntryPlugin;