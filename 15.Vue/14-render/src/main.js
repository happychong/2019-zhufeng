import { createApp } from 'vue'
import App from './App.vue'

import newUIMessage from './components/messageUpper.js';
let app = createApp(App);

// use 方法会默认调用组件的install方法
app.use(newUIMessage);


app.mount('#app')
