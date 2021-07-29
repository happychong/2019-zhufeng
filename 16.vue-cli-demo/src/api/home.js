import axios from '../utils/ajaxRequest';
import store from '@/store/index.js';

export const fetchCategory = () => {
  return axios.request({
    url: '/category'
  })
}

export const fetchLessonList = (size, offset) => {
  return axios.request({
    url: `/lessonList/${store.state.home.currentLesson}?size=5&offset=${offset}`
  })
  return axios.request({
    url: `/lessonList/${store.state.home.currentLesson}?size=${size}&offset=${offset}`
  })
}