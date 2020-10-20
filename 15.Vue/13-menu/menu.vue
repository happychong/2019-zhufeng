<template>
  <myMenu>
    <!-- 循环-根据是否有children来判断是mySubMenu，还是myMenuItem -->
    <template v-for="menu in data">
      <ReSub :key="menu.id" :data="menu"></ReSub>
    </template>
  </myMenu>
</template>
<script>
import myMenu from "./components/my-menu";
import ReSub from './ReSub';

export default {
  components: {
    myMenu,
    ReSub
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
};
</script>