<template>
  <div>
    函数组件：
    <levelFunction type='1' :x="1" y='5'>
      <span>aa</span>
    </levelFunction>
    <br>
    slot
    <listComponent :arr="arr">
      <template v-slot:default="obj">
        <span># {{ obj }} - {{ obj ? obj.item : obj }}</span>
      </template>
    </listComponent>
  </div>
</template>

<script>
import levelFunction from './components/levelFunction.js';
import listComponent from './components/listComponent.vue';
export default {
  components: {
    levelFunction,
    listComponent
  },
  data() {
    return {
      arr: [1,2,3]
    }
  },
  render(h) {
    return h('h1', {}, '.vue文件，写了template，再写render方法，render方法失效')
  }
}
</script>