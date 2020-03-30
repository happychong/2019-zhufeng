function loader(source, sourceMap) {
  console.log('normal-loader1111');
  return source + '///normal-loader1111///';
}
loader.pitch = function () {
  console.log('pitch1');
  // return '1'
}

module.exports = loader;