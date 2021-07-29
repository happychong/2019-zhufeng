<template>
  <div class="home">
    course
  </div>
</template>

<script>
export default {
  // 以下一般时候不用，一般权限相关代码，还是在hook中
  // 路由钩子
  beforeRouteEnter (to, from, next) {
    // 路由守卫 - 只有通过路由渲染的才会执行这些钩子函数，路由渲染加了loading，就不是路由进入了
    console.log('路由进入之前');
    console.log(this); // undefine 这里没有this，想拿到this，要在next中
    next((vm) => {
      console.log(vm);
    })
  },
  beforeRouteUpdate() {
    // 路由更新之前
  },
  beforeRouteLeave (to, from, next) {
    // 路由离开之前
    // 可以做弹窗效果
  }
}
</script>
<style lang="stylus" scoped>
.home {
  background-color red;
  width 100%;
}
</style>