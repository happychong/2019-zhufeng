class Router {
    constructor() {
        this.middlewares = [];
    }
    get(pathname, middleware) {
        this.middlewares.push({
            path: pathname,
            middleware,
            method: 'GET'
        })
    }
    post() {

    }
    async compose(arr, next, ctx) {
        async function dispatch(index) {
            if (index === arr.length) {
                return await next();
            }
            // 取出第一个路由执行
            let middle = arr[index];
            await Promise.resolve(middle.middleware(ctx, () => dispatch(++index)));
        }
        // return dispatch(0)
        return await dispatch(0)
    }
    routes() {
        return async (ctx, next) => {
            let method = ctx.method;
            let path = ctx.path;
            // 过滤出匹配的路由
            let arr = this.middlewares.filter((middleware) => middleware.method === method && middleware.path === path);
            // 如果组合后 一直调用next 最终会走到原生的next
            this.compose(arr, next, ctx);
        }
    }
}

module.exports = Router;