
<template>
  <div class="home">
    <HomeHeader :categories="categories" @change="change"></HomeHeader>
    <cube-slide :data="items" />
    <div class="home-wrapper">
      <cube-recycle-list
        ref="list"
        class="list"
        :size="size"
        :on-fetch="onFetch"
        :offset="offset"
      >
        <template slot="item" slot-scope="{ data }">
          <div :id="data.id" class="item" @click="handleClick(data)">
            <span>
              <h5>{{ data.msg }}</h5>
              <p>{{ data.time }}</p>
            </span>
          </div>
        </template>
      </cube-recycle-list>
    </div>
  </div>
</template>

<script>
// import { fetchCategory } from '@/api/home.js';
import HomeHeader from "./HomeHeader.vue";
// vuex 请求写法 2
// import { mapActions } from 'vuex';
// vuex 请求写法 3
import { createNamespacedHelpers } from "vuex";
let { mapActions, mapState, mapMutations } = createNamespacedHelpers("home"); // 定死vuex中 home 空间
import * as types from "@/store/actons-type";

import { fetchLessonList } from "@/api/home.js";

export default {
  components: {
    HomeHeader,
  },
  computed: {
    ...mapState(["categories"]),
  },
  methods: {
    // vuex 请求写法 2
    // ...mapActions('home', ['setCategories']), // 相当于把home中的actions拿到了页面的methods里
    // vuex 请求写法 3
    // ...mapActions(['setCategories'])
    ...mapActions([types.SET_CATEGORIES]), // 以上写法改成公共变量
    ...mapMutations([types.SET_CURRENT_LESSON]),
    change(val) {
      // 切换课程
      this[types.SET_CURRENT_LESSON](val[0]); // 将选中结果通过mutation 传入 vuex 中
      // 重置，获取数据
      this.hasMore = true;
      this.offsetIndex = 0;
      this.$refs.list.reset();
    },

    async onFetch() {
      if (this.hasMore) {
        let { data: result, hasMore } = await fetchLessonList(
          this.size,
          this.offsetIndex
        );
        this.hasMore = hasMore;
        this.offsetIndex = this.offsetIndex + result.length;
        return result;
      } else {
        // 停止滚动 返回false
        return false;
      }

      let items = [];
      return new Promise((resolve) => {
        // 模拟请求 50 条数据，因为 size 设置为 50
        setTimeout(() => {
          for (let i = 0; i < 5; i++) {
            items.push({
              id: i,
              avatar:
                "https://s3.amazonaws.com/uifaces/faces/twitter/danpliego/128.jpg",
              msg: "123",
              time: "Thu Oct 25 2018 15:02:12 GMT+0800 (中国标准时间)",
            });
          }
          resolve(items);
        }, 1000);
      });
    },
    handleClick(data) {
      console.log("Item:" + data);
    },
  },
  created() {
    // 页面一创建，可以创建一些 不需要动态监控 的公共数据
    this.offsetIndex = 0; // 偏移量
    this.hasMore = true;
  },
  activated() {
    // 生命周期 激活：当前页面又显示了
    let pos = sessionStorage.getItem("position") || 0;
    this.$refs.list.$el.scrollTop = pos;
  },
  deactivated() {
    // 生命周期 失活：当前页面不显示了
  },
  mounted() {
    // 直接请求的写法
    // fetchCategory().then(data => {
    //   console.log(data);
    // })

    // vuex 请求写法 1
    // this.$store.dispatch("home/setCategories"); // 用了 mapActions 了，所以下面直接用this的方法执行
    // vuex 请求写法 2 &  vuex 请求写法 3
    // this.setCategories();
    this[types.SET_CATEGORIES](); // 以上写法改成公共变量

    // 记录列表滚动位置
    // 防抖(定时器)-滑动多次，只触发一次   &    节流(时差)
    let timer = null;
    this.$refs.list.$el.addEventListener("scroll", (e) => {
      if (timer) {
        clearTimeout(timer);
      }
      // 防抖(定时器)-存储滚动条位置---滑动多次，只触发一次
      timer = setTimeout(() => {
        sessionStorage.setItem("position", e.target.scrollTop);
      });
    });
  },
  data() {
    return {
      size: 9,
      offset: 100,
      items: [
        {
          url: "http://www.didichuxing.com/",
          image:
            "//webapp.didistatic.com/static/webapp/shield/cube-ui-examples-slide01.png",
        },
        {
          url: "http://www.didichuxing.com/",
          image:
            "//webapp.didistatic.com/static/webapp/shield/cube-ui-examples-slide02.png",
        },
        {
          url: "http://www.didichuxing.com/",
          image:
            "//webapp.didistatic.com/static/webapp/shield/cube-ui-examples-slide03.png",
        },
      ],
    };
  },
};
</script>
<style lang="stylus" scoped>
.home {
  &-slide {
  }

  &-wrapper {
    height: calc(100vh - 350px);
    width: 100%;
  }

  .item {
    text-align: left;
    padding: 0px 15px;
    display: -webkit-box;

    h5 {
      width: 100%;
      clear: both;
      font-weight: bold;
    }

    p {
      padding-left: 35px;
      margin-bottom 10px;
    }
  }
}
</style>
