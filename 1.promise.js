const Promise = require('./promise');

// 如果一个promise then的方法中返回了一个普通值

let p = new Promise((resolve, reject) => {
    resolve('hello');
    
})

let promise2 = p.then(data => {
    return new Promise((resolve, reject) => {
        resolve(new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('200');
            })
        }))
    })
})
promise2.then(data =>{
    console.log(data);
})