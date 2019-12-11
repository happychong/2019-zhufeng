const Layer = require('./layer');

function Route() {
    this.stack = [];
    this.methods = {};
}
Route.prototype.dispatch = function (req, res, out) {
    let idx = 0;
    let next = (err) => {
        if (err) {
            return res.end(`my - Connot ${req.method} ${req.url}`)
        }
        if (idx === this.stack.length) return out();
        let layer = this.stack[idx++];
        if (layer.method === req.method.toLowerCase()) {
            layer.handler(req, res, next);
        } else {
            next();
        }
    }
    next();
};
['post', 'put', 'delete', 'get'].forEach((method) => {
    Route.prototype[method] = function (handlers) {
        handlers.forEach(handler => {
            let layer = new Layer('', handler);
            this.methods[method] = true;
            layer.method = method;
            this.stack.push(layer);
        });
    }
});

// Route.prototype.get = function (handlers) {
//     console.log(handlers);
    
//     handlers.forEach(handler => {
//         let layer = new Layer('', handler);
//         layer.method = 'get';
//         this.stack.push(layer);
//     });
//     // let layer = new Layer('', handler);
//     // layer.method = 'get';
//     // this.stack.push(layer);
// }
module.exports = Route;