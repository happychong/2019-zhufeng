
import { fetchCategory } from '@/api/home.js';
import * as types from '@/store/actons-type';

export default {
  namespaced: true, // 命名空间，防止其他模块调用相同名称方法，导致的同步状态更新
  state: {
    categories: [],
    currentLesson: -1, // 当前用户选中的课程 默认全部
  },
  actions: { // actions - 发请求
    // async setCategories({commit}) {
    async [types.SET_CATEGORIES] ({commit}) {
      const res = await fetchCategory();
      commit(types.SET_CATEGORIES, res);
    }
  },
  mutations: { // mutations - 同步状态
    // 1) 设置分类
    [types.SET_CATEGORIES] (state, payload) { // home/setCategories
      state.categories = payload.data;
    },
    [types.SET_CURRENT_LESSON] (state, curLesson) { // home/setCategories
      state.currentLesson = curLesson;
    },
  },
}