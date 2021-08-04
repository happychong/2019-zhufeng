/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable no-else-return */
/* eslint-disable arrow-parens */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/no-absolute-path */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */

import axios from 'axios'; // 基于promise

import fakeData from '/fakeData/index.js';
import { Toast } from 'cube-ui';
import store from '../store';
import types from '../store/actons-type';

// axios 可以配置拦截器 可以给实例增加多个拦截器
// axios 实例需要唯一性，才可以给每个请求独立增加拦截器

// 开发的时候 localhost  上线时候/xxx
class AjaxRequest {
  constructor() {
    // 基础路径
    this.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000/api' : '/';
    this.timeout = 3000;
    // 公用的弹出框 之后只控制显示，隐藏
    this.toast = Toast.$create({
      txt: '加载中。。。',
      time: 0, // 不自动关闭
    });
    // 请求队列 防止弹出框重复弹出
    this.queue = {};
  }
  setInterceptor(instance, url) {
    // 请求拦截
    instance.interceptors.request.use((config) => {
      config.headers.token = localStorage.getItem('token') || '';


      let Cancel = axios.CancelToken; // 产生一个请求令牌
      config.CancelToken = new Cancel(function a (c) {
        // vuex
        store.commit(types.PUSH_TOKEN, c); // 订阅
      });

      if (Object.keys(this.queue).length === 0) {
        // 显示loading
        this.toast.show();
      }
      this.queue[url] = url;
      return config;
    }, err => {
      return Promise.reject(err);
    });
    // 响应拦截
    instance.interceptors.response.use((res) => {
      Reflect.deleteProperty(this.queue, url);
      // 关闭loading
      if (Object.keys(this.queue).length === 0) {
        this.toast.hide();
      }
      if (res.data.code === 0) {
        return res.data.data;
      }
      return res;
    }, err => {
      Reflect.deleteProperty(this.queue, url);
      if (Object.keys(this.queue).length === 0) {
        this.toast.hide();
      }
      if (fakeData[url]) {
        // 关闭loading
        return fakeData[url];
      } else {
        return Promise.reject(err);
      }
    });
  }
  request(options) {
    let instance = axios.create();
    let config = { ...options, baseurl: this.baseURL, timeout: this.timeout };
    this.setInterceptor(instance, options.url); // 给实例增加拦截功能
    return instance(config); // 返回的是一个promise
  }
}
// new AjaxRequest().request({
//   url: 'xxx'
// }).then(data => {

// })
export default new AjaxRequest();