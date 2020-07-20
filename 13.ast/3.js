/**
 * ast 全步骤：
 * 1.根据源代码生成语法树
 * 2.转换语法树
 * 3.根据语法树生成转换后的代码
 * 
 * （此文件实现的功能-把jsx的代码转成语法树）
*/


let sourceCode = `let  element = <h1>hello</h1>;`
/**
 * 步骤：
 * 1.分词，把token拆开   词法分析：就是把代码转换成一个token流，其实就是一个token的数组
 */
function lexical(code) {
  const tokens = [];
  for (let i = 0; i < code.length; i++) {
    let ch = code.charAt(i); // l
    if (/[a-zA-Z]/.test(ch)) {
      // 标识符 | 关键字
      let token = { type: 'Identifier', value: ch};
      tokens.push(token);
      for (i++; i < code.length; i++) {
        ch = code.charAt(i); // e
        if (/[a-zA-Z]/.test(ch)) {
          token.value += ch;
        } else {
          if (token.value === 'let') {
            token.type = 'Keyword';
          }
          i--;
          break;
        }
      }
      continue;
    } else if (/\s/.test(ch)) {
      let token = { type: 'WhiteSpace', value: ' '};
      tokens.push(token);
      for (i++; i < code.length; i++) {
        ch = code.charAt(i);
        if (!/\s/.test(ch)) {
          i--;
          break;
        }
      }
      continue;
    } else if (ch === '=') {
      let token = { type: 'Equal', value: '='};
      tokens.push(token);
    } else if (ch === '<') {
      let token = { type : 'JSXElement', value: ch};
      tokens.push(token);
      let isClose = false;
      for (i++; i < code.length; i++) {
        ch = code.charAt(i);
        if (ch === '/') {
          isClose = true;
        }
        if (ch === '>') {
          if (isClose) {
            token.value += ch;
            break;
          } else {
            token.value += ch;
          }
        } else {
          token.value += ch;
        }
      }
      continue;
    }
  }
  return tokens
}
let tokens = lexical(sourceCode);
console.log(tokens);

/**
 * [
 *    {type: 'KeyWord', value: 'let'},
 *    {type: 'WhiteSpace', value: ' '},
 *    {type: 'Identifier', value: 'element'},
 *    {type: 'Equal', value: '='},
 *    {type: 'JSXElement', value: '<h1>hello</h1>'}
 * ]
 * 
 */