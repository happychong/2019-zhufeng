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

// 上传头像
export const upload = (fd) => {
  debugger
  return axios.request({
    url: '/upload',
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: fd
  })
}
