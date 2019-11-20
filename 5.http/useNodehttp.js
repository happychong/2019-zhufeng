// 用node实现一个http服务

const http = require('http');
const url = require('url');
const queryString = require('querystring');

// 创建服务 需要有特定的ip 和 端口号
let server = http.createServer();

server.on('request', (req, res) => {
    // req 客户端  res 服务端

    // 一个完整的url
    // http://username:password@www.baidu.com:80/sss?offset=1&limit=30#app

    // 1) 请求行
    // req.method  方法名大写
    // req.httpVersion  http协议版本号
    let { pathname, query } = url.parse(req.url, true);
    // pathname 请求路径 / 表示首页 url不包含# hash
    
    // 2) 请求头
    // req.headers // 都是小写

    // 3) 请求体
    let arr = [];
    req.on('data', function(chunk) {
        // data 不一定触发，因为没有请求体内容
        arr.push(chunk);
    });
    req.on('end', function () {
        let content = Buffer.concat(arr).toString();
        let type = req.headers['content-type'];
        let obj = null;
        if (type === 'application/json') {
            obj = JSON.parse(content);
        } else if (type === 'application/x-www-form-urlencoded') {
            obj = queryString.parse(content);
            // queryString.parse 的第二个参数是：字段间的分隔符 第三个参数是：key value之间的分隔符
            // queryString.parse(content, '&', '=');
        } else {
            return res.end(content)
        }
        res.end(obj.b + '');
    });

    // 响应
    res.statusCode = 404;
    // res.setHeader('Content-Length', '1');
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    // res.write();
})


let port = 3000;
// 开启一个端口号
server.listen(port, () => {
    console.log('server start 3000')
});

server.on('error', (err) => {
    if (err.errno === 'EADDRINUSE') {
        // 端口被占用了，port+1，重新监听
        server.listen(++port);
    }
})

// 服务端代码发生变化，都要重启服务
// modemon mode的监视器 监视文件变化 pm2也可以