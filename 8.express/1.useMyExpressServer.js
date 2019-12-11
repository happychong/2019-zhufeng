const express = require('./myExpress');

let app = express();

// express 内置了路由系统
app.get('/', function (req, res, next) {
    console.log(1);
    next();
    console.log('okokok');
}, function (req, res, next) {
    console.log(11);
    next();
}, function (req, res, next) {
    console.log(111);
    next();
});
app.get('/', function (req, res, next) {
    console.log(2);
    res.end('end');
});

app.post('/', function (req, res, next) {
    console.log(3);
    res.end('end');
});

app.listen(3000);