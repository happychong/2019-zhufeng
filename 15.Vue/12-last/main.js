// 入口文件，可以省略，省略的时候默认render(App)

import Vue from 'vue';
import App from './App.vue';

// 这里可以配置全局性的东西

// 创建一个全局的发布订阅，数据流很混乱，偶尔用一次还可以
Vue.prototype.$bus = new Vue();


// 创建vue实例
new Vue({
  el: '#app',
  render: h => h(App)
})