const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

// promise的处理函数
const resolvePromise = (promise2, x, resolve, reject) => {
    // 处理x的类型 来决定是调用resove还是reject
    // 有可能是别人的promise，所以必须要写的很严谨
    if (promise2 === x) { // 自己等待自己完成
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    // 判断x是不是普通值
    if ((typeof x === 'object' && typeof x !== null) || typeof x === 'function') {
        // 可能是promise 如何判断是不是promise   promise上有then
        let called; // 默认没有调用成功和失败
        try {
            let then = x.then; // 看看有没有then方法
            if (typeof then === 'function') {
                // x.then(y => {}, r => {}) // 这种方法会再次触发x的getter（then），容易有错
                // 这里认为就是promise了
                then.call(x, y => { // 如果是一个promise 就采用这个promise的结果
                    // 实现递归解析
                    if (called) return;
                    claled = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return;
                    claled = true;
                    reject(r);
                })
            } else {
                // 常量直接抛出去
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            claled = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
    resolve(x);
}

class Promise {
    constructor(executor) {
        this.value = null;
        this.reason = null;
        this.status = PENDING;
        this.fulFiledFns = [];
        this.rejectedFns = [];
        let resolve = (value) => {
            if (value instanceof Promise) {
                // 如果一个promise resolve了一个新的promise 会等到这个内部的promise执行完成
                return value.then(resolve, reject); // 和resolvePromise功能是一样的
            }
            if (this.status === PENDING) {
                this.value = value;
                this.status = FULFILLED;
                this.fulFiledFns.forEach(fn => fn())
            }
        };
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.rejectedFns.forEach(fn => fn())
            }
        };
        // 创建Promise executor立即执行
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFULFILLED, onRejectef) {
        // 可选参数 没穿 就给一个默认参数
        onFULFILLED = typeof onFULFILLED === 'function' ? onFULFILLED : val => val;
        onRejectef = typeof onRejectef === 'function' ? onRejectef : err => {
            throw err;
        };
        // then方法调用后，应该返回一个新的promise
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                try {
                    let x = onFULFILLED(this.value);
                    setTimeout(() => {
                        resolvePromise(promise2, x, resolve, reject);
                    })
                } catch (e) {
                    reject(e);
                }
            }
            if (this.status === REJECTED) {
                try {
                    let x = onRejectef(this.reason);
                    setTimeout(() => {
                        resolvePromise(promise2, x, resolve, reject);
                    })
                } catch (e) {
                    reject(e);
                }
            }
            if (this.status === PENDING) {
                this.fulFiledFns.push(() => {
                    try {
                        let x = onFULFILLED(this.value);
                        setTimeout(() => {
                            resolvePromise(promise2, x, resolve, reject);
                        })
                    } catch (e) {
                        reject(e);
                    }
                });
                this.rejectedFns.push(() => {
                    try {
                        let x = onRejectef(this.reason)
                        setTimeout(() => {
                            resolvePromise(promise2, x, resolve, reject);
                        })
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        })
        return promise2;
    }
}
// 导出当前类 commonJs定义方式
module.exports = Promise

// promises-aplus-tests 文件名
// 测试是否符合promise A+规范的包  先全局安装 ，再执行上面代码测试
// https://githut.com/promises-aplus/promises-tests