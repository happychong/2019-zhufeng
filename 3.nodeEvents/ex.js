
let EventEmitter = require('./events');
let util = require('util');
function Girl() {
    // 继承实例属性
    EventEmitter.call(this);
    this.name = 'nv';
}
util.inherits(Girl, EventEmitter);

let girl = new Girl();

let listener1 = (who) => {
    console.log(who + '哭');
}
let listener2 = function () {
    console.log(this.name + ' 逛街');
}
let happyFn = function () {
    console.log('I am happy');
}
girl.on('newListener', (type) => {
    // newListener 绑定的函数，只要调用 on 方法，就会触发 newListener 函数
    if (type === 'happy') {
        process.nextTick(() => {
            // on('happy')的时候被调用，全部on之后执行emit，所以 'I am happy' 执行了4次
            girl.emit(type)
        });
    }
});
girl.once('happy', happyFn);
girl.once('happy', happyFn);

girl.off('happy', happyFn);
// girl.emit('happy');

girl.on('女生失恋', listener1);
girl.on('女生失恋', listener2);
girl.emit('女生失恋', 'jack');
