<template>
  <div class="menuNav-home">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="(item, index) in menuList"
        :key="'menuNav' + index"
        :index="item.key"
        >{{ item.label }}</el-menu-item
      >
    </el-menu>
  </div>
</template>

<script>
import dealtree from "@/utils/dealtree";
import bus from "@/utils/eventBus";
export default {
  data() {
    return {
      activeIndex: "homePage",
      orimenuList: [
        {
          key: "homePage",
          label: this.$t("common.route.homePage"), // "首页"
        },
        {
          key: "resource",
          label: this.$t("common.route.resource"), // "资源"
        },
        {
          key: "reliableCenter",
          label: this.$t("common.route.reliableCenter"), // "可靠中心"
        },
        {
          key: "operator",
          label: this.$t("common.route.operator"), // "运营"
        },
        {
          key: "monitor",
          label: this.$t("common.route.monitor"), // "监控"
        },
        {
          key: "externalCloud",
          label: this.$t("common.route.externalCloud"), // "外部云"
        },
      ],
      menuList: [],
      menuKeyList: [],
    };
  },
  watch: {
    $route: {
      handler: function (to, oldVal) {
        // 增加监控原因：架构中layout依赖pagekey
        // 但是当页面跳转没有设置pagekey的时候会出现侧边栏nav不跟着变化的问题
        if (to.meta.pagekey) {
          const newIndex = localStorage.getItem("kcp-pagekey");
          newIndex === this.activeIndex ? "" : (this.activeIndex = newIndex);
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  mounted() {
    let info = JSON.parse(localStorage.getItem("userInfo"));
    const kcpRole = info.kcpRole;
    kcpRole === "master"
      ? ""
      : (this.orimenuList = [
          {
            key: "reliableCenter",
            label: this.$t("common.route.reliableCenter"), // "可靠中心"
          },
        ]);
    this.getmenuList();
    let that = this;
    bus.$on("changeMenuNav", function (val) {
      that.handleSelect(val);
    });
  },
  methods: {
    getmenuList() {
      let info = JSON.parse(localStorage.getItem("userInfo"));
      let permissions = info.permissions;
      let menuTree = dealtree.listToTree(
        "permissionId",
        "parentId",
        permissions
      );
      menuTree.forEach((element) => {
        let { routeKey } = element;
        this.menuKeyList.push(routeKey);
      });
      this.menuList = [];
      const kcpRole = info.kcpRole;
      kcpRole === "master"
        ? (this.menuList = [
            {
              key: "homePage",
              label: this.$t("common.route.homePage"), // "首页"
            },
          ])
        : "";

      this.orimenuList.forEach((element) => {
        let { key } = element;
        if (this.menuKeyList.indexOf(key) > -1) {
          this.menuList.push(element);
        }
      });

      this.activeIndex =
        localStorage.getItem("kcp-pagekey") || this.menuList[0].key;
      this.$emit("menuNavClick", this.activeIndex);
    },
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      this.$emit("menuNavClick", key);
    },
  },
};
</script>

<style lang="scss" scoped>
.menuNav-home {
  margin: 0 25px;
  .el-menu,
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    background: transparent;
  }
  .el-menu--horizontal > .el-menu-item {
    color: #ffffff;
    height: 70px;
    line-height: 70px;
    font-size: 18px;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 3px solid #409eff;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: 0px;
  }
}
</style>
