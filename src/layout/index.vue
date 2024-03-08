<template>
  <div :class="classObj" class="app-wrapper">
    <div class="app-wrapper-header">
      <Navbar @menuNavClick="menuNavClick" />
    </div>
    <div class="app-wrapper-content">
      <component :is="pagekey" />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import homePage from "./homePage/index.vue"; // 首页
import resource from "./resourcesPage/index.vue"; // 资源
import operator from "./operatePage/index.vue"; // 运营
import monitor from "./monitorPage/index.vue"; // 监控
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    homePage,
    resource,
    operator,
    monitor,
  },
  data() {
    return {
      pagekey: "",
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
      };
    },
  },
  methods: {
    menuNavClick(key) {
      this.pagekey = key;
      localStorage.setItem("kcp-pagekey", this.pagekey);
      if (this.pagekey == "homePage") {
        let path = "/homePage";
        this.$router.push(path);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100vh;
  width: 100vw;

  min-height: 768px;
  min-width: 1280px;

  display: flex;
  flex-direction: column;
  .app-wrapper-header {
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    background: $headerBg;
  }
  .app-wrapper-content {
    width: 100%;
    flex: 1;
  }

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
</style>
