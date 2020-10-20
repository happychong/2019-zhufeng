// npm install -g @vue/cli@3
// npm install -g @vue/cli-service-global

import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(ElementUI);


new Vue({
  el: '#app',
  render: h => h(App)
})