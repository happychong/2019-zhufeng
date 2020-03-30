const path = require('path');
module.exports = {
  mode: 'development',
  devtool: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolveLoader: {
    alias: {
      // 配置 module -> rules -> babel-loader 路径
      'babel-loader': path.resolve(__dirname, 'loaders/babel-loader.js')
    },
    // 配置 module -> rules 下配置的loader都先去当前路径的loaders目录下查找，再去node_modules下查找
    modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
  },
  module: {
    rules: [
      // 最简单的 babel-loader
      // {
      //   test: /\.js$/,
      //   use: ['babel-loader'] // 这样的写法会到node_modules下找babel-loader
      // }
      // pitch
      {
        test: /\.js$/,
        use: ['patch-loader1', 'patch-loader2', 'patch-loader3'] // 这样的写法会到node_modules下找babel-loader
      }
    ]
  },
  plugins: [

  ]
}