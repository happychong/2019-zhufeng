const fs = require('fs');
const ReadStream = require('./ReadStream');

let rs = new ReadStream('./1.txt', {
    flags: 'r', // 当前要做什么操作
    encoding: null, // 默认 buffer
    highWaterMark: 2, // 内部会创建 64K大小的buffer 默认64 * 1024
    mode: 0o666, // 打开文件读操作权限
    autoClose: true, // 
    start: 0, // 
    end: 10 // start 到 end ，包前又包后
});
// 默认流的模式是暂停模式，监听data事件后，开始
let arr = [];
rs.on('open', function (fd) {
    console.log('文件打开触发open事件', fd);
});
rs.on('data', function (data) {
    // data - 每次读取到的结果
    arr.push(data);
    console.log(Buffer.concat(arr).toString());
    rs.pause();
});
// setInterval(() => {
//     rs.resume();
// }, 1000);
rs.on('end', function () {
    console.log('文件读取完毕');
    console.log(Buffer.concat(arr).toString());
});
rs.on('close', function () {
    console.log('文件关闭');
});
// rs.on('error', function () {
//     console.log('出错了');
// });