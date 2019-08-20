// 1)解决并发问题 （同步多个异步方法的执行结果）
// 2)链式调用的问题 （先获取name，通过name再获取age）  解决多个回调嵌套的问题

// Promise 是一个类
// 1)每次new一个Promise 都需要传递一个执行器，执行器立即执行
// 2)执行器函数中，有2个参数，resolve-解决，reject-拒绝
// 3）默认Promise有3个状态 pendding-等待  resolve 表示成功 reject 表示拒绝
// 4）如果一旦成功，不能变成失败 ， 一旦失败，不能变成成功
// 5) 每个promise都有一个then方法  -  没有完全解决回调问题
let Promise = require('./promise')
let p = new Promise((resolve, reject) => {
    // 立即执行
    setTimeout(() => {
        resolve('我有钱');
        // throw new Error('错误')
    }, 500);
})
p.then(data => {
    // 成功的回调
    console.log('success', data);
}, err => {
    // 失败的回调
    // 失败的情况
    //  1-调用了reject
    //  2-执行器里抛出异常 throw new Error()
    console.log('err', err);
})
p.then(data => {
    console.log('success2', data);
}, err => {
    console.log('err2', err);
})