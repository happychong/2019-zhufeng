// 我们希望 读取数据 node 异步 会等待同步代码都执行完成后，再执行

const fs = require('fs');
const after = (times, cb) => {
    return () => {
        if (--times === 0) {
            cb();
        }
    }
}

let school = {};
let afterFn = after(2, () => {
    console.log(school)
})
// name.txt 当前目录 根目录下 查找文件
fs.readFile('name.txt', 'utf8', (err, data) => {
    // 只要是回调，参数第一个都是err
    school.name = data;
    afterFn();
});
fs.readFile('age.txt', 'utf8', (err, data) => {
    school.age = data;
    afterFn();
});