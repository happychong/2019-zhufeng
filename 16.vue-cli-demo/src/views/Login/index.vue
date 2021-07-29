<template>
  <div class="login">
    <div class="login-form">
      <!-- <img src="../../assets/images/login_bj1.png" alt /> -->
      <img alt="Vue logo" src="../../assets/logo.png">
      <cube-form :model="model" @submit="submitHandler">
        <cube-form-group>
          <cube-form-item :field="fields[0]"></cube-form-item>
          <cube-form-item :field="fields[1]"></cube-form-item>
        </cube-form-group>
        <cube-form-group>
          <cube-button type="submit">登录</cube-button>
        </cube-form-group>
      </cube-form>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
// let { mapActions } = createNamespacedHelpers("login"); // 定死vuex中 login 空间
import { mapActions } from 'vuex';
import * as types from "@/store/actons-type";
export default {
  name: 'Login',
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
    ...mapActions([types.LOGIN]),
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