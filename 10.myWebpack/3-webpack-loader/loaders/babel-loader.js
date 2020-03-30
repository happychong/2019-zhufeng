const babel = require('@babel/core');

function loader(source, sourceMap) {
  // source - 输入的内容 要串换的内容
  console.log('this is my loader ! ~~~~~~~~~~~~');
  // console.log运行的时候，这里会被打印出2次，因为有2个文件啊，index.js & title.js
  const options = {
    presets: [], // babel预设 '@bebal/preset-env'
    inputSourceMap: sourceMap, // 输入的 源映射
    sourceMaps: true, // 输出 要 sourceMaps
    // this.request = loader1!loader2!loader3!indexedDB.css
    filename: this.request.split('!').pop() // 指定文件名
  }
  // code : 转译后代码  map：sourcemap   ast：抽象语法树
  let {code, map, ast} = babel.transform(source, options);
  return this.callback(null, code, map, ast)
}

module.exports = loader;