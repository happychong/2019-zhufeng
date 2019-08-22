const Promise = require('./promise');

// const p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('error')
//     }, 1000)
// })


// p.then().then(null, err => {
//     console.log(err);
// })


const p = new Promise((resolve, reject) => {
    resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('hello')
        }, 500)
    }))
}).then(data => {
    console.log(data)
})
