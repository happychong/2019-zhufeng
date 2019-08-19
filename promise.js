class Promise {
    constructor(executor) {
        let resolve = () => {};
        let reject = () => {};
        // 创建Promise executor立即执行
        executor(resolve, reject);
    }
}
// 导出当前类 commonJs定义方式
module.exports = Promise