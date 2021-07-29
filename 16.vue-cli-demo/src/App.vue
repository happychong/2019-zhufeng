<template>
  <div id="app">
    <div class="container">
      <!-- 这里应用 keep-alive -->
      <transition :name="move">
        <!-- keep-alive 保存链接=缓存 内部会缓存虚拟节点，直接将缓存后的结果返回，不会重新请求然后渲染页面 -->
        <keep-alive v-if="$route.meta.keepAlive">
        <!-- 会根据路径切换 来显示对应的页面 可以应用transition动画 -->
          <router-view/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
      </transition>
    </div>
    <div id="nav">
      <cube-tab-bar
        v-model="selectedLabelDefault"
        :data="tabs"
        @change="changeHandler"
      >
      </cube-tab-bar>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      move: 'slide-left',
      selectedLabelDefault: '/',
      tabs: [
        {
          label: '首页',
          value: '/',
          icon: 'cubeic-home',
        },
        {
          label: '我的课程',
          value: '/course',
          icon: 'cubeic-like',
        },
        {
          label: '个人中心',
          value: '/profile',
          icon: 'cubeic-vip',
        },
      ],
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        if ((to, from)) {
          if (to.meta.idx > from.meta.idx) {
            this.move = "slide-left";
          } else {
            this.move = "slide-right";
          }
        }
        this.selectedLabelDefault = to.path;
      },
      // 页面进入，默认先走一次
      immediate: true,
    },
  },
  methods: {
    changeHandler(label) {
      // if you clicked different tab, this methods can be emitted
      this.$router.push(label);
    },
  },
};
</script>

<style lang="stylus">
html, body {
  height: 100%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  overflow: scroll;
}

#nav {
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #f2f2f2;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.cube-tab i {
  font-size: 22px;
}

.slide-left-enter-active, .slide-left-leave-active, .slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.4s linear;
}

.slide-left-enter-active, .slide-right-enter-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.slide-left-enter{
  transform: translate(100%);
}
// .slide-left-enter-to {
//   transform: translate(-100%);
// }
.slide-left-leave-to {
  transform: translate(-100%);
}

.slide-right-enter {
  transform: translate(-100%);
}
// .slide-right-enter-to {
//   transform: translate(100%);
// }
.slide-right-leave-to {
  transform: translate(100%);
}
</style>
