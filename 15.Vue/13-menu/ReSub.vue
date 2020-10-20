<template>
  <mySubMenu v-if="data && data.children && data.children.length > 0">
    <template slot="title">{{ data.name }}</template>
    <template v-for="item in data.children">
      <reSub :data="item" :key="item.id"></reSub>
    </template>
  </mySubMenu>
  <myMenuItem v-else :key="data.id">{{ data.name }}</myMenuItem>
</template>

<script>
import mySubMenu from "./components/my-submenu";
import myMenuItem from "./components/my-menu-item";


export default {
  name: 'reSub', // 递归组件 - 需要给当前要递归的组件提供一个name属性，并且可以在当前组件内部，通过name来调用自己
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    myMenuItem,
    mySubMenu
  }
}
</script>