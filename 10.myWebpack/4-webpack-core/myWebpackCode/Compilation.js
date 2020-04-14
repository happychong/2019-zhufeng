
const { Tapable, SyncHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable');
const path = require('path');
const Chunk = require('./Chunk');
let normalModuleFactory = require('./NormalModuleFactory');
let ejs = require('ejs');
let fs = require('fs');
const mainTemplate = fs.readFileSync(path.posix.join(__dirname, './main.ejs'), 'utf8');
let mainRunder = ejs.compile(mainTemplate);

class Compilation extends Tapable{
  constructor (compiler) {
    super();
    this.compiler = compiler;
    this.options = compiler.options;
    this.context = compiler.context;
    this.inputFileSystem = compiler.inputFileSystem;
    this.outputFileSystem = compiler.outputFileSystem;

    this.hooks = {
      addEntry: new SyncHook(['entry', 'name']),
      seal: new SyncHook([]),
      beforeChunks: new SyncHook([]),
      afterChunks: new SyncHook([])
      // make: new AsyncParallelHook(['compilation']),
      // beforeRun: new AsyncSeriesHook(['compiler']), // AsyncSeriesHook 异步串行钩子，先干一件再干一件，每一个都可以异步
      // done: new AsyncSeriesHook(['params']) // 一切完成之后会出发done这个钩子
    };
    // 代表我们的入口，里面放着所有的入口模块
    this.entries = [];
    this.modules = []; // 模块实例的数组 
    this._modules = {}; // key 是模块的绝对路径 value 是模块实例
    this.chunks = []; // 代码块
    this.files = []; // 文件数组
    this.assets = {}; // 资源对象
  }
  addEntry(context, entry, name, finallyCallback) {
    console.log('addEntry 进来了 ---- 接下来的call，从这里开始');
    this.hooks.addEntry.call(entry, name); // entry: './src/index.js'   name: 'main'
    this._addModuleChain(context, entry, name);
    finallyCallback();
  }
  _addModuleChain(context, entry, name) {
    let module = normalModuleFactory.create({
      name, // 所属代码块的名字 main
      entry,
      context: this.context,
      request: path.posix.join(context, entry) // 此模块的绝对路径
    });
    module.build(this);
    // 把编译后的入口模块添加到入口数组里
    this.entries.push(module);
  }
  buildDependencies(module, dependencies) {
    module.dependencies.map(data => {
      let childModule = normalModuleFactory.create(data);
      return childModule.build(this);
    })
  }
  seal(callback) {
    this.hooks.seal.call();
    this.hooks.beforeChunks.call();
    for (let entryModule of this.entries) {
      let chunk = new Chunk(entryModule);
      this.chunks.push(chunk);
      // 模块的名字和代码的名字一致，这个模块就属于这个代码
      // this.chunks.modules = this.modules.filter(module => module.name === chunk.name);
      chunk.modules = this.modules.filter(module => module.name === chunk.name);
    }
    this.hooks.afterChunks.call();
    this.createChunkAssets();
    callback();
  }
  createChunkAssets() {
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      chunk.files = [];
      const file = chunk.name +'.js';
      let source = mainRunder({
        entryId: chunk.module.moduleId, // 入口模块id
        modules: chunk.modules
      });
      chunk.files.push(file);
      this.emitAsset(file, source);
    }
  }
  emitAsset(file, source) {
    this.assets[file] = source;
    this.files.push(file);
  }
}
module.exports = Compilation;