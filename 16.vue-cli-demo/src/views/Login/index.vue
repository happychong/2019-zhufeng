<template>
  <div class="login">
    <MHeader>登录</MHeader>
    <div class="login-form">
      <!-- <img src="../../assets/images/login_bj1.png" alt /> -->
      <cube-form :model="model" @submit="submitHandler" v-if="!user.username">
        <img alt="Vue logo" src="../../assets/logo.png">
        <cube-form-group>
          <cube-form-item :field="fields[0]"></cube-form-item>
          <cube-form-item :field="fields[1]"></cube-form-item>
        </cube-form-group>
        <cube-form-group>
          <cube-button type="submit">登录</cube-button>
        </cube-form-group>
      </cube-form>
      <cube-form :model="model" @submit="submitHandler" v-else>
        <img alt="Vue logo" src="../../assets/logo1.png" @click="upFile" v-if="user.url">
        <img alt="Vue logo" src="../../assets/logo.png" @click="upFile" v-else>
        <Upload ref="upload" @change="change" v-show="false"></Upload>
        <cube-form-group>
          <cube-button type="submit">{{ user.username }}, welcome</cube-button>
        </cube-form-group>
      </cube-form>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
// let { mapActions } = createNamespacedHelpers("login"); // 定死vuex中 login 空间
import { mapState, mapActions } from 'vuex';
import * as types from "@/store/actons-type";
import MHeader from '../../components/MHeader.vue';
import Upload from '../../components/Upload.vue';

export default {
  name: 'Login',
  components:{
    MHeader,
    Upload
  },
  computed: {
    ...mapState(['user'])
  },
  data() {
    return {
      model: {
        username: '',
        password: ''
      },
      fields: [
        {
          type: 'input',
          modelKey: 'username',
          label: '用户名 ',
          props: {
            placeholder: '请输入用户名'
          },
          rules: {
            required: true
          }
        },
        {
          type: 'input',
          modelKey: 'password',
          label: '密码 ',
          props: {
            placeholder: '请输入密码',
            type: 'password'
          },
          rules: {
            required: true
          }
        },
      ]
    }
  },
  methods: {
    ...mapActions([types.LOGIN, types.SET_AVATAR]),
    async change(fd) {
      let res = await this[types.SET_AVATAR](fd);
      console.log(res);
      debugger
    },
    upFile() {
      this.$refs.upload.show();
    },
    async submitHandler(e) {
      e.preventDefault();
      try {
        console.log(types.LOGIN);
        await this[types.LOGIN](this.model);
        this.$router.push('/');
      } catch(e) {
        console.log(e);
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
.login {
  &-form {
    width: 80%;
    margin : 0 auto;

    img {
      width 100px
      height 100px;
      margin 0 auto ;
      display block;
      margin-bottom 40px;
    }
  }
}
</style>