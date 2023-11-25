<template>
  <div class="login-container">
    <div class="login-top-container">
     
      <div class="wrapper">
        <div class="login-intro login-intro-bac">
          <p class="sys-title">KCP云管理平台</p>
          <p class="intro-content">KCP云管理平台针对私有云环境的云基础设施等资源管理，提供“云管理+云服务+云运营”三位一体的私有云管理服务。以统一化的服务交付，精细化和可视化的成本运营分析，帮助企业从传统环境平滑迁移到多云环境，保持企业云架构系统的持续优化</p>
          <!-- <div class="login-intro-bac">
            <div class="intro-content">
              <img src="../../assets/hnkylin/icon1.png" alt srcset>
              <p class="intro-p white-p">{{ tip1 }}</p>
            </div>
            <div class="intro-content">
              <img src="../../assets/hnkylin/icon2.png" alt srcset>
              <p class="intro-p white-p">{{ tip2 }}</p>
            </div>
          </div> -->
        </div>
        <loginForm />
      </div>
    </div>
    <div class="copyright center">
      版权所有 © 2006-2022 湖南麒麟. 保留所有权利。
    </div>
  </div>
</template>

<script>
import loginForm from './components/login-form'

export default {
  name: 'Login',
  components: {
    loginForm
  },
  data() {
    return {
      loading: false,
      tip1: '',
      tip2: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
/* reset element-ui css */
.login-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .login-top-container {
    background: #172238;
    position: relative;
    height: calc(100vh - 30px);
    .wrapper {
      max-width: 90%;
      height: 100%;
      margin: 0px auto;
      background: $loginBg  url('~@/assets/hnkylin/bigbg.png') no-repeat fixed;
      background-size: cover;
      .main {
        display: flex;
        margin: 68px auto;
        overflow: hidden;
      }
    }
  }
  .copyright {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    line-height: 30px;
    color: #9c9c9c;
  }
  .white-p {
    color: #e9eaee;
  }
  .login-intro {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 20%;
    .login-top-intro {
      font-weight: 400;
      font-size: 28px;
      margin-bottom: 33px;
    }
  }
  .login-intro-bac {
    width: 590px;
    height: 315px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 10px 20px;
    color:#fff;
    padding-right: 72px;
    box-sizing: content-box;
    .intro-content {
      font-size: 16px;
      text-indent:2em;
      line-height: 58px;
    }
    .sys-title{
      font-size: 32px;
      font-weight: 500;
      margin: 20px 0;
    }
  }
 
}
</style>
