// cluster（族） node内置模块
const cluster = require('cluster');
// cluster提供了fork方法
const cpus = require('os').cpus().length;
const http = require('http');

// 在集群的模式下 可以监听同一个端口号
if (cluster.isMaster) {
  console.log('主');
  cluster.on('exit', function (worker) {
    // 主进程作用，还要守护进程，某个子进程挂了，要重启，保证项目的健壮性
    console.log(worker.process.pid);
    cluster.fork();
  })
  for (let i = 0; i < cpus; i++) {
    // fork可以开启子进程，fork执行后会将此文件重新执行，此文件再次执行的时候 cluster.isMaster 为false，就走else逻辑了
    cluster.fork();
  }
} else {
  // 负载均衡
  http.createServer((req, res) => {
    // if (Math.random() > 0.5) {
    //   // 模拟服务器挂掉，然后看重启效果
    //   aa();
    // }
    res.end('process:' + process.pid);
  }).listen(3000);
  console.log('分：', process.pid);
}