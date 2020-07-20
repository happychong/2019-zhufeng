
// 引入 mongoose 模块
let mongoose = require('mongoose');

// 创建数据库连接
let conn = mongoose.createConnection(
  'mongodb://127.0.0.1:27017/school',
  {
    useNewUrlParser: true, // 使用新的url解析器
    useUnifiedTopology: true // 应用新的引擎
  }
);
conn.on('open', () => {
  console.log('成功连接到了数据库……………………恭喜你。');
});
conn.on('error', (err) => {
  console.log('连接数据库失败：', err);
});

module.exports = conn;