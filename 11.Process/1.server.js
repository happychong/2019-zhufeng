const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
http.createServer((req, res) => {
  if (req.url === '/sum') {
    // 如果有个/sum请求，代码在这里计算，之后又有个其他接口请求，代码会/sum计算完成后，再处理其他接口，单线程阻塞了
    // let total = 0;
    // for (let i = 0; i < 10000000000; i++) {
    //   total += i;
    // }
    // res.end(total);

    // 开启子进程单独处理计算问题，不阻塞其他接口请求的处理
    let cp = spawn('node', ['sum.js'], {
      cwd: path.resolve(__dirname, 'test'),
      stdio: [0, 1, 2, 'ipc'] // ipc: 通过 message 和 send 方法进行通信，类似webworder   这里的设置不能只包括ipc
    });
    cp.on('message', function(data) {
      res.end('tatal:' + data);
    });
  } else {
    res.end('end ok');
  }
}).listen(3000);