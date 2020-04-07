let { SyncHook } = require('./tapable');
let queue = new SyncHook(['name', 'age']); // ['name', 'age'] 表示触发的时候要传递name参数
// tap 注册事件 call 触发事件
queue.tap('1', (name, age) => {
  console.log(1, name);
});
queue.tap('2', (name, age) => {
  console.log(2, name);
});
// 触发事件
queue.call('zhangsan', 10);