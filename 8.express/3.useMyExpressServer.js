const express = require('./myExpress');

// 类 创建路由系统
let router1 = express.Router();

let app = express();

// 二级路由
router1.get('/add', function (req, res, next) {
    res.end(`user add`)
});
router1.get('/delete', function (req, res, next) {
    res.end(`user delete`)
});
// 挂载中间件
app.use('/user', router1);

let router2 = express.Router();
router2.get('/xxx', function (req, res, next) {
    res.end(`user xxx`)
});
app.use('/user', router2);

app.listen(3000);