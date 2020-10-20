<template>
  <div>
    <!-- son:count {{ count }}
    <button @click="sonChangeCount">修改count</button>
    <br>-----------------------------<br>
    son:value {{ value }}
    <button @click="sonChangeValue">修改value</button> -->
    ---------------<br>
    $attrs.value:{{ $attrs.value }}<br>
    <button @click="logListeners">点我log显示$listeners</button>
    <grandSon v-bind="$attrs" v-on="$listeners" @click="eat" @click.native="show"></grandSon>
    <!-- v-bind="$attrs" 这是直接把当前组件所有的属性都传到 grandSon 组件 -->
    <!-- v-on="$listeners" : 把所有方法都传给子组件  -->
    <!--  @click.native="show" --- .native 绑定原生方法 会给Son的最外层元素上绑定处理 -->
  </div>
</template>

<script>
import grandSon from './grandSon'
export default {
  name: 'son',
  components: {
    grandSon
  },
  // 如果组件中使用了props，就会将attrs从当前的$attrs移除掉,并且在组件的最外层标签上挂上attrs的所有属性
  inheritAttrs: false, // 可以设置 $attrs 的内容，不要挂在最外层的dom元素的属性上
  // props: {
  //   value: {
  //     type: Number

  //   },
  //   count: {
  //     type: Number
  //   }
  // },
  methods: {
    logListeners() {
      console.log(this.$listeners);
    },
    show() {
      console.log('parent fn show');
    },
    eat() {
      console.log('parent fn eat');
    },
    sonChangeCount() {
      this.$emit('update:count', 5)
    },
    sonChangeValue() {
      this.$emit('input', 6)
    }
  }
}
</script>