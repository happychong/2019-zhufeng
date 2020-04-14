let path = require('path');
let { spawn } = require('child_process');
// ex：爬虫 不定期的从别的网站上获取数据，再展示给客户端，，可以一直启动着，主子之间没有关系，主线程挂了，子进程可以接着爬
let cp = spawn('node', ['c.js'], {
  cwd: path.resolve(__dirname, 'test'),
  stdio: 'ignore', // 忽略子进程中的输出， 主子之间不传递消息了
  detached: true // detached：独立的
});
cp.unref(); // 父进程放弃子进程控制，让子进程自己跑
console.log(cp.pid); // 获取子进程的id号
