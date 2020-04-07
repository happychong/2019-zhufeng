const path = require('path');

const MyPlugin = require('./plugins/Myplugin.js');

module.exports = {
  // context: process.cwd(), // 这里可以指定工作目录
  mode: 'development',
  devtool: 'none',
  // entry: './src/index.js',
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // 'bundle.js'
  },
  module: {
    rules: []
  },
  plugins: [
    new MyPlugin()
  ]
}