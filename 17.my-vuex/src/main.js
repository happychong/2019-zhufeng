import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store, // 将store实例注入到new Vue中，会从外到内的在所有的组件中生成$store属性
  render: h => h(App)
}).$mount('#app')
