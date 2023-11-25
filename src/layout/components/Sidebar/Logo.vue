<template>
  <div class="sidebar-logo-container">
    <div class="sidebar-logo-link">
      <img src="~@/assets/hnkylin/kylin-logo.png" class="sidebar-logo" />
      <h1 class="sidebar-title">{{ title }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      title: "KCP云管理平台",
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 0.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 230px;
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  padding: 0 10px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 50px;
      height: 50px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: $headerColor;
      font-weight: 600;
      line-height: 50px;
      font-size: 20px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
