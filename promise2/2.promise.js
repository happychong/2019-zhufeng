const Promise = require('../promise');

// const p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         reject('error')
//     }, 1000)
// })


// p.then().then(null, err => {
//     console.log(err);
// })


// const p = new Promise((resolve, reject) => {
//     resolve(new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // resolve('hello')
//             reject(new Promise((resolve, reject) => {
//                 // 如果reject的参数是一个promise,这种情况是没意义的
//                 // 因为reject
//             }))
//         }, 500)
//     }))
// }).then(data => {
//     console.log(data)
// }).catch(err => {
//     console.log('err')
// })


Promise.resolve(222).finallly(() => {
    console.log('finallly')
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('sss')
        }, 2000)
    })
}).then(data => {
    console.log(data)
})

