// 同步加载
// let title = require('./title.js');
// console.log(title);

// 异步加载
let button = document.createElement('button');
button.innerHTML = '点我异步加载';
button.addEventListener('click', () => {
  import(/*webpackChunkName: 'title'*/'./title.js').then(result => {
    console.log(result.default);
  })
})
document.body.appendChild(button);