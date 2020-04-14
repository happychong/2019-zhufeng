const http = require('http');
const { fork } = require('child_process'); // fork:复制，克隆
const path = require('path');
http.createServer((req, res) => {
  if (req.url === '/sum') {
    // fork默认会加node属性
    let cp = fork('sum.js', {
      cwd: path.resolve(__dirname, 'test')
    });
    cp.on('message', function(data) {
      res.end('tatal:' + data);
    });
  } else {
    res.end('end ok');
  }
}).listen(3000);