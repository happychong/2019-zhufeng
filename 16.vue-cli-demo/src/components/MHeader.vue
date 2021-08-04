<template>
<div>
  <div class="m-header">
    <i class="iconfont iconfont-return"><</i>
    <slot></slot>
  </div>
  <div class="empty"></div>
  </div>
</template>

<style lang="stylus">
  .m-header {
    position absolute;
    top 0px
    height 60px;
    width 100%
    background #2a2a2a;
    color #fff;
    line-height 60px;
    z-index 9999
    .iconfont { 
      float left
    }
  }
    .empty {
      height 60px  
    }
</style>