// 生成器 生成迭代器的 es6语法
// async + await
// redux-saga

// 返回值叫迭代器
function * read() {
    yield 1; // 产出
    yield 2;
    yield 3;
}

// iterator 迭代器
let it = read();

console.log(it.next());
// { value: 1, done: false }
// value ---> yield 的产出        done: false  ---> 函数还没执行完

console.log(it.next());
// { value: 2, done: false }
console.log(it.next());
// { value: 3, done: false }
console.log(it.next());
// { value: undefined, done: true }

// ------------------------------------------------------------------------

// 将类数组转化成数组
// 类数组的定义： 1索引  2长度
function add() {
    console.log([...{
        0: 1,
        1: 2,
        2: 3,
        length: 3,
        // [Symbol.iterator]() {
        //     let len = this.length;
        //     let index = 0;
        //     // 迭代器 是有next方法 而且方法执行后 需要返回value，done的对象
        //     return {
        //         next: () => {
        //             return {
        //                 value: this[index],
        //                 done: index++ === len
        //             }
        //         }
        //     }
        // }
        // 生成器函数方式
        [Symbol.iterator]: function * () {
            let index = 0;
            while (index !== this.length) {
                yield this[index++]
            }
        }
    }])
}
add(1,2,3,4,5)

// ------------------------------------------------------------------------

// function* read() {
//     try {
//         let a = yield 1; // 产出
//         console.log(a);
//         let b = yield 2;
//         console.log(a);
//         let c = yield 3;
//         console.log(a);
//     } catch(e) {
//         console.log('err', e);
//     }
// }

// let it = read();
// console.log(it.next()) // 第一次，next的参数没有意义，第一次的参数，从read里传
// console.log(it.next(1)) // 这里传参，会传给上一个yield的返回值，也就是a
// it.throw('xxxError')

const fs = require('fs').promises;

function * read() {
    let content = yield fs.readFile('./name.txt', 'utf8');
    let age = yield fs.readFile(content, 'utf8');
    return age
}
// let it = read();
// it.next().value.then(data => {
//     it.next(data).value.then(data => {
//         console.log(data)
//     });
// }, err => {
//     console.log(err)
// });

// let co = require('co');
function co(it) {
    return new Promise((resolve, reject) => {
        // 异步迭代需要先提供一个next方法
        function next(res) {
            let { value, done } = it.next(res);
            if (!done) {
                Promise.resolve(value).then(data => {
                    // it.next(data);
                    next(data);
                })
            } else {
                resolve(value)
            }
        }
        next(it);
    })
}
co(read()).then(data => {
    console.log(data);
}, err => {
    console.log(err);
})



const fs = require('fs').promises;
async function read() {
    let content = await fs.readFile('./name.txt', 'utf8');
    let age = await fs.readFile(content, 'utf8');
    return age
}
read().then(data => {
    console.log(data)
}, err => {
    console.log('err: ', err)
})