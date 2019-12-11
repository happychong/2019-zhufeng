// 主要功能 ： 扩展

const url = require('url');

let request = {
    get url() {
        // 属性访问器 h5方法
        // this === ctx.request
        return this.req.url;
    },
    get method() {
        return this.req.method;
    },
    get path() {
        return url.parse(this.req.url).pathname
    }
};

module.exports = request;