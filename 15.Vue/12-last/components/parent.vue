<template>
  <div>
    <!-- 写法1 -->
    <!-- <Son :count="count" @update:count="changeCount"></Son> -->
    <!-- 写法2 -->
    <!-- <Son :count="count" @update:count="newValue => count = newValue"></Son> -->
    <!-- 写法3 .sync写法，组件内需要触发（emit）的方法执行，必须是update:当前属性名（这里是count）方式触发-->
    <!-- <Son :count.sync="count"></Son> -->
    <!-- 写法4 -->
    <!-- <Son :value="count" @input="newValue => count = newValue"></Son> -->
    <!-- 写法5 -->
    <Son ref="son" v-model="count" :name="name" @click="clickFn" @say="clickFn"></Son>
  </div>
</template>

<script>
import Son from './son';
export default {
  components: {
    Son
  },
  mounted() {
    // 绑定 $bus 事件
    this.$bus.$on('change', function() {
      console.log('this.$bus.$on 执行了');
    })
  },
  data() {
    return {
      name: 'son',
      count: 1
    }
  },
  methods: {
    clickFn() {
      console.log("i am parent's fn");
    },
    changeCount(newValue) {
      this.count = newValue
    },
  }
}
</script>