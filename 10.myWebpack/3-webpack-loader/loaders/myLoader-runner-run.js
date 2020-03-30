const fs = require('fs');
const path = require('path');

// 把loader变成对象
function createLoaderObject(loader) {
  let loaderObj = {data: {}};
  loaderObj.request = loader;
  loaderObj.normal = require(loader);
  loaderObj.pitch = loaderObj.normal.pitch;
  return loaderObj;
}

function runLoaders(options, callback) {
  // 设置loader函数中的this对象
  let loadercontext= {
    loaderIndex: 0, // 当前索引
    readResource: fs, // 读文件的模块
    resource: options.resource, // 要加载的资源 (index.js)
    loaders: options.loaders // [loader1, loader2, loader3] pathStr
  };
  let loaders = options.loaders;
  // loaders 路径Str -> 有paitch， normal，request属性的对象
  loadercontext.loaders = loaders.map(loader => createLoaderObject(loader)); // [{normal, pitch}, {normal, pitch}]
  iteratePitchLoader(loadercontext, callback);
  function processResource (loadercontext, callback) {
    // 读源文件
    let buffer = loadercontext.readResource.readFileSync(loadercontext.resource, 'utf8');
    iterateNormalLoader(loadercontext, buffer, callback);
  }
  function iterateNormalLoader(loadercontext, code, callback) {
    // 遍历loaders 的 normal 方法
    if (loadercontext.loaderIndex < 0) {
      return callback(null, code);
    }
    let curLoaderObj = loadercontext.loaders[loadercontext.loaderIndex];
    let normalFn = curLoaderObj.normal;
    let result = normalFn.call(loadercontext, code);
    loadercontext.loaderIndex--;
    iterateNormalLoader(loadercontext, result, callback);
  }
  function iteratePitchLoader(loadercontext, callback) {
    // 遍历pitch方法
    if (loadercontext.loaderIndex >= loadercontext.loaders.length) {
      // pitch 方法执行完了，读文件资源，翻转执行normal方法
      loadercontext.loaderIndex--;
      return processResource(loadercontext, callback);
    }
    let curLoaderObj = loadercontext.loaders[loadercontext.loaderIndex];
    let pitchFn = curLoaderObj.pitch;
    if (!pitchFn) {
      // 没有pitch函数，下一个pitch方法
      loadercontext.loaderIndex++;
      return iteratePitchLoader(loadercontext, callback);
    }
    let result = pitchFn.apply(loadercontext);
    // 有pitch方法
    if (result) {
      // pitch方法有返回值，要返回上一个loader的normal，且pitch的返回值作为normal方法的第一个参数，没有上一个loader的话，直接返回pitch的值
      loadercontext.loaderIndex--;
      iterateNormalLoader(loadercontext, result, callback);
    } else {
      // pitch方法没有返回值 下一个pitch
      loadercontext.loaderIndex++;
      iteratePitchLoader(loadercontext, callback);
    }
  }
}



let entry = '../src/index.js';
let options = {
  resource: path.resolve(__dirname, entry),
  loaders: [ // 这里的数据实际应该是 myLoader-runner-getPath.js 中获取到的loaders
    path.resolve(__dirname, 'patch-loader1.js'),
    path.resolve(__dirname, 'patch-loader2.js'),
    path.resolve(__dirname, 'patch-loader3.js')
  ]
}
runLoaders(options, (err, result) => {
  console.error('执行完毕');
  console.error(result);
})