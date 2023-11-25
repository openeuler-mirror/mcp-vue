<template>
  <div class="form-box">
    <div class="form-title">
      <img class="logo-pic" src="~@/assets/hnkylin/kylin-logo.png" alt srcset />
      <p class="login-top-intro white-p">麒麟信安云</p>
    </div>
    <el-form
      ref="loginForm"
      :model="loginData"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">欢迎登录KCP云管理平台</h3>
      </div>

      <el-form-item prop="name">
        <el-input
          v-model="loginData.name"
          class="login-infor-input"
          placeholder="用户名"
          name="name"
          type="text"
          auto-complete="on"
        >
          <img
            slot="prefix"
            class="login-input-icon"
            src="~@/assets/hnkylin/user.png"
            alt
          />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginData.password"
          class="login-infor-input"
          type="password"
          placeholder="密码"
          name="password"
          autocomplete="new-password"
          @keyup.enter.native="handleLogin"
        >
          <img
            slot="prefix"
            class="login-input-icon"
            src="~@/assets/hnkylin/password.png"
            alt
          />
        </el-input>
      </el-form-item>
      <div class="link-herf">
        <el-checkbox v-model="pwdChecked">记住密码</el-checkbox>
      </div>
      <div class="login-btn-content">
        <el-button
          :loading="loading"
          type="primary"
          @click.native.prevent="handleLogin"
          >登 录</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export default {
  name: "LoginForm",
  data() {
    return {
      // 登录表单信息
      loginData: {
        name: "",
        password: "",
        md5password: "",
      },
      // 登录信息校验
      loginRules: {
        name: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, message: "密码长度至少 6 个字符", trigger: "blur" },
        ],
      },
      loading: false, // 登录按钮是否正在操作中
      redirect: null, // 记录退出前的页面url，登陆后会进入之前页面
      pwdChecked: false, // 是否记住密码
      secretKey: "unikylinsecselfservice",
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    // 进行登录
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginData)
            .then(() => {
              this.$router.push({ path: "/home" });
              this.loading = false;
              if (this.pwdChecked) {
                this.setUserInfo();
              } else {
                this.clearCookie();
              }
            })
            .catch((res) => {
              this.loading = false;
            });
        }
      });
    },
    // 跳转到注册页
    toRegister() {
      this.$emit("toggleRegister", true);
    },
    // 记录信息到cookie
    setUserInfo() {
      const cname = CryptoJS.AES.encrypt(
        this.loginData.name + "",
        this.secretKey
      ).toString();
      const cpwd = CryptoJS.AES.encrypt(
        this.loginData.password + "",
        this.secretKey
      ).toString();
      // 创建7天内过期的cookie，在整个站点有效
      Cookies.set("cname", cname, { expires: 7 });
      Cookies.set("cpwd", cpwd, { expires: 7 });
      localStorage.setItem("rememberPsw", "true");
    },
    // 从cookie 中获取信息
    getUserInfo() {
      this.pwdChecked = localStorage.getItem("rememberPsw") === "true";
      if (document.cookie.length > 0 && this.pwdChecked) {
        const cname = Cookies.get("cname");
        const cpwd = Cookies.get("cpwd");
        this.loginData.name = CryptoJS.AES.decrypt(
          cname,
          this.secretKey
        ).toString(CryptoJS.enc.Utf8);
        this.loginData.password = CryptoJS.AES.decrypt(
          cpwd,
          this.secretKey
        ).toString(CryptoJS.enc.Utf8);
      }
    },
    clearCookie() {
      Cookies.set("cname", "");
      Cookies.set("cpwd", "");
      localStorage.setItem("rememberPsw", "");
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
  },
};
</script>

<style lang="scss">
.form-box {
  width: 528px;
  border-radius: 10px;
  padding: 10px 60px;
  margin-left: 200px;
  background-color: $light_gray;
  position: absolute;
  left: 45vw;
  top: 50%;
  transform: translateY(-50%);
  &.form-register {
    top: 85px;
  }
  .login-form {
    position: relative;
    margin: 0 auto;
    overflow: hidden;
    .el-form-item {
      background: $light_gray;
      margin-bottom: 18px;
      .el-input--prefix .el-input__inner {
        padding-left: 50px !important;
      }
      .el-input--prefix .login-input-icon {
        height: 18px;
        width: 18px;
        margin-top: 7px;
        margin-left: 5px;
      }
    }
  }
  .title-container {
    .title {
      color: #393939;
      font-size: 30px;
      font-weight: 400;
      text-align: start;
    }
  }
  .link-herf {
    font-size: 13px;
    color: #fff;
    padding: 2px;
    margin-bottom: 15px;
    .register {
      float: right;
    }
  }
  .login-btn-content {
    width: 100%;
    margin-bottom: 20px;
    height: 60px;
    position: relative;
    .el-button {
      width: 100%;
      height: 40px;
      font-size: 15px;
      font-weight: bold;
      border-radius: 20px;
      background: linear-gradient(to right, #4bddff, #287cff);
      border: none;
      position: absolute;
      z-index: 2;
    }
    .el-button:after {
      content: " ";
      width: 94%;
      height: 40px;
      background: linear-gradient(to right, #4bddff, #287cff);
      font-weight: bold;
      position: absolute;
      left: 3.5%;
      top: 21px;
      border-radius: 20px;
      z-index: -1;
      mask: linear-gradient(0deg, transparent, #fff);
      filter: blur(20px);
    }
  }
  .form-title {
    display: flex;
    align-items: center;
    position: absolute;
    top: -84px;
    width: 528px;
    justify-content: center;
    left: 0;
    p {
      font-size: 30px;
      color: white;
      margin-left: 10px;
      font-style: oblique;
    }
    .logo-pic {
      width: 47px;
      height: 47px;
    }
  }
}
</style>
