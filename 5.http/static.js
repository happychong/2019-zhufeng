// 静态资源

// 浏览器 访问index.html -> style.css

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

let server = http.createServer((req, res) => {
    // fs操作
    let { pathname } = url.parse(req.url); // ./index.html
    let filePath = path.join(__dirname, pathname);

    fs.stat(filePath, (err, statObj) => {
        if (err) {
            res.statusCode = 404;
            console.log('文件不存在---', filePath);
            res.end('文件不存在')
        } else {
            if (statObj.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
                fs.access(filePath, (err) => {
                    if (err) {
                        res.end('文件夹下不存在index.html')
                    } else {
                        res.setHeader('Content-Type', 'text/html;charset=utf-8');
                        fs.createReadStream(filePath).pipe(res);
                    }
                })
            } else {
                let type = require('mime').getType(filePath);
                res.setHeader('Content-Type', type + ';charset=utf-8');
                fs.createReadStream(filePath).pipe(res);
            }
        }
    })
});

server.listen(3000, () => {
    console.log('server start 3000')
});