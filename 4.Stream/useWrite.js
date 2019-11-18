// const fs = require('fs');
const WriteStream = require('./WriteSteam');
const path = require('path');
const fs = require('fs');

// let ws = fs.createWriteStream(path.resolve(__dirname, '1.txt'), {
//     highWaterMark: 3, // 预期占用几个内存 默认 16*1024
//     encoding: 'utf8', // 写入的编码
//     start: 0, // 从文件的第0个位置开始写入
//     mode: 438, // 
//     flags: 'w' // 默认操作是可写
// });

let ws = new WriteStream(path.resolve(__dirname, '1.txt'), {
    highWaterMark: 10, // 预期占用几个内存 默认 16*1024
    encoding: 'utf8', // 写入的编码
    start: 0, // 从文件的第0个位置开始写入
    mode: 438, // 
    flags: 'w' // 默认操作是可写
});

let index = 0;
function write() {
    let flag = true;
    while(index < 10 && flag) {
        flag = ws.write(index + '');
        // console.log(flag);
        index++;
    }
    if (index > 9) {
        ws.end('hello');
        // ws.end(' ss');
    }
}

write();
ws.on('drain', function () {
    console.log('drain');
    write();
}) 
ws.on('close', function() {
    console.log('close');
})