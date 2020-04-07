// babylon:在Babel中用到的javascript解析器
// babel-types:包含了用来手工构建AST节点和判断节点是否是某种AST类型的方法
// babel-generator：把语法树转成代码
// babel-traverse：保持树的状态，用来替换、移除和增加树的节点
let fs = require('fs');
let path = require('path');
// let ejs = require('ejs');
const babylon = require('babylon');
let types = require('babel-types');
let generator = require('babel-generator').default;
let traverse = require('babel-traverse').default;

class NormalModule {
  constructor({name, entry, context, request}) {
    this.name = name;
    this.context = context;
    this.request = request; // 模块的绝对路径
    this.dependencies = []; // 模块依赖的数组
    // this.moduleId = '';
    this.moduleId = entry;
    this._ast; // 语法树
    this._source; // 源代码
  }
  build(compilation) {
    console.log('现在开始编译入口模块了');
    // 读取模块内容
    let originalSource = compilation.inputFileSystem.readFileSync(this.request, 'utf8');
    const ast = babylon.parse(originalSource);
    let dependencies = [];
    traverse(ast, {
      CallExpression: (nodePath) => {
        if (nodePath.node.callee.name === 'require') {
          let node = nodePath.node;
          node.callee.name = '__webpack_require__';
          let moduleName = node.arguments[0].value; // ./title
          let extname = moduleName.split(path.posix.sep).pop().indexOf('.') === -1 ? '.js' : '';
          // 获取依赖模块的结对路径   .title.js
          let dependenciesRequest = path.posix.join(path.posix.dirname(this.request), moduleName + extname);
          // 获取依赖模块的模块Id   ./src/title.js
          let dependenciesModuleId = './' + path.posix.relative(this.context, dependenciesRequest);
          dependencies.push({
            name: this.name,
            context: this.context,
            entry: dependenciesModuleId,
            request: dependenciesRequest
          });
          // 把参数从 ./title.js 改为 ./src/title.js
          node.arguments = [types.stringLiteral(dependenciesModuleId)];
        }
      }
    });
    // 把转换后的抽象语法树重新生成代码
    let { code } = generator(ast);
    console.log(code, '-------------');
    this._ast = ast;
    this._source = code; // 当前模块源码
    compilation.modules.push(this); // 添加本模块
    debugger
    // 这里有坑 module是啥，感觉应该是this
    compilation._modules[this.request] = module;
    this.dependencies = dependencies;
    compilation.buildDependencies(this, dependencies);
    return this;
  }
}
module.exports = NormalModule;