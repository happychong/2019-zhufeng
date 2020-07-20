// 基础使用

let mongoose = require('mongoose');
let connection = require('./connection');

let UserSchema = new mongoose.Schema({
  name: String,
  age: Number
}, { collection: 'user'});
let UserModel = connection.model('User', UserSchema);

(async function () {
  // 用自执行 async 函数

  // 创建数据
  let res = await UserModel.create({name: 'zf1', age: 2});

  // 查找
  let docs = await UserModel.find({name: 'zf2'});

  // 更新
  // let updateRes = await UserModel.update({name: 'zf1'}, {age: 20});
  // UserModel.update（已经被废弃的方法） 第2个参数是条件，第2个参数是更新后的值
  // 上面语句是把name为zf1的数据，age变成20
  // console.log(updateRes); // { n: 1, nModified: 0, ok: 1 }   n---匹配的条数  nModified---实际发生更新的条数
  // let updateOneRes = await UserModel.updateOne({name: 'zf1'}, {age: 20});
  // updateOne - 不管找到多少条数据，只更新第一条数据
  let updateManyRes = await UserModel.updateMany({name: 'zf1'}, {age: 3});
  // updateMany - 找到多条数据，更新所有数据

  // 删除
  let removeRes = await UserModel.remove({name: 'zf1'});
  // remove （已经被废弃的方法）会删除所有的匹配记录
  // console.log(removeRes); // { n: 5, ok: 1, deletedCount: 5 }
  let deleteOneRes = await UserModel.deleteOne({name: 'zf1'});
  // deleteOne 只删除匹配到的第一条数据
  let deleteManyRes = await UserModel.deleteMany({name: 'zf3'});
  // deleteMany 删除所有匹配到的数据
  console.log(deleteManyRes); // { n: 2, ok: 1, deletedCount: 2 }
  
  process.exit(0); // 结束连接数据库进程
})();