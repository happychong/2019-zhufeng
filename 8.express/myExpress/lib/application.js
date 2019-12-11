// 创建应用

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const STATUS_CODE = require('statuses').STATUS_CODES;

const Router = require('./router');

function Application() {
    // this.router = new Router;
    // [
    //     {
    //         path: '*',
    //         method: '*',
    //         handler(req, res) {
    //             res.end(`Cannot ${req.method} ${req.url}`)
    //         }
    //     }
    // ]
    this.engines = {};
    this.settings = {
        'views': 'views',
        'view engine': 'ejs'
    };
}
Application.prototype.lazy_route = function () {
    if (!this.router) {
        this.router = new Router;
        // 默认初始化一个中间件 内置的中间件 初始化res.render
        this._init();
    }
};
Application.prototype._init = function () {
    // 默认第一个中间件
    this.use((req, res, next) => {
        res.sendFile = function (filename) {
            fs.createReadStream(filename).pipe(res);
        };
        res.json = function (value) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(value));
        };
        res.send = function (value) {
            if (typeof value === 'object') {
                res.json(value);
            } else if (typeof value === 'number') {
                res.statusCode = value;
                res.end(STATUS_CODE[value]);
            } else {
                res.end(value);
            }
        };
        
        // res 扩展渲染模板引擎的方法
        res.render = (filename, obj) => {
            // this.engines
            let views = this.get('views');
            let viewEngine = this.get('view engine');
            let render = this.engines[viewEngine]; // renderfile方法
            let filepath = path.join(views, filename) + viewEngine;
            render(filepath, obj, function(err, html) {
                res.end(html);
            })
        };
        next();
    });
};
Application.prototype.set = function (key, value) {
    if (arguments.length === 1) {
        // 取值
        return this.settings[key];
    }
    this.settings[key] = value;
};
Application.prototype.engine = function (extname, render) {
    this.engines[extname] = render;
};

['post', 'put', 'delete', 'get'].forEach((method) => {
    Application.prototype[method] = function (path, ...handlers) {
        if (method === 'get' && arguments.length === 1) {
            return this.set(path);
        }
        this.lazy_route();
        this.router[method](path, ...handlers);
    }
});
Application.prototype.param = function (key, handler) {
    this.lazy_route();
    this.router.param(key, handler);
};
Application.prototype.use = function (path, handler) {
    this.lazy_route();
    if (typeof handler !== 'function') {
        handler = path;
        path = '/';
    }
    this.router.use(path, handler);
}
// Application.prototype.get = function (path, ...handlers) {
//     this.router.get(path, ...handlers);
//     // this.router.push({
//     //     path,
//     //     method: 'get',
//     //     handler
//     // })
// }
Application.prototype.listen = function () {
    let server = http.createServer((req, res) => {
        this.lazy_route();
        // let reqMethod = req.method.toLowerCase();
        // let pathname = url.parse(req.url).pathname;
        // for (let i = 1; i < this.router.length; i++) {
        //     let { method, path, handler } = this.router[i];
        //     if (reqMethod === method && pathname === path) {
        //         return handler(req, res);
        //     }
        //     this.router[0].handler(req, res);
        // }
        function done () {
            // 没匹配到路径，调用的方法
            res.end(`Cannot ${req.method} ${req.url}`);
        }
        this.router.handle_request(req, res, done);
    });
    server.listen(...arguments);
}

module.exports = Application