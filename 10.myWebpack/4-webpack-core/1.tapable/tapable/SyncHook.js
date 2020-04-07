let Hook = require('./Hook');
let HookCodeFactory = require('./HookCodeFactory'); 
let factory = new HookCodeFactory();

class SyncHook extends Hook{
  compile(options) {
    // this:当前的hook， options：{_arggs, taps} 
    factory.setup(this, options);   // setup 其实就是给 this._x 赋值，this._x = [fn, fn]
    return factory.create(options);
  }
}
module.exports = SyncHook;