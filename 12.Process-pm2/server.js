const http = require('http');

process.on('message', function (data, server) {
  // 所有人共用了 同一个端口号 server就是主进程中创建的server
  http.createServer((req, res) => {
    let num = 0;
    for (let i = 0; i < 1000000000; i++) {
      num = num + i;
    }
    res.end('process:' + process.pid);
  }).listen(server);
  console.log(`server start`, process.pid);
});

