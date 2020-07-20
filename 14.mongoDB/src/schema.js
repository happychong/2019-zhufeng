let mongoose = require('mongoose');
let connection = require('./connection');

// Schema定义 (对应集合中的文档)
let UserSchema = new mongoose.Schema({
  name: String,
  age: Number
}, { collection: 'UUser'}); // 固定集合名为 user，不会自动转小写后转复数
// Schema 与数据无关，不能直接操作数据库
// console.log(UserSchema);


// Model 模型 默认集合的名字由Model名字决定，转小写后转复数
let UserModel = connection.model('User', UserSchema);
// User 是模型的名字，之后可以用这个名字引用模型
// let UserModel2 = connection.model('User');
// // connection.model 方法 2个参数-->定义模型   1个参数-->获取模型
// console.log(UserModel === UserModel2);

// 创建数据
// UserModel.create({name: 'zf', age: 11}, (err, doc) => {
//   // doc 保存成功后的文档对象
//   console.log('err::', err);
//   console.log('doc::', doc);
// });
UserModel.create({name: 'zf', age: 10}).then((doc) => {
  // doc 保存成功后的文档对象
  console.log('doc::', doc);
}, err => {
  console.log('err::', err);
});


// 实体：一个文档对象就是一个实体
let user1 = new UserModel({
  name: 'zhf',
  age: 1
});
user1.save().then(doc => {
  console.log(doc);
})