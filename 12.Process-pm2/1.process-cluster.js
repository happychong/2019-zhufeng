// process -> cluster -> pm2

const http = require('http');
const { fork } = require('child_process');
// os 系统包   cpus().length 拿到cup数量
const cpus = require('os').cpus().length - 1;

// 希望 开启多个进程 监听同一个服务
// fork 不是开的越多越好，数量和cpu数相同
// 一个服务 可以启动在不用的cpu上，但是必须监听同一个端口

let server = http.createServer((req, res) => {
  let num = 0;
  for (let i = 0; i < 100000000; i++) {
    num = num + i;
  }
  res.end('parent:' + process.pid);
}).listen(3000);

console.log(`主线程pid：`, process.pid);
for (let i = 0; i < cpus; i++) {
  let child = fork('server.js', {
    cwd: __dirname
  });
  // server 名字固定，就是传入一个http服务
  child.send('server', server);  
}
// 当前一共启动了4（cpu数）个服务，访问 http://localhost:3000/ 会由不同的服务来处理请求（集群-每个人做的都是同一件事）


// 上线的时候，需要开启多个进程，node提供了一个cluster模块，实现上面的功能(2.cluster-server.js)