/* eslint-disable linebreak-style */
// 实现loading效果
import Loading from '@/components/Loading.vue'

const loadable = (asyncFunction) => {
  const component = () => ({
    component: asyncFunction(),
    loading: Loading,
  });
  // 最终返回的是一个组件，组件需要有render，通过render再渲染一个异步组件
  return {
    render(h) {
      return h(component)
    }
  }
  // 组件是一个对象，会变成render函数
};
export default loadable
