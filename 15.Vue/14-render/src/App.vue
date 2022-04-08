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
    <br>

    <button @click="upperMessage">弹出弹层</button>

    <button @click="upperMessage2">弹出弹层2</button>
  </div>
</template>

<script>
import levelFunction from './components/levelFunction.js';
import listComponent from './components/listComponent.vue';
import { Message } from './components/messageUpper.js';

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
  methods: {
    upperMessage() {
      Message.success({
        message: 'hello',
        duration: 3000
      })
    },
    upperMessage2() {
      this.$message.success({
        message: '你好',
        duration: 3000
      })
    }
  },
  render(h) {
    return h('h1', {}, '.vue文件，写了template，再写render方法，render方法失效')
  }
}
</script>