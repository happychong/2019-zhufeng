<template>
  <div id="app">
    小娃年龄：{{ $store.state.age }}
    <br>
    大娃年龄： {{ $store.getters.myAge }}
    <br>
    <button @click="addAge">加5岁</button>
    <button @click="minus">异步-2岁</button>
    <br>
    计算属性：{{ $store.getters.computedI }}
    <br>
    深级状态-$store.state.a.i.ii： {{ $store.state.a.i.ii }}
    <button @click="changeII">修改最深的II</button>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  mounted() {
    console.log(this.$store);
    setTimeout((() => {
      // 这样直接改变store的值得写法是不对的，这里这么做只为了演示store数据的响应式
      this.$store.state.age++;
    }).bind(this), 1000)
  },
  methods: {
    addAge() {
      this.$store.commit('syncAdd', 5)
    },
    minus() {
      this.$store.dispatch('asyncMinus', 2)
    },
    changeII() {
      this.$store.commit('changeStoreII', 5)
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
