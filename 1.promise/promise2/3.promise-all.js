// Promise.all 多个异步并发
let fs = require('fs').promises;

const isPromise = value => {
    if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
        return typeof value.then === 'function';
    }
    return false;
}


Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let arr = [];
        let successIndex = 0;
        let processData = (index, data) => {
            arr[index] = data;
            successIndex++;
            if (successIndex === promises.length) {
                resolve(arr);
            }
        }
        for (let i = 0; i < promises.length; i++) {
            let current = promises[i];
            if (isPromise(current)) {
                current.then(data => {
                    processData(i, data);
                }, err => {
                    reject(err);
                });
            } else {
                processData(i, current);
            }
        }
    })
}


// 全部完成才算完成 如果有一个失败 就失败
// Promise.all 是按顺序执行的
Promise.all([
    fs.readFile('./name.txt', 'utf8'),
    fs.readFile('./age.txt', 'utf8'),
    1,
    2,
    3,
    fs.readFile('./age.txt', 'utf8')
]).then(data=>{
    console.log(data);
}, err => {
    console.log(err);
})



// Promise.race  有一个成功就成功