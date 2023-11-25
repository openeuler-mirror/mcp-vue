<template>
  <div :class="classObj" class="app-wrapper drag">
    <div class="app-wrapper-header">
      <Navbar @menuNavClick="menuNavClick" />
    </div>
    <div class="app-wrapper-content">
      <component :is="pagekey" />
    </div>
    <!-- 任务中心 -->
    <div class="drag-box" v-drag draggable="false">
      <div id="dragbtn" class="taskbox" @click.stop="openTaskcenter">
        <div class="taskboxMain">
          <div class="taskboxMain-icon el-icon-time"></div>
          <div>{{ $t("taskcenter.task") }}</div>
        </div>
      </div>
    </div>
    <taskcenterModal
      :options="taskcenterModalOption"
      :visible.sync="showtaskcenterModal"
    ></taskcenterModal>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import homePage from "./homePage/index.vue"; // 首页
import resource from "./resourcesPage/index.vue"; // 资源
import reliableCenter from "./reliableCenter/index.vue"; // 资源
import operator from "./operatePage/index.vue"; // 运营
import monitor from "./monitorPage/index.vue"; // 监控
import externalCloud from "./externalCloudPage/index.vue"; // 监控
import taskcenterModal from "@/views/monitor/taskcenter/taskcenterModal/taskcenterModal.vue"; // 监控

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
    externalCloud,
    taskcenterModal,
    reliableCenter,
  },
  data() {
    return {
      pagekey: "",
      showtaskcenterModal: false,
      taskcenterModalOption: {
        title: "",
        formData: "", // 表单数据
      },
    };
  },
  directives: {
    drag(el) {
      let oDiv = el; //当前元素 //禁止选择网页上的文字
      // document.onselectstart = function () {
      //   return false;
      // };
      oDiv.onmousedown = function (e) {
        let firstTime = "";
        let lastTime = "";
        //鼠标按下，计算当前元素距离可视区的距离
        document.getElementById("dragbtn").setAttribute("data-flag", false);
        firstTime = new Date().getTime();
        let disX = e.clientX - oDiv.offsetLeft;
        let disY = e.clientY - oDiv.offsetTop;
        document.onmousemove = function (e) {
          //计算移动的距离
          let l = e.clientX - disX;
          let t = e.clientY - disY;
          //移动当前元素
          oDiv.style.left = l + "px";
          oDiv.style.top = t + "px";
        };
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
          lastTime = new Date().getTime();
          let difference = lastTime - firstTime;
          if (difference > 200) {
            document.getElementById("dragbtn").setAttribute("data-flag", true);
          }
        };
        //防止onmouseup失效
        return false;
      };
    },
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
  watch: {
    $route: {
      handler: function (to, oldVal) {
        // 增加监控原因：架构中layout依赖pagekey
        // 但是当页面跳转没有设置pagekey的时候会出现侧边栏nav不跟着变化的问题
        if (to.meta.pagekey) {
          this.pagekey = to.meta.pagekey;
          localStorage.setItem("kcp-pagekey", this.pagekey);
        }
      },
      // 深度观察监听
      deep: true,
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
    openTaskcenter() {
      let isClick = document
        .getElementById("dragbtn")
        .getAttribute("data-flag");
      if (isClick !== "false") {
        return false;
      }
      this.taskcenterModalOption = {
        title: this.$t("taskcenter.checkTheDetails"), // "查看详情",
        formData: {}, // 表单数据
      };
      this.showtaskcenterModal = true;
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

  .taskbox {
    // position: fixed;

    width: 80px;
    height: 40px;
    border-radius: 20px;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0px 3px 8px rgb(0 0 0 / 10%);
  }
  .taskbox,
  .taskboxMain {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #409eff;
    font-size: 16px;
    .taskboxMain-icon {
      margin-right: 5px;
      font-weight: bold;
    }
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

.drag {
  position: relative;
}
.drag-box {
  position: absolute;
  right: 5px;
  bottom: 350px;
  z-index: 3000;
  cursor: pointer;
}
</style>
