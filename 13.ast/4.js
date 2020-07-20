/**
 * 步骤：
 * 2.tokens转换成语法树
 */

function parse(tokens) {
  let ast = { type: 'Program', body: [], sourceType: 'module' };
  let i = 0; // 当前的索引
  let currentToken; // 当前的token
  while (currentToken = tokens[i]) {
    if (currentToken.type === 'Keyword' && currentToken.value === 'let') {
      let VariableDeclaration = { type: 'VariableDeclaration', declarations: []};
      ast.body.push(VariableDeclaration);
      i += 2;
      let curToken = tokens[i];
      let variableDeclarator = {
        type: 'VariableDeclarator',
        id: { type: 'Identifier', name: curToken.value }
      }
      i += 2;
      curToken = tokens[i];
      if (curToken.type === 'String') {
        variableDeclarator.init = { type: 'StringLiteral', value: curToken.value }
      } else if (curToken.type === 'JSXElement') {
        // JSX
        let value = curToken.value;
        let [, type, children] = value.match(/<([^>]+?)>([^<]+)<\/\1>/);
        variableDeclarator.init = {
          type: 'JSXElement',
          openingElement: {
            type: 'OpeningElement',
            name: { type: 'JSXIdentifier', name: type }
          },
          closingElement: {
            type: 'ClosingElement',
            name: { name: type}
          },
          children: [
            { type: 'JSXText', value: children }
          ]
        }
      }
      VariableDeclaration.declarations.push(variableDeclarator);
    }
    i++;
  }
  return ast
}

// 这个tokens 的结果，就是3.js拆词得到的结果
let tokens = [
  { type: 'Keyword', value: 'let' },
  { type: 'WhiteSpace', value: ' ' },
  { type: 'Identifier', value: 'element' },
  // { type: 'WhiteSpace', value: ' ' },
  { type: 'Equal', value: '=' },
  // { type: 'WhiteSpace', value: ' ' },
  { type: 'JSXElement', value: '<h1>hello</h1>' }
  // { type: 'String', value: 'hello' }
];
let ast = parse(tokens);
console.log(JSON.stringify(ast));
