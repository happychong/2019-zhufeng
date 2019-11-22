import http from 'http';
import fs from 'fs';
import path from 'path';
import util from 'util';
import url from 'url';
import zlib from 'zlib';
import crypto from 'crypto';

const { readFile, writeFile, readdir, stat } = fs.promises;

// 第三方
import mime from 'mime';
import chalk from 'chalk';
import ejs from 'ejs';

let template = fs.readFileSync(path.resolve(__dirname, '../template.html'), 'utf8');

class Server {
    constructor(configs) {
        this.port = configs.port;
        this.template = template;
    }
    async handleRequest(req, res) {
        let { pathname } = url.parse(req.url, true);
        // 解析中文路径
        pathname = decodeURIComponent(pathname);
        // process.cwd() - 当前执行命令路径
        let filePath = path.join(process.cwd(), pathname);
        try {
            let statObj = await stat(filePath);
            if (statObj.isDirectory()) {
                let dirs = await readdir(filePath);
                let templateStr = ejs.render(this.template, {
                    dirs,
                    pathname: pathname === '/' ? '' : pathname
                });
                res.setHeader('Content-Type', 'text/html;charset=utf-8');
                res.end(templateStr);
            } else {
                this.sendFile(filePath, req, res, statObj);
            }
        } catch (err) {
            this.sendError(err, req, res);
        }
    }
    doGzip(filePath, req, res, statObj) {
        let encoding = req.headers['accept-encoding'];
        if (encoding) {
            if (encoding.match(/gzip/)) {
                res.setHeader('Content-Encoding', 'gzip');
                return zlib.createGzip();
            } else if (encoding.match(/deflate/)) {
                res.setHeader('Content-Encoding', 'deflate');
                return zlib.createDeflate();
            } else {
                return false
            }
        } else {
            return false;
        }
    }
    cache(filePath, req, res, statObj) {
        // 对比缓存 协商缓存  缺点如下注释
        // 1：文件可能没发生实际改变，但是修改时间变化了
        // 2：精确的时间不准确 比如同一秒改变了很多次 导致还是走缓存
        // 3：cdn分发时间不一致导致的问题
        // 解决以上问题的方法---指纹,双重校验
        let lasModified = statObj.ctime.toGMTString();
        // ctime - 修改时间，时间类型
        res.setHeader('Last-Modified', statObj.ctime.toGMTString());
        let ifModifiedSince = req.headers['if-modified-since'];
        if (ifModifiedSince) {
            // 比对
            if (lasModified === ifModifiedSince) {
                // 不同，内容改了
                return true;
            }
        }

        // 指纹
        let Etag = crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('base64'); // 真正的Etag 可能只是文件某一部分 耗新能
        res.setHeader('Etag', Etag);
        let ifNoneMatch = req.headers['if-none-match'];
        if (ifNoneMatch) {
            if (ifNoneMatch === Etag) {
                // 文件没改变，走缓存
                return true;
            }
        }

        return false;
    }
    sendFile(filePath, req, res, statObj) {
        // 强制缓存
        res.setHeader('Cache-Control', 'max-age=5'); // 10s 内不再访问服务器  如果设置强制缓存 首页是不会缓存的，访问的页面如果有强制缓存 则不会再发起请求
        // res.setHeader('Cache-Control', 'no-cache'); // 每次都访问服务器，但是走缓存
        // res.setHeader('Cache-Control', 'no-store'); // 完全不缓存 禁用缓存 而且缓存文件夹没有
        // 老版本设置Expires-过期时间，Cache-Control 和 Expires 都设置，新版本以 Cache-Control 为主
        res.setHeader('Expires', new Date(Date.now() + 10*1000).toGMTString());

        // 对比缓存
        let cache = this.cache(filePath, req, res, statObj);
        if (cache) {
            res.statusCode = 304;
            return res.end();
        }
        
        // 如果浏览器支持压缩，需要压缩后再返回
        let flag = this.doGzip(filePath, req, res, statObj);
        res.setHeader('Content-Type', (mime.getType(filePath) || 'text/plain') + ';charset=utf-8');
        if (!flag) {
            fs.createReadStream(filePath).pipe(res);
        } else {
            fs.createReadStream(filePath).pipe(flag).pipe(res);
        }
    }
    sendError(err, req, res) {
        console.log(err);
        res.statusCode = 404;
        res.end('Not found!')
    }
    start () {
        let server = http.createServer(this.handleRequest.bind(this));

        server.listen(this.port, () => {
            console.log(`${chalk.yellow('Starting up server, serving')} ${chalk.blue('./')}
Available on:
http://127.0.0.1:${chalk.green(this.port)}
Hit CTRL-C to stop the server`);
        })
    }
}
export default Server;