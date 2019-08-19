// 柯理化 ： 将一个函数拆分成多个函数

// 判断类型 Object.prototype.toString.call

// 高阶函数中包含 柯理化 可以保留参数 bind
const checkType = (type) => {    
    return function (context) {
        return Object.prototype.toString.call(context) === `[object ${type}]`
    }
}

const types = ['String', 'Number', 'Boolean'];
let utils = {};

types.forEach(type => {
    utils['is' + type] = checkType(type);
})

console.log(utils.isNumber(124));
console.log(utils.isString('124'));

// --------------------------------------------------------------------------
// 函数柯理化怎么实现
// 通用的柯理化
const add = (a, b, c, d, e) => {
    return a + b + c + d + e;
}

const curring = (fn, arr = []) => {
    let len = fn.length; // 函数的length是参数的个数
    return (...args) => {
        arr = arr.concat(...args);
        if (arr.length < len) {
            return curring(fn, arr)
        }
        return fn(...arr)
    }
}
let res = curring(add)(1)(2)(3,4)(5);
console.log(res)


// --------------------------------------------------------------------------
// 以下利用curring 实现checkType
const checkType = (type, content) => {  
    return Object.prototype.toString.call(content) === `[object ${type}]`
}
const curring = (fn, arr = []) => {
    let len = fn.length; // 函数的length是参数的个数
    return (...args) => {
        arr = arr.concat(...args);
        if (arr.length < len) {
            return curring(fn, arr)
        }
        return fn(...arr)
    }
}
const types = ['String', 'Number', 'Boolean'];
let utils = {};
types.forEach(type => {
    utils['is' + type] = curring(checkType)(type);
})
console.log(utils.isNumber('23'))

