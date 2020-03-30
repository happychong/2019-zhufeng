function loader(source, sourceMap) {
  // source - 输入的内容 要串换的内容
  console.log('normal-loader333');
  return source + '///normal-loader333///';
}
loader.pitch = function () {
  console.log('pitch3');
  // return 'loader3 --- pitch3'
  // 如果loader2的pitch方法有返回值，那这个loader3的方法都不执行了
}

module.exports = loader;