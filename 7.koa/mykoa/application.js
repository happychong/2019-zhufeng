const http = require('http');
const EmitEvents = require('events');
const Stream = require('stream');
// ctx 功能
// 1) 整合req, res
// 2) 封装request， response

let context = require('./context');
let response = require('./response');
let request = require('./request');

class Application extends EmitEvents {
    constructor() {
        super();
        this.context = context;
        this.response = response;
        this.request = request;
        this.middlewares = [];
    }
    use(fn) {
        // this.fn = fn;
        this.middlewares.push(fn);
    }
    createContxt(req, res) {
        let context = Object.create(this.context);
        context.request = Object.create(this.request);
        context.response = Object.create(this.response);
        // 在自己封装的对象上 增加 req 和 res
        context.req = context.request.req = req;
        context.res = context.response.res = res;
        return context;
    }
    compose(ctx) {
        // [fn, fn, fn]
        // this.middlewares
        let i = -1;
        let dispatch = (index) => {
            if (i > index) {
                // next 调用多次
                throw new Error('next 被调用了多次');
            }
            i = index;
            if (index === this.middlewares.length) {
                // 如果 this.middlewares.length 是0，返回成功的promise，支持之后的.then
                return Promise.resolve();
            }
            let middle = this.middlewares[index];
            // 如果是普通的方法，变成promise
            return Promise.resolve(middle(ctx, () => dispatch(index+1)));
        }
        return dispatch(0)
    }
    handleRequest(req, res) {
        let ctx = this.createContxt(req, res);
        // this.fn(ctx);
        this.compose(ctx).then(() => {
            let _body = ctx.body;
            console.log(typeof _body);
            
            if (_body instanceof Stream) {
                return _body.pipe(res);
            }
            if (typeof _body === 'object') {
                return res.end(JSON.stringify(_body));
            }
            if (_body === '' || typeof _body === undefined) {
                res.statusCode = 404;
                return res.end();
            }
            res.end(_body);
        }).catch((err) => {
            this.emit('error', err);
        });
    }
    listen(...args) {
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args)
    }
}

module.exports = Application;