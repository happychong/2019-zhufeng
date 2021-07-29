<template>
  <div>
    <div class="header">
      <img src="@/assets/logo.png" class="logo" />
      <span class="cubeic-select" @click="show"></span>
    </div>
    <cube-drawer
      ref="drawer"
      title="请选择"
      :data="data"
      @select="selectHandler"
    ></cube-drawer>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    data() {
      let defaultActive = [{text: '全部课程', value: -1}];
      return this.categories.length > 0
        ? [[...defaultActive, ...this.categories]]
        : [defaultActive];
    }
  },
  // data() {
  //   return {
  //     data: [
  //       [
  //         { text: '全部课程', value: '1'},
  //       ]
  //     ]
  //   }
  // },
  methods: {
    show() {
      this.$refs.drawer.show();
    },
    selectHandler(value) {
      console.log(value);
      this.$emit('change', value)
    }
  }
};
</script>
<style lang="stylus" scoped>
.header {
  height: 56px;
  background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: #fff;
}

.logo {
  width: 30px;
}
</style>
