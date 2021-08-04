/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
import Vue from 'vue';
import Router from 'vue-router';
// import Home from './views/Home.vue';
import Home from '@/views/Home/index.vue';
import Login from '@/views/Login/index.vue';
import loadable from '@/utils/loadable.js';
// 获取路由全部的钩子
import hooks from './hook';

Vue.use(Router); // mixin 声明2个全局组件 router-link & router-view


const router = new Router({
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
        keepAlive: false,
        needLogin: true,
      },
      // children: [
      //   {
      //     path: 'a',
      //     name: 'a',
      //     component: {
      //       render(h) {
      //         return <h1>abc</h1>
      //       },
      //     },
      //   },
      // ],
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
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        idx: 0,
        keepAlive: false // 是否需要缓存
      }
    },
    // {
    //   path: '/concact',
    //   name: 'concact',
    //   component: {
    //     render() {
    //       return (
    //         <h2>
    //           联系我
    //         </h2>
    //       )
    //     }
    //   }
    // },
    // {
    //   path: '/service',
    //   name: 'service',
    //   component: {
    //     render() {
    //       return (
    //         <h2>
    //           服务
    //         </h2>
    //       )
    //     }
    //   }
    // },
    {
      path: '*',
      name: 'none',
      component: {
        render() {
          return (
            <h2>
              找不到页面
            </h2>
          )
        }
      }
    },
  ],
});

Object.values(hooks).forEach(hook => {
  // 路由切换之前 : 使用 router.beforeEach 注册一个全局的 before 钩子
  router.beforeEach(hook.bind(router))
});

export default router