<template>
  <div class="home">
    <Login></Login>
  </div>
</template>

<script>
import Login from '../Login/index';

export default {
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