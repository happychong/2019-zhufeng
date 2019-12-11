const fs = require('fs');
const { stat } = require('fs').promises;
const path = require('path');
const uuid = require('uuid');
const mime = require('mime');
const Koa = require('koa');

Buffer.prototype.split = function (sep) {
    // 分隔符的长度
    sep = Buffer.from(sep);
    let len = sep.length;
    let offset = 0;
    let result = [];
    let current;
    while ((current = this.indexOf(sep, offset)) > -1) {
        result.push(this.slice(offset, current));
        offset = current + len;
    }
    result.push(this.slice(offset));
    return result
}

// const bodyparser = require('koa-bodyparser');
// bodyparser 是一个函数  统一处理请求体

// 中间件特点
// 1：可以扩展 公共属性和方法
// 2：可以决定是否向下执行
// 3：可以实现权限校验
// 4：中间件 一般放在真实的逻辑代码的上面
// function bodyparser() {
//     return async (ctx, next) => {
//         await new Promise((resolve, reject) => {
//             let arr = [];
//             ctx.req.on('data', function (chunk) {
//                 arr.push(chunk);
//             });

//             ctx.req.on('end', function () {
//                 let result = Buffer.concat(arr).toString();
//                 console.log(result);
                
//                 ctx.request.body = result;
//                 resolve();
//             })
//         });
//         await next();
//     }
// }

function bodyparser() {
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            let arr = [];
            ctx.req.on('data', function (chunk) {
                arr.push(chunk);
            });

            ctx.req.on('end', function () {
                // 如果当前提交的数据 不是正常的 json 、表单格式 我们需要自己解析
                let headType = ctx.get('content-type');
                if (headType.includes('multipart/form-data')) {
                    let result = Buffer.concat(arr);
                    let bonduary = headType.split('=')[1];
                    bonduary = '--' + bonduary;
                    
                    let lines = result.split(bonduary).slice(1, -1);
                    let obj = {};
                    lines.forEach((line) => {
                        let [head, content] = line.split('\r\n\r\n');
                        head = head.toString();
                        let key = head.match(/name="(.+?)"/)[1];
                        
                        if (head.includes('filename')) {
                            // 文件
                            let filename = uuid.v4();
                            fs.writeFileSync(path.resolve(__dirname, 'upload', filename), content.slice(0, -2), 'utf8');
                            obj[key] = filename;
                        } else {
                            obj[key] = content.slice(0, -2).toString();
                        }
                    })
                    
                    ctx.request.body = obj;
                    resolve();
                } else {
                    resolve();
                }
            })
        });
        await next();
    }
}

const app = new Koa();

app.use(bodyparser());

// koa-static 包 原理
function static(dirname) {
    return async (ctx, next) => {
        try {
            let filePath = path.join(dirname, ctx.path);
            console.log(103, filePath);
            
            let statObj = await stat(filePath);
            if (statObj.isDirectory()) {
                filePath = path.join(filePath, 'index.html');
                await access(filePath);
            }
            ctx.set('Content-Type', mime.getType() + ';charset=utf-8');
            ctx.body = fs.createReadStream(filePath);
        } catch (e) {
            await next();
        }
    }
}
// 静态文件中间件，根据用户访问的路径 去对应的目录下查找，查找到返回，找不到交给下一个中间件
// 根目录
app.use(static(__dirname));
// 根目录下的upload
app.use(static(path.resolve(__dirname, 'upload')));

app.use(async (ctx, next) => {
    if (ctx.path === '/form' && ctx.method === 'GET') {
        // 实现文件下载 指定文件名
        // ctx.set('Content-Disposition', 'attachment;filename=FileName.txt');
        ctx.set('Content-Type', 'text/html;charet=utf-8');
        ctx.body = fs.createReadStream(path.join(__dirname, '/form.html'));
    } else {
        await next();
    }
});

app.use(async (ctx, next) => {    
    if (ctx.path === '/login' && ctx.method === 'POST') {
        console.log(ctx.request.body);
        
        ctx.body = ctx.request.body;

        // return new Promise((resolve, reject) => {
        //     let arr = [];
        //     ctx.req.on('data', function (chunk) {
        //         arr.push(chunk);
        //     });

        //     ctx.req.on('end', function () {
        //         let result = Buffer.concat(arr).toString();
        //         console.log(result);
        //         ctx.body = result;
        //         resolve();
        //     })
        // })
    }
});

// app.on('error', function(e) {

// });

app.listen(3000);