let total = 0;
for (let i = 0; i < 100000; i++) {
  total += i;
}
process.send(total);
process.on('message', function(data) {
  console.log('child log：', data, process.pid);
  // 接收到消息后，子进程退出
  process.exit();
});