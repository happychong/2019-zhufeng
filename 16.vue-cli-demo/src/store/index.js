import { Toast } from 'cube-ui';
import Vue from 'vue';
import Vuex from 'vuex';
import { login } from '../api/user.js';

import home from './modules/home.js';
import * as types from "@/store/actons-type";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home
  },
  state: {
    user: {}, // 用户信息
    ajaxToken: [], // 所有请求
    hasPermission: false, // 是否校验过登录数据
  },
  mutations: {
    [types.PUSH_TOKEN](state, cancel) {
      state.ajaxToken = [...state.ajaxToken, cancel];
    },
    [types.CLEAR_TOKEN](state) {
      state.ajaxToken.forEach(cancel => cancel());
      state.ajaxToken = []; // 清空数组
    },
    [types.SET_USER](state, payload) {
      state.user = payload;
      state.hasPermission = true;
    }
  },
  actions: {
    // login
    async [types.LOGIN]({commit}, user) {
      try {
        console.log(user, login);
        let result = await login(user);
        commit(types.SET_USER, result);
        localStorage.setItem('token', result.token);
      } catch (e) {
        console.log(e);
        Toast.$create({
          txt: '用户无法登录',
          time: 2000
        }).show();
        return Promise.reject(e);
      }
    },

    // validate
    async [types.VALIDATE]({commit}) {
      try {
        let user = await validate();
        commit(types.SET_USER, user);
        // localStorage.setItem('token', result.token);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
})