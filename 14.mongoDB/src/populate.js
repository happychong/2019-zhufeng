// 主键 & 外键

let mongoose = require('mongoose');
let connection = require('./connection');

// User's Schema and Model
let UserSchema = new mongoose.Schema({
  name: String,
  age: Number
});
let UserModel = connection.model('User', UserSchema);
// Score's Schema and Model
let ScoreSchema = new mongoose.Schema({
  // uid 是一个外键 类型是ObjectId，引用的是User模型
  uid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  grade: Number
});
let ScoreModel = connection.model('Score', ScoreSchema);

(async function () {
  // 用自执行 async 函数

  // 保存数据 - 先写主表，再把主表的主键赋值给附表的外键
  // let name = await UserModel.create({name: 'Tom'});
  // let score = await ScoreModel.create({uid: name._id, grade: 88});

  // 通过附表的uid查主表的数据
  // 方法1：查2次，麻烦
  let scoreId = '5f117511c587c05dbc2971fa';
  let scoreRes = await ScoreModel.findById(scoreId);
  let userRes = await UserModel.findById(scoreRes.uid);
  // 方法2：
  let userRes2 = await ScoreModel.findById(scoreId).populate('uid');
  // populate 把外键id变成一个对象，得到以下数据
  // {
  //   _id: 5f117511c587c05dbc2971fa,
  //   uid: { _id: 5f117511c587c05dbc2971f9, name: 'Tom', __v: 0 },
  //   grade: 88,
  //   __v: 0
  // }
  process.exit(0); // 结束连接数据库进程
})();