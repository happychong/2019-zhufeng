// 类似中间层

const http = require('http');

// request get
// http.get('http://localhost:3000', function() {
//     console.log('发送成功');
// });

let config = {
    port: 3000, 
    hostname: 'localhost',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
    },
    method: 'POST'
};
let client = http.request(config, function (res) {
    console.log('request发送成功');
    res.on('data', function(chunk) {
        console.log('我收到的内容---', chunk.toString());
    });
});
client.end('b=2');