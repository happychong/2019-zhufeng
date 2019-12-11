const { pathToRegexp, parse, match, } = require('path-to-regexp');
function Layer (path, handler) {
    this.path = path;
    this.handler = handler;
    
    // 新增 regExp 和 keys
    this.regExp = pathToRegexp(this.path, this.keys = []);
}
Layer.prototype.match = function (pathname) {
    
    if (!this.route) {
        // 匹配中间件
        if (this.path === '/') {
            return true;
        }
        // /user/add /user/  以XXX开头的
        return (pathname + '/').startsWith(this.path + '/');
    } else {
        let resMatches = pathname.match(this.regExp);
        if (resMatches) {
            let [, ...matches] = resMatches;
            this.params = this.keys.reduce((memo, current, index, arr) => {
                memo[current.name] = matches[index];
                return memo;
            }, {});
            return true;
        }
    }
    return pathname === this.path
}
module.exports = Layer;