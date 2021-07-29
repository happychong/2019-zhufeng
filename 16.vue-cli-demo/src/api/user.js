// 登录接口
import axios from '../utils/ajaxRequest';
// import store from '@/store/index.js';

export const login = (user) => {
  return axios.request({
    url: '/login',
    method: 'POST',
    data: user
  })
}

// 校验token
export const validate = (user) => {
  return axios.request({
    url: '/validate',
    method: 'POST',
    data: user
  })
}
