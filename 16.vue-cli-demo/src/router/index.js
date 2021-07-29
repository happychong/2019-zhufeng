/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
import Vue from 'vue';
import Router from 'vue-router';
// import Home from './views/Home.vue';
import Home from '@/views/Home/index.vue';
import loadable from '@/utils/loadable.js';

Vue.use(Router); // mixin 声明2个全局组件 router-link & router-view

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        idx: 0,
        keepAlive: true // 是否需要缓存
      }
    },
    {
      path: '/course',
      name: 'course',
      meta: {
        idx: 1,
        keepAlive: false
      },
      // import - 匹配到路径后，才会加载这个组件，这是异步组件
      // 但异步组件会导致白屏问题，可以进来先默认展示loading，组件加载完毕之后，把loading取消
      // component: () => import(/* webpackChunkName: "course" */ '@/views/Course/index.vue'),
      component: loadable(() => import('@/views/Course/index.vue')),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        idx: 2,
        keepAlive: false
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: loadable(() => import(/* webpackChunkName: "profile" */ '@/views/Profile/index.vue')),
    },
  ],
});
