const path = require('path');

// const fs = require('fs');
// let rs = fs.createReadStream(path.resolve(__dirname, './1.txt'), {
//     highWaterMark: 4
// });
// let ws = fs.createWriteStream(path.resolve(__dirname, './2.txt'), {
//     highWaterMark: 1
// });

const createReadStream = require('./ReadStream');
const createWriteStream = require('./WriteSteam');
let rs = new createReadStream(path.resolve(__dirname, './1.txt'), {
    highWaterMark: 4
});
let ws = new createWriteStream(path.resolve(__dirname, './2.txt'), {
    highWaterMark: 1
});

rs.pipe(ws);
// rs.pipe(ws) = 如下注释代码，具体参考可读流原理的pipe部分
// rs.on('data', function(chunk) {
//     let flag = ws.write(chunk);
//     if (!flag) {
//         rs.pause();
//     }
// });
// ws.on('drain', function() {
//     console.log('干了');
//     rs.resume();
// })
