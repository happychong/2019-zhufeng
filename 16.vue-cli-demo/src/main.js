/* eslint-disable linebreak-style */
import Vue from 'vue';
import './plugins/axios'
import './cube-ui'; // 组件库
import App from './App.vue';
import router from './router';
import store from './store/index.js';
import 'amfe-flexible'; // 实现pm2rem

Vue.config.productionTip = false;

new Vue({
  router, // 给每个组件都增加this.$route (属性) 和 this.$router(方法)
  store,
  render: h => h(App),
}).$mount('#app');
