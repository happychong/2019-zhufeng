
// const commander = require('commander');
import program from 'commander';
import Server from './server.js';

program
    .option('-p, --port <val>', 'set my-server port ', 4000)
    .parse(process.argv);

let config = {
    port: 4000
};
Object.assign(config, program);

// 通过解析的参数 启动服务
let server = new Server(config);
server.start();