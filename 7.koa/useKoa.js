const Koa = require('koa');

const app = new Koa();

// req res (node原生的)
// request response（koa封装的）
// 尽量不适用原生的方法
app.use((ctx) => {
    // ctx : 上下文，代理了req ，res ， request ， response
    console.log(ctx.path);
    console.log(ctx.headers);
    
    // ctx.res.end('hello');
    ctx.body = { name: 'use koa' };
});

app.listen(3000);