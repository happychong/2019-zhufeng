let fs = require('fs');
let total = 0;
for (let i = 0; i < 100000; i++) {
  total += i;
}
setInterval(() => {
  fs.appendFileSync('1.txt', 'zf');
}, 1000)