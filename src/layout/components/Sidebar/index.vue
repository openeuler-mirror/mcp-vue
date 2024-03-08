<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.getRoutes();
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.routeKey) {
        return meta.routeKey;
      }
      return route.routeKey;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  data() {
    return {
      toRoute: [],
    };
  },
  methods: {
    setRoutes(datas, permissionsList) {
      //遍历树  获取id数组
      for (var i in datas) {
        // 遍历项目满足条件后的操作
        let routeKey = datas[i].routeKey;
        if (permissionsList.indexOf(routeKey) > -1) {
          if (datas[i].hidden) {
          } else {
            datas[i].hidden = false;
          }
        } else {
          datas[i].hidden = true;
        }

        if (datas[i].children) {
          //存在子节点就递归
          this.setRoutes(datas[i].children, permissionsList);
        } else {
          if (!datas[i].hidden && this.toRoute.length == 0) {
            this.toRoute.push(datas[i]);
          }
        }
      }
    },
    getRoutes() {
      let info = JSON.parse(localStorage.getItem("userInfo"));
      let permissions = info.permissions;
      let permissionsList = [];
      // let permissionsList = ["vMwareMgr"];
      permissions.forEach((element) => {
        let { routeKey } = element;
        permissionsList.push(routeKey);
      });

      let currpagekey = localStorage.getItem("kcp-pagekey");
      let routes = JSON.parse(JSON.stringify(this.$router.options.routes));
      let routeLsit = [];
      let currentRoutes = [];
      routes.forEach((element) => {
        let { pagekey } = element;
        if (pagekey == "") {
          routeLsit.push(element);
        }
        if (currpagekey == pagekey) {
          currentRoutes.push(element);
        }
      });
      this.setRoutes(currentRoutes, permissionsList);
      let routesNew = routeLsit.concat(currentRoutes);
      let currpagerouter = JSON.parse(localStorage.getItem("kcp-router"));
      if (
        currpagerouter &&
        currpagerouter.pagekey &&
        currpagerouter.pagekey == currpagekey
      ) {
        this.$router.push(currpagerouter.path);
      } else {
        this.$router.push(this.toRoute[0]);

        localStorage.setItem(
          "kcp-router",
          JSON.stringify({ pagekey: currpagekey, path: this.toRoute[0].path })
        );
      }
      this.toRoute = [];
      return routesNew;
    },
  },
};
</script>
