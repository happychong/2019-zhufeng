const express = require('./myExpress');

let app = express();

// 路径参数
app.get('/user/:name/:age', function (req, res, nect) {
    console.log(req.params);
    res.end('req.params' + JSON.stringify(req.params));
});


// // 以下注释 参数解析过程 可以用path-to-regexp包来处理 实际业务在Layer中处理
// let requestUrl = '/user/:name/:age';
// let params = [];
// let regStr = requestUrl.replace(/:([^\/]+)/g, function () {
//     params.push(arguments[1]);
//     return '([^\/]+)'
// });
// console.log(params);
// let url = '/user/1/2';
// let [, ...args] = url.match(new RegExp(regStr));
// console.log(args);

// const { pathToRegexp, parse, match,  } = require('path-to-regexp');
// let keys = [];
// let requestUrl = '/user/:name/:age';
// let reg = pathToRegexp(requestUrl, keys);
// console.log(reg);
// let url = '/user/1/2';
// console.log(url.match(reg).slice(1));



app.listen(3000);