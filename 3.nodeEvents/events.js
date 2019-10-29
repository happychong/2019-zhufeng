function EventEmitter() {
    this._events = Object.create(null);
}
EventEmitter.prototype.on = function (type, fn) {
    if (type !== 'newListener') {
        this.emit('newListener', type);
    }
    if (!this._events) {
        this._events = Object.create(null);
    }
    if (!this._events[type]) {
        this._events[type] = [];
    }
    this._events[type].push(fn);
}
EventEmitter.prototype.once = function (type, fn) {
    // 原理，先绑定，绑定的函数执行后，再删除绑定的函数
    let tempFn = () => {
        fn.call(this);
        this.off(type, tempFn);
    };
    // 增加 _sourceFn 为了 off 的时候删除用
    tempFn._sourceFn = fn;
    this.on(type, tempFn);
}
EventEmitter.prototype.off = function (type, fn) {
    if (this._events[type]) {
        if (this._events[type].indexOf(fn) > -1) {
            // 直接的方法解绑
            return this._events[type].splice(this._events[type].indexOf(fn), 1);
        }
        if (fn._sourceFn && this._events[type].indexOf(fn._sourceFn) > -1) {
            // once 的方法解绑
            return this._events[type].splice(this._events[type].indexOf(fn._sourceFn), 1);
        }
        for (let key in this._events[type]) {
            let item = this._events[type][key];
            if (item._sourceFn && fn === item._sourceFn) {
                // 匹配到了要解绑的方法
                this._events[type].splice(key, 1);
                break;
            }
        }
    }
}
EventEmitter.prototype.emit = function (type, ...args) {
    let that = this;
    if (this._events[type]) {
        let a = 0;
        let copyArr = this._events[type].slice(0);
        copyArr.forEach(fn => {
            fn.call(that, ...args);
        })
    }
}
module.exports = EventEmitter;