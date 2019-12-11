// 主要功能：代理

let context = {};

function defineGetter(property, key) {
    context.__defineGetter__(key, function () {
        // this --> 谁调用，就是谁，，，这里是ctx
        // let ctx = Object.create(context);
        return this[property][key];
    });
}
defineGetter('request', 'url');
defineGetter('request', 'method');
defineGetter('request', 'path');
defineGetter('response', 'body');
// Object.defineProperty
// Proxy
// context.__defineGetter__('url', function () {
//     // this --> 谁调用，就是谁，，，这里是ctx
//     // let ctx = Object.create(context);
//     return this.request.url
// });


function defineSetter(property, key) {
    context.__defineSetter__(key, function (newValue) {
        this[property][key] = newValue;
    });
}
defineSetter('response', 'body');
module.exports = context;