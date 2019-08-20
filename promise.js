const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
    constructor(executor) {
        this.value = null;
        this.reason = null;
        this.status = PENDING;
        this.fulFiledFns = [];
        this.rejectedFns = [];
        let resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value;
                this.status = FULFILLED;
                this.fulFiledFns.forEach(fn => fn(this.value))
            }
        };
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason;
                this.status = REJECTED;
                this.rejectedFns.forEach(fn => fn(this.reason))
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
        if (this.status === FULFILLED) {
            onFULFILLED(this.value);
        }
        if (this.status === REJECTED) {
            onRejectef(this.reason);
        }
        if (this.status === PENDING) {
            this.fulFiledFns.push(onFULFILLED);
            this.rejectedFns.push(onRejectef);
        }
    }
}
// 导出当前类 commonJs定义方式
module.exports = Promise