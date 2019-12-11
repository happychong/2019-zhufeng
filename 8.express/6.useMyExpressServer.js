const path =require('path');
const express = require('./myExpress');

let app = express();

app.set('views', 'view'); // 将默认目录改为 view
app.set('view engine', '.html'); // 设置默认后缀名为 html
app.engine('.html', require('ejs').__express); // 设置 html 后缀的文件，也用ejs渲染

// 模板引擎 默认支持ejs
app.get('/', function(req, res) {
    // 默认查找 views 目录下的文件
    // 默认后缀 ejs
    res.render('index', {name: 'zf'})
});

// 扩展res.json  res.send
app.get('/json', function (req, res) {
    res.send(404);
    // res.send({name: 'zf'});
    // res.json({ name: 'zf' });
});

// 扩展 res.sendFile
app.get('/sendFile', function (req, res) {
    res.sendFile(path.resolve(__dirname, '1.useMyExpressServer.js'));
})

app.listen(3000);