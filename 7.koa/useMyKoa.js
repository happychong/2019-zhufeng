const fs = require('fs');

const Koa = require('./mykoa/application');

const app = new Koa();

app.use(async (ctx, next) => {
    // console.log(ctx.req.url);
    // console.log(ctx.request.req.url);
    // console.log(ctx.request.url);
    // console.log(ctx.url);

    // console.log(ctx.req.method);
    // console.log(ctx.request.req.method);
    // console.log(ctx.request.method);
    // console.log(ctx.method);

    // console.log(ctx.request.path);
    // console.log(ctx.path);

    // ctx.response.body = 'hello';
    // ctx.body = 'hello';
    // console.log(ctx.response.body);
    
    console.log(1);
    // 为了防止没有等待，next前面都加上await
    await next();
    // next();
    console.log(4);
});
// 中间件 use 方法  决定是否向下执行
// 可以使用async + await
const logger = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('logger');
            resolve();
        }, 1000);
    })
}
app.use(async (ctx, next) => {
    console.log(2);
    // throw new Error('我抛出错误')
    await logger();
    await next();
    console.log(5);
});

app.use(async (ctx, next) => {
    console.log(3);
    await next();
    console.log(6);
    // ctx.body = {name: '1'};
    // ctx.body = fs.createReadStream('useKoa.js');
});

app.on('error', function (err) {
    console.log(err);
    
});

app.listen(4000);