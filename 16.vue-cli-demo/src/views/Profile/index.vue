<template>
  <div class="home">
    <Login></Login>
    <!-- 下面组件应该和路由表中的区分开 根据接口权限动态加载需要哪些路由-->
    <ul>
      <router-link tag="li" v-for="menu in user.menuList" :key="menu.path" :to="menu.path">{{ menu.name }}</router-link>
    </ul>
  </div>
</template>

<script>
import Login from '../Login/index';
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState(['user'])
  },
  components: {
    Login
  }
}
</script>


<style lang="stylus" scoped>
.home {
  background-color:grey;
  width 100%;
  color white;
  height 100%;
  box-sizing border-box;
  padding-top 15%
}
</style>