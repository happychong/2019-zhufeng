let path = require('path');
// child_process 子进程模块，核心模块
let { spawn } = require('child_process'); // spawn: 产卵
// 创建子进程，执行test下的a.js
let cp = spawn('node', ['a.js'], {
  cwd: path.resolve(__dirname, 'test'),
  // stdio: 'ignore' // 忽略子进程中的输出
    // process.stdin:标准输入（0）   process.stdout：标准输出（1）    process.stderr：错误输出（2）     stdio: [0, 1, 2](默认)
  // stdio: [process.stdin, process.stdout, process.stderr]  // 子进程共享父进程中的输入输出  这样的方式只能打印一些日志
  stdio: 'pipe' // 子进程和父进程都是通过pipe通信    'pipe' = ['pipe', 'pipe', 'pipe']
});
cp.stdout.on('data', function (data) {
  console.log(data + '');
});
cp.on('error', function (err) {
  console.log(err);
});
cp.on('close', function() {
  console.log('close');
});
cp.on('exit', function() {
  console.log('exit');
});
