// 真正的 express 文件
const application = require('./application');
const Router = require('./router/index');
// 创建应用
function createApplication() {
    return new application
}
createApplication.Router = Router;
module.exports = createApplication;