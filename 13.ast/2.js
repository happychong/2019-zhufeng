// 此文件实现 ->  babel-plugin-transform-es2015-arrow-functions 功能，将箭头函数转换为普通函数

let babel = require('@babel/core'); // 用来生成语法树，并且遍历转换语法树
let t = require('babel-types'); // 用来生成新的节点，或者判断某个节点是否是某个类型

const sourceCode = `const sum = (a, b) => a + b`;

let transformArrayFunction = {
  // visitor(访问器属性) 可以访问源代码生成的语法树的所有节点，捕获特定的节点
  visitor: {
    // 捕获箭头函数表达式，然后转换成普通函数
    ArrowFunctionExpression: (path, state) => {
      let id = path.parent.id; // path.node = 当前节点   path.parent = 父节点
      let arrowNode = path.node;
      let params = arrowNode.params;
      let body = arrowNode.body;
      let generator = arrowNode.generator;
      let async = arrowNode.async;
      let functionExpression = t.functionExpression(id, params, t.blockStatement([t.returnStatement(body)]), generator, async);
      // 用新的替换掉老的path
      path.replaceWith(functionExpression);
    }
  }
};
let result = babel.transform(sourceCode, {
  plugins: [transformArrayFunction]
});
console.log(result);
