class MyPlugin {
  apply(compiler) {
    console.log('this is my first webpack plugin.');
    compiler.hooks.environment.tap('MyPlugin', () => {
      console.log('这里监听的hooks.environment  MyPlugin 执行了');
    })
  }
}
module.exports = MyPlugin;