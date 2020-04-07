// let webpack = require('webpack'); // 引用原生webpack
let webpack = require('./myWebpack'); // 引用自己写的webpack
let webpackOptions = require('../webpack.config');
const compiler = webpack(webpackOptions);

compiler.run((err, stat) => {
  // webpack回调函数中会得到stat对象，可以Compliation.getStats()得到，主要包含modules，chunks，assets三个属性
  // console.log(stat.toJson({
  //   entries: true,
  //   chunks: true, // 记录了所有chunk
  //   modules: true, // 所有解析后的模块
  //   assets: true // 记录了所有要生成的文件
  // }));
  console.log('+++++++++++++++++++++++++++++', stat);
});