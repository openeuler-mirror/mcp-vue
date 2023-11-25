<template>
  <div class="page-wrapper">
    <div class="page-wrapper-left">
      <div class="page-wrapper-icon">
        <!-- <div class="org-icon">
          <img src="~@/assets/hnkylin/kylin-logo.png" />
        </div> -->
        <div class="org-text">{{ orgText }}</div>
      </div>
      <Sidebar class="sidebar-container"></Sidebar>
    </div>
    <div class="page-wrapper-right">
      <div class="page-wrapper-content"><AppMain></AppMain></div>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain } from "../components";
export default {
  name: "",
  components: { Sidebar, AppMain },
  data() {
    return {
      orgText: "",
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
  },
  mounted() {
    let info = JSON.parse(localStorage.getItem("userInfo"));
    let { topUser, realName, organizationName } = info;
    if (topUser) {
      this.orgText = realName;
    } else {
      this.orgText = organizationName;
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  height: 100%;
  display: flex;

  .page-wrapper-left {
    width: $sideBarWidth;
    height: 100%;
    display: flex;
    flex-direction: column;
    .sidebar-container {
      border-top: 1px solid #c0c4cc;
    }
    .page-wrapper-icon {
      width: 100%;
      height: 60px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 20px;
      .org-icon {
        width: 36px;
        height: 36px;
        margin-right: 10px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .org-text {
        font-size: 18px;
      }
    }
    .page-wrapper-content {
      flex: 1;
    }
  }
  .page-wrapper-right {
    flex: 1;
    border-radius: 5px;
    margin: 15px;
    position: relative;

    .page-wrapper-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
