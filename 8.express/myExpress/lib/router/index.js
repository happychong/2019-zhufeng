const url = require('url');
const Layer = require('./layer');
const Route = require('./Route');
function Router() {
    let router = function (req, res, next) {
        router.handle_request(req, res, next); 
    };
    router.__proto__ = proto;
    router.stack = [];
    router.paramsCallbacks = {};
    return router;
}
let proto = {};
proto.route = function (path) {
    let route = new Route(); 
    let layer = new Layer(path, route.dispatch.bind(route));
    layer.route = route;
    this.stack.push(layer)
    return route;
};
['post', 'put', 'delete', 'get'].forEach((method) => {
    proto[method] = function (path, ...handlers) {
        // let layer = new Layer(path, handler);
        // this.stack.push(layer)
        let route = this.route(path);
        route[method](handlers);
    }
});
// Router.prototype.get = function (path, ...handlers) {
//     // let layer = new Layer(path, handler);
//     // this.stack.push(layer)
//     let route = this.route(path);
//     route.get(handlers);
// }
proto.use = function (path, handler) {
    let layer = new Layer(path, handler);
    this.stack.push(layer);
}
proto.param = function (key, handler) {
    // { name: [fn, fn], age: [fn] }   这里做key和handler的对应，跟发布订阅一样的
    if (this.paramsCallbacks[key]) {
        this.paramsCallbacks[key].push(handler);
    } else {
        this.paramsCallbacks[key] = [handler];
    }
}
proto.process_param = function (req, res, layer, done) {
    let params = this.paramsCallbacks;
    let keys = layer.keys.map(item => item.name);
    if ((!keys) || keys.length === 0) {
        return done();
    }
    let idx = 0;
    let callbacks;
    let key;
    let value;
    let next = () => {
        if (idx === keys.length) return done();
        key = keys[idx++];
        value = layer.params[key]
        if (key) {
            callbacks = params[key];
            
            processCallback(next);
        } else {
            next();
        }
    };
    next();
    function processCallback(out) {
        let idx = 0;
        let next = () => {
            let callback = callbacks[idx++];

            if (callback) {
                callback(req, res, next, value, key);
            } else {
                out();
            }
        };
        next();
    }
}
proto.handle_request = function (req, res, out) {
    let idx = 0;
    let removed = '';
    let that = this;
    let next = (err) => {
        if (removed.length > 0) {
            // 把二级路由删除的url再加回来
            req.url = removed + req.url;
            removed = '';
        }
        if (idx === this.stack.length) {
            return out();
        }
        let layer = this.stack[idx++];
        let { pathname } = url.parse(req.url);

        if (err) {
            // 找错误中间件
            if (!layer.route) {
                // 中间件
                if (layer.handler.length === 4) {
                    layer.handler(err, req, res, next);
                } else {
                    next(err);
                }
            } else {
                // 路由 继续传递错误
                next(err);
            }
        } else {
            if (layer.match(pathname)) {
                if (layer.route) {
                    // 路由
                    if (layer.route.methods[req.method.toLowerCase()]) {
                        // 方法有，执行
                        req.params = layer.params || {};
                        that.process_param(req, res, layer, () => {
                            // 处理完 执行后续
                            layer.handler(req, res, next);
                        });
                    } else {
                        next();
                    }
                } else {
                    // 中间件
                    if (layer.handler.length !== 4) {
                        // 不是错误处理的中间件
                        // 可能出现二级路由，需要把中间件的path从url中删掉
                        if (layer.path !== '/') {
                            // 是 / 的话全匹配，不删除
                            removed = layer.path;
                            req.url = req.url.slice(removed.length);
                        }
                        layer.handler(req, res, next);
                    }
                }
            } else {
                next();
            }
        }  
    }
    next();
}
module.exports = Router;