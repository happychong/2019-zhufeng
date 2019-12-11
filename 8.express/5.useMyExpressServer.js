const express = require('./myExpress');

let app = express();

// 需求 希望在请求到来时 name不是zf，就初中只掉，age不是10，也终止

app.param('name', function (req, res, next, value, key) {
    // 类似中间件
    if (value.includes('zf')) {
        next();
    }
});
app.param('name', function (req, res, next, value, key) {
    // 类似中间件    
    if (value.endsWith('s')) {
        next();
    }
});
app.param('age', function (req, res, next, value, key) {
    // 类似中间件
    if (value > 10) {
        req.params.age = req.params.age - 0 + 10;
    } else {
        req.params.age -= 10;
    }
    next();
});

app.get('/user/:name/:age', function (req, res, nect) {
    console.log(req.params);
    res.end('req.params' + JSON.stringify(req.params));
});

app.listen(3000);