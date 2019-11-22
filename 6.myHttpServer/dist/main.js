"use strict";

var _commander = _interopRequireDefault(require("commander"));

var _server = _interopRequireDefault(require("./server.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const commander = require('commander');
_commander.default.option('-p, --port <val>', 'set my-server port ', 4000).parse(process.argv);

let config = {
  port: 4000
};
Object.assign(config, _commander.default); // 通过解析的参数 启动服务

let server = new _server.default(config);
server.start();