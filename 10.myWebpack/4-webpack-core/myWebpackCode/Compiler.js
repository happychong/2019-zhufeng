const { Tapable, SyncHook, AsyncParallelHook, AsyncSeriesHook } = require('tapable');
const Stats = require('./Stats.js');
const mkdirp = require('mkdirp'); // 递归创建文件夹
const path = require('path');
// import Compilation from './Compilation.js';
const Compilation = require('./Compilation.js');
class Compiler extends Tapable{
  constructor (context) {
    super();
    this.hooks = {
      environment: new SyncHook([]),
      afterEnvironment: new SyncHook([]),
      afterPlugins: new SyncHook([]),
      entryOption: new SyncHook(['context', 'entry']),
      make: new AsyncParallelHook(['compilation']), // AsyncParallelHook 异步并发钩子 
      beforeRun: new AsyncSeriesHook(['compiler']), // AsyncSeriesHook 异步串行钩子，先干一件再干一件，每一个都可以异步
      run: new AsyncSeriesHook(['compiler']),
      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      thisCompilation: new SyncHook(['compilation', 'params']), // 启动第一次编译
      compilation: new SyncHook(['compilation', 'params']), // 开始第一次编译
      afterCompile: new AsyncSeriesHook(['params']),
      emit: new AsyncSeriesHook(['compilation']),
      done: new AsyncSeriesHook(['params']) // 一切完成之后会出发done这个钩子
    };
    this.options = {};
    this.context = context; // 当前上下文路径（工作路径）
  }
  emitAssets(compilation, callback) {
    const emitFiles = (err) => {
      // assets -- {文件名字，源码}
      let assets = compilation.assets;
      for (let file in assets) {
        let source = assets[file];
        let targetPath = path.posix.join(this.options.output.path, file); // posix : 让 windows 或 mac 分隔符都是一样的，都是linix的分隔符
        this.outputFileSystem.writeFileSync(targetPath, source);
      }
      callback();
    }
    this.hooks.emit.callAsync(compilation, (err)=>{
      mkdirp.sync(this.options.output.path);
      emitFiles(compilation, callback);
    });
  }
  run(finallyCallback) {
    // 开始编译
    const onCompiled = (err, compilation) => {
      // 编译完成后的回调
      console.log('Compiler onCompiled()');
      this.emitAssets(compilation, err => {
        const stats = new Stats(compilation);
        console.log('stats', stats);
        
        this.hooks.done.callAsync(stats, (err) => {
          return finallyCallback(err, stats);
        });
      });
    };
    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled);
      })
    })

    // callback(null, '编译运行结束')
  }
  newCompilation(params) {
    let compilation = new Compilation(this);
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }
  compile(onCompiled) { // 开始编译
    // beforeCompile 是异步的钩子，调用callAsync触发
    this.hooks.beforeCompile.callAsync({}, err => {
      // compile 同步钩子，调用 call 触发
      this.hooks.compile.call();
      // 创建一个新的 compilation 对象，这里放着本次编译的结果
      const compilation = this.newCompilation();
      this.hooks.make.callAsync(compilation, err => {
        console.log('make 完成');
        // seal 封包 通过模块生成代码块
        compilation.seal(err => {
          // afterCompile 编译完成
          this.hooks.afterCompile.callAsync(compilation, err => {
            return onCompiled(err, compilation); // 写入文件系统
          })
        })
      })
    });
  }
}
module.exports = Compiler;