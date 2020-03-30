function loader(source, sourceMap) {
  console.log('normal-loader222');
  return source + '///normal-loader222///';
}
loader.pitch = function () {
  console.log('pitch2');
  // return 'loader2 --- pitch2'
  // 这里返回的值，会作为下一个normal方法的source参数传入
}

module.exports = loader;