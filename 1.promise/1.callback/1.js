// 高阶函数
// 一个函数的参数 是一个函数 （回调）
// 一个函数 返回一个函数 （拆分函数）

// 函数的before
// 希望将核心的逻辑提取出来，在外面再增加功能

// 重写原型上的方法

Function.prototype.before = function(beforeFn) {
    return (...args) => { // 箭头函数中没有this指向，所以会像上级作用域查找
        beforeFn();
        this(...args); // 展开运算符 把所有的参数组成数组
    }
}
// AOP 切片 装饰 把核心抽离出来，在核心基础上增加功能
const say = (...args) => { // 剩余运算符 把所有
    console.log('说话', args)
}

const newSay = say.before(() => {
    console.log('你好，');
})

newSay(1,2,4);



// react 事物的改变 可以在前面和后面 同时增加方法 文件2中