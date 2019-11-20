// 提供一个静态服务
const http = require('http');
const path = require('path');
const url = require('url');
const { createReadStream } = require('fs');
const fs= require('fs').promises;
const mime = require('mime');

class HTTPServer {
    async handleRequest(req, res) {
        let { pathname, query } = url.parse(req.url, true);
        let filePath = path.join(__dirname, pathname);
        try {
            let statObj = await fs.stat(filePath);
            this.sendFile(statObj, filePath, req, res);
        } catch (e) {
            this.endError(e, res);
        }
    }
    async sendFile(statObj, filePath, req, res) {
        if (statObj.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
            try {
                await fs.access(filePath);
            } catch (error) {
                return this.endError(error, res);
            }
        }
        res.setHeader('Content-Type', require('mime').getType(filePath) + ';charset=utf-8');
        createReadStream(filePath).pipe(res);
    }
    endError(e, res) {
        res.statusCode = 404;
        console.log(e);        
        res.end('Not Found!')
    }
    start(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
}

let server = new HTTPServer();
server.start(3000, () => {
    console.log(`server start on port 3000`);
})