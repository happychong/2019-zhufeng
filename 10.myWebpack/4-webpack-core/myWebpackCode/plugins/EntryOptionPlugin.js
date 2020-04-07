let SingleEntryPlugin = require('./SingleEntryPlugin');

class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      // 开始监听单个入口
      // context:上下文绝对路径  entry：入口文件   main：入口文件代码块的默认名称（单入口文件，默认就是main）
      console.log('tap entryOption');
      if (typeof entry === 'string') {
        new SingleEntryPlugin(context, entry, 'main').apply(compiler);
      } else {
        for (let entryName in entry) {
          new SingleEntryPlugin(context, entry[entryName], entryName).apply(compiler);
        }
      }
    })
  }
}
module.exports = EntryOptionPlugin;