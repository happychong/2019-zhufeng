<template>
  <div>
    app
    <parent></parent>
  </div>
</template>

<script>
import parent from './components/parent';
export default {
  provide() {
    return { // 暴露全局方法，就是把父组件实例暴露到vm属性
      vm: this
    }
  },
  components: {
    parent
  },
  methods: {
    doFn() {
      console.log('doFn');
    }
  }
}
</script>