const path = require('path');
module.exports = {
    mode: 'development',
    devServer: { // webpack-dev-server 的配置
        port: 3000,
        compress: true, // gzip 可以提升返回页面的速度
        contentBase: path.resolve(__dirname, '../dist'), // webpack 启动服务，在dist目录下,可以理解为设置根目录？
    }
}