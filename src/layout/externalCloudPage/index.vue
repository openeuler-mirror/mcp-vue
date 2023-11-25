<template>
  <div class="page-wrapper">
    <div class="page-wrapper-left">
      <Sidebar class="sidebar-container"></Sidebar>
    </div>
    <div class="page-wrapper-right">
      <div class="page-wrapper-content">
        <AppMain></AppMain>
      </div>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain } from "../components";
export default {
  name: "",
  components: { Sidebar, AppMain },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
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
