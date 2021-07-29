// 根据路由相关的hook 钩子 全局钩子
import store from '@/store';
import * as types from '@/store/actions-type';

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
    await store.dispatch(types.VALIDATE);
    // 页面切换的时候 需要拿到当前的状态 - 是否登录


    next();
  }
}