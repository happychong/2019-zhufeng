let path = require('path');
// child_process 子进程模块，核心模块
let { spawn } = require('child_process'); // spawn: 产卵
// 创建子进程，执行test下的a.js
let cp = spawn('node', ['b.js'], {
  cwd: path.resolve(__dirname, 'test'),
  stdio: [0, 1, 2, 'ipc'] // ipc: 通过 message 和 send 方法进行通信，类似webworder   这里的设置不能只包括ipc
});
cp.on('message', function(data) {
  console.log(data);
});
// 主进程给子进程发送消息
cp.send('我是主进程send的消息');

// cp.kill(); // 杀掉子进程，但是杀掉监听message就拿不到消息了，所以注释掉

// 子进程要听从父进程，父进程kill掉，子进程会自动关闭
// 爬虫