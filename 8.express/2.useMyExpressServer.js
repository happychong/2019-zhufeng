const express = require('./myExpress');

let app = express();

// 中间件 - 可以封装公共逻辑，扩展req，res，决定是否向下执行
app.use(function (req, res, next) {
    console.log('middle1');
    // next 中，只要有参数就代表是错误
    next();
})
app.use('/u', function (req, res, next) {
    console.log('middle2');
    next();
})
app.use('/user', function (req, res, next) {
    console.log('middle3');
    next();
})
app.use('/user/add', function (req, res, next) {
    res.end('add');
})
app.get('/user', function (req, res, next) {
    console.log(2);
    next();
    res.end('end');
});

// 中间件 错误处理，放在页面最下面 （中间件next中有参数，直接走这里）
app.use((err, req, res, next) => {
    console.log('err');    
    res.end('my - not found');
})



app.listen(3000);