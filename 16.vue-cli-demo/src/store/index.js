/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
/* eslint-disable import/extensions */
/* eslint-disable linebreak-style */
import {
  Toast
} from 'cube-ui';
import Vue from 'vue';
import Vuex from 'vuex';
import {
  login,
  validate,
  upload
} from '../api/user.js';

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
    menuPermission: false, // 菜单是否拉取过
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
      // debugger;
      state.hasPermission = true;
    },
    [types.SET_MENU_LIST](state) {
      state.menuPermission = true;
    },
    [types.SET_AVATAR](state, fd) {
      // Vue.set
      state.user = { ...state.user, url: fd.url};
    },

  },
  actions: {
    // login
    async [types.LOGIN]({
      commit
    }, user) {
      try {
        let result = await login(user);
        commit(types.SET_USER, result);
        localStorage.setItem('token', result.token);
      } catch (e) {
        console.log(e);
        Toast.$create({
          txt: '用户无法登录-登陆失败！',
          time: 2000
        }).show();
        return Promise.reject(e);
      }
    },

    // validate
    async [types.VALIDATE]({
      commit
    }, user) {
      try {
        let userRes = await validate();
        if (userRes.code === 0) {
          commit(types.SET_USER, userRes);
          // localStorage.setItem('token', result.token);
          return true;
        }
        return false;

      } catch (e) {
        // return Promise.reject(e);
        return false;
      }
    },
    async [types.SET_AVATAR]({
      commit
    }, fd) {
      try {
        debugger
        let userAvartor = await upload(fd);
        debugger
        
        commit(types.SET_AVATAR, userAvartor)
      } catch (e) {

      }
    }
  },
});
