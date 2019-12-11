const fs = require('fs');

const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const static = require('koa-static');
// const Router = require('koa-router');
const Router = require('./MyRouter');

const app = new Koa();

app.use(static(__dirname));
app.use(bodyparser());

let router = new Router();
// 路由匹配 会匹配方法和路径
router.get('/', async (ctx, next) => {
    console.log(1);
    next();
});
router.get('/', async (ctx, next) => {
    console.log(2);
});

router.get('/user', async (ctx, next) => {
    console.log(3);
    next();
});
router.get('/user', async (ctx, next) => {
    console.log(4);
    next();
});

// router.post('/login', async (ctx, next) => {
//     ctx.body = ctx.request.body;
// });

// 将路由挂载在应用上
app.use(router.routes());

app.use(async(ctx, next) => {
    console.log(5);
})

app.listen(3000);


// koa 路由匹配解析
// 默认路由是严格匹配
// 1：路径相同
// 2：携程正则的方式 /\/a\/\d+/
// 3：/a/:name  路径参数