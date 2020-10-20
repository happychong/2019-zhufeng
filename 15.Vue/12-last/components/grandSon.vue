<template>
  <div class="aa">
    grandson： {{ $attrs }}
    
    <button>点我-也会触发最外层div的click</button>
    
    <button @click="$listeners.say">我想触发父亲的父亲的事件：say</button>
  </div>
</template>

<script>
export default {
  inject: ['vm'], // 注入，会向上查找（找到就停止），这里直接拿到了App.vue provide 的内容
  mounted() {
    console.log('vm', this.vm); // 这里直接获取到了App.vue 实例
    this.vm.doFn();
    // 触发 $bus 事件
    this.$nextTick(() => {
      this.$bus.$emit('change');
    })
    
  }
}
</script>

<style scoped>
.aa { background-color: antiquewhite; border: 1px solid rebeccapurple;}
</style>