let fs = require('fs');

// 读name.txt内容，根据内容读age.txt内容
// 原生写法
// fs.readFile('./name.txt', 'utf8', (err, data) => {
//     if (err) {
//         console.log(err);
//     }
//     fs.readFile(data, 'utf8', (err, data) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(data);
//     })
// })

// 以下，变成promise方式
// 如果需要改造成promise， 就先将回调的方法，改造成promise
function readFile(...args) {
    return new Promise((resolve, reject) => {
        fs.readFile(...args, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    })
}
// 链式调用 如果返回一个普通值 会走下一个then的成功
// 抛出错误 走then失败的方法
// 如果返回的是promise  就采用promise执行的状态
// 是返回了一个新的promise 来实现链式调用
readFile('./name.txt', 'utf8').then(data => {
    // 如果then里返回一个promise，那么采用他的状态返回值，成为下一个then的输出参数
    return readFile(data, 'utf8');
    // readFile返回的promise报错了，会找当前then里的失败，如果自己有，就不会走外层的失败的方法了，如果自己没有失败，找外层then的失败
}).then(data => {
    console.log(data)
}, err => {
    console.log(err);
})




// 能then的就是promise
// promise链式调用
// readFile('./name.txt', 'utf8').then(data => {
//     // 如果这里data返回的是普通值，那么会把这里的return 的结果返回到外层的then的成功的回调中
//     // 只要then的回调中返回的是普通值，不管是resolve,还是reject,只要是普通值，就走下一个then的成功回调
//     // 普通值表示不是promise 也不是错误
//     console.log(data);
//     return data;
// }, err => {
//     console.log(err);
// }).then(data => { // 想让下一个then走失败 方法1：返回一个失败的promise  2：抛出一个异常
//     console.log('out:', data);
//     // 方法1： 返回一个失败的promise
//     // 如果返回的是一个promise， 那个这个promise会执行， 并且采用他的状态
//     return new Promise((resolve, reject) =>{
//         reject('err');
//     })
//     // 2： 抛出一个异常
//     // throw new Error('成功then里抛出错误')
// }, err => {
//     console.log('out:', err);
// }).then(data => {

// }, err => {
//     console.log('最外成err', err);
// }).then(data => {
//     console.log('宇宙最外层success：', data)
// }, err => {
//         console.log('宇宙最外层err：', err)
// })