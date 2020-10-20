<template>
  <div>
    app
    <!-- <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu> -->
        
    <Menu :data="data"></Menu>
  </div>
</template>

<script>
// import myMenu from './components/my-menu';
// import myMenuItem from './components/my-menu-item';
// import mySubMenu from './components/my-submenu';

import Menu from './menu';

export default {
  components: {
    // myMenu,
    // myMenuItem,
    // mySubMenu,
    Menu
  },
  data(){
    return {
      data: [
        { name: '导航一', id: 1, children: [
          { name: '一~1', id: 1.1, children: [
            { name: '一~1...1', id: 1.11 },
            { name: '一~1...2', id: 1.12 }
          ] },
          { name: '一~2', id: 1.2 },
        ] },
        { name: '导航二', id: 2 },
        { name: '导航三', id: 3 }
      ]
    }
  },
  methods: {
  }
}
</script>