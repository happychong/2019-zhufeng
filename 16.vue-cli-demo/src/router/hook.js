/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable object-shorthand */
/* eslint-disable no-lonely-if */
/* eslint-disable linebreak-style */
// 根据路由相关的hook 钩子 全局钩子
import store from '../store/index';
import * as types from '../store/actons-type';
import auth from './auth';

export default {
  // 标识 当前的hook的作用
  cancelToken: (to, from, next) => {
    // 清除token
    store.commit(types.CLEAR_TOKEN);
    next(); // 继续往下走
  },

  // 给每一个hook对应一个功能
  permission: async (to, from, next) => {
    // 如果用户没有登录 访问了课程页面 应该跳转登录页面
    // 页面切换的时候 需要拿到当前的状态 - 是否登录
    let needLogin = to.matched.some(item => item.meta.needLogin);
    // 这里可以做白名单，直接next
    if (!store.state.hasPermission) {
      // 没有权限
      // flag 当前是否已经登录
      let flag = await store.dispatch(types.VALIDATE);
      // debugger
      if (needLogin) {
        // 当前路径 需要登录
        if (!flag) {
          // 需要登录 没登录
          next('/profile');
        } else {
          next();
        }
      } else {
        // 不需要登录
        if (to.name === 'login') { //  || to.name === 'profile'
          if (!flag) {
            // 需要登录 没登录
            next();
          } else {
            next('/profile');
          }
        } else {
          next();
        }
      }
    } else {
      // 有权限
      if (to.name === 'login') { //  || to.name === 'profile'
        // 如果已经登录 访问login页面，跳转到首页
        next('/');
      } else {
        next();
      }
    }
  },
  profileAuth: function (to, from, next) {
    // 根据当前用户权限，动态加载路由
    if ((!store.state.menuPermission) && store.state.user && store.state.user.menuList) {
      // 没拉取过 && 已登录
      let listRole = store.state.user.menuList.map(item => item.auth);
      let newRoutes = auth.filter(item => listRole.includes(item.name));
      this.addRoutes(newRoutes);
      store.commit(types.SET_MENU_LIST);
      // 需要重新进入路由，才会生效，replace为了不记录路由历史 history
      let obj = {...to, replace: true};
      obj.name = '';
      // ↑ 这里要把name重置，否则第一次匹配的时候，route的name匹配的是none（见整体路由无匹配页面的name），
      // 再次进入的时候默认还是用name匹配路由，重置后就会从path匹配路由
      return next(obj); // hack
    }
    next();
  }
}
