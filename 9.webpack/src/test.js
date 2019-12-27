function test() {
    return 'hello test'
}

// 模块内部执行，index.js里面又引用了这个test模块
// 这个test()，webpack认为代码应该保留
// 但是实际上我们认为test模块被引入，但是引入test的模块并没有应用test模块，test这样的副作用的代码，是无意义的，打包时需要被删除掉
// 我们想打包的时候删除这样的副作用代码，需要手动在package.json中设置 sideEffects: false 
console.log(test());

export default test;
