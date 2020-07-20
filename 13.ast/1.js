// 用工具生成 ast 语法树

let esprima = require('esprima'); // 源代码转成AST语法树的工具
let estraverse = require('estraverse'); // 遍历语法树的工具
let escodegen = require('escodegen'); // 把AST语法树重新生成代码的工具

// 源代码
let sourceCode = 'function ast(){}';
// 语法树
let ast = esprima.parseScript(sourceCode);

let indent = 0;
function pad() {
  return ' '.repeat(indent);
}

estraverse.traverse(ast, {
  enter(node) {
    console.log(pad() + node.type);
    indent += 2;
  },
  leave(node) {
    console.log(pad() + node.type);
    indent -= 2;
  }
});

