// 关于calc.js注释的代码：目前是为了将calc打包成node可以使用的模块

// 我们在项目中引用react的时候（import React），会先到manifest.json中查找
// 找到了react，就会从react.dll.js中读取代码
// 可能react.dll.js中，引用了某个模块（就是manifest.json的配置的模块），会去react.dll.js中读取代码

let path = require('path');
const DLLPlugin = require('webpack').DllPlugin;
console.log(DLLPlugin);

module.exports = {
    mode: 'production',
    // entry: './src/calc.js', // 其中包含 add & minus
    entry: ['react', 'react-dom'], // 把第三方模块react和react-dom一起打包
    output: {
        // 打包后，接受自执行函数的名字
        library: 'react',
        // 默认用var 模式： commonjs commonjs2 umd（amd+cmd+commonjs） this , 一般node用commonjs2
        libraryTarget: 'var',
        // 打包后的名字
        filename: 'react.dll.js',
        path: path.resolve(__dirname, '../dll')
    },
    plugins: [
        // 生成manifest.json（名字可任意）配置文件
        new DLLPlugin({
            name: 'react',
            // manifest.json 中，会把我们打包的react.dll.js中用到的所有模块都列出
            path: path.resolve(__dirname, '../dll/manifest.json')
            // 打包的时候 会配置cleanwebpackgplgin,所以不放在dist里，否则每次打包都被删除了
        })
    ]
}