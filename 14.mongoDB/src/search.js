// 查询详解

let mongoose = require('mongoose');
let connection = require('./connection');

let UserSchema = new mongoose.Schema({
  name: String,
  age: Number
}, { collection: 'user'});
let UserModel = connection.model('User', UserSchema);

(async function () {
  // 用自执行 async 函数

  // 先准备数据库数据
  // let users = [];
  // for (let i = 1; i <= 10; i++) {
  //   users.push({
  //     name: `zf${i}`,
  //     age: i
  //   })
  // }
  // await UserModel.create(users);

  // 按属性过滤
  let findRes = await UserModel.find({name: 'zf1'});
  // 查找1条
  let findOneRes = await UserModel.findOne({});
  // 通过Id查找
  let findByIdRes = await UserModel.findById('5f115ecc38c3e0609c1da4a5');
  // 大于:      gt           great than
  let gtRes = await UserModel.find({age: {$gt: 5}});
  // 小于:      lt           less than
  let ltRes = await UserModel.find({age: {$lt: 5}});
  // 大于等于:   gte          great than or equal
  let geRes = await UserModel.find({age: {$gte: 5}});
  // 小于等于:   le          less  than or equal
  let leRes = await UserModel.find({age: {$lte: 5}});
  // 不等于:     ne          not equal
  let neRes = await UserModel.find({age: {$ne: 5}});

  // 包含 in
  let inStrRes = await UserModel.find({age: {$in: 6}});
  // 返回 age === 6 的数据
  let inArrRes = await UserModel.find({age: {$in: [5, 6, 7]}});
  // 返回 age === 5 || age === 6 || age === 7 的数据

  // or 或
  let orArrRes1 = await UserModel.find({$or: [{name: 'zf1'}, {age: 7}]});
  // name === zf1 || age === 7 的数据
  let orArrRes2 = await UserModel.find({$or: [
    {age: {$lt: 3}},
    {age: {$gt: 7}}
  ]});
  // age < 3 || age > 7 的数据

  // 分页查询
  let pageSize = 3; // 每页3条
  let pageNum = 2; // 查询第2页
  let pageRes = await UserModel.find({}).sort({age: 1}).skip((pageNum - 1) * pageSize).limit(pageSize);
  // sort({age: 1}) --> 1：升序   -1：降序
  // skip(3) ---> 跳过3
  // limit() ---> 限定返回的最大数据数

  process.exit(0); // 结束连接数据库进程
})();