<template>
  <div class="navbar">
    <!-- logo -->
    <div class="left-menu flex">
      <logo></logo>
      <menuNav
        ref="menuNav"
        v-if="hasUserInfo"
        @menuNavClick="menuNavClick"
      ></menuNav>
    </div>
    <div class="right-menu flex">
      <!-- 审批 -->

      <el-badge
        v-if="pushWorkorder"
        :value="workorderValue"
        :hidden="workorderBadgeHidden"
        class="menu-operate menu-ksvd-task"
      >
        <span
          class="el-icon-s-check"
          :title="$t('common.approved')"
          @click="toWorkorder"
        ></span>
      </el-badge>
      <!-- 告警 -->

      <el-badge
        v-if="pushAlarmLog"
        :value="alarmLogValue"
        :hidden="alarmLogBadgeHidden"
        class="menu-operate menu-ksvd-alarm"
      >
        <span
          class="el-icon-bell"
          :title="$t('common.alarm')"
          @click="toAlarmLog"
        ></span>
      </el-badge>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper flex justify-center align-center">
          <el-avatar
            v-if="userImg"
            class="user-avatar"
            :src="userImgSrc"
            icon="el-icon-user-solid"
            :size="30"
          />
          <el-avatar v-else class="name-avatar" :size="30">
            {{ firstRealName }}
          </el-avatar>
          <span class="name-lable">{{ loginUserInfo.realName }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="changeTheme">
            <!-- 切换皮肤 -->
            {{ $t("common.changeTheme") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="changeLangEvent">
            <!-- 切换语言 -->
            {{ $t("common.changeLangEvent") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="changePassword">
            <!-- 修改密码 -->
            {{ $t("common.changePassword") }}
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            {{ $t("common.cancellation") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--修改密码 changePassword  -->
    <changePassword :visible.sync="showChangePassword"></changePassword>
    <!--修改密码 end  -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { getInfo } from "@/api/user";
import { alarmNotifications, getWaitCheckCount } from "@/api/login";

import changePassword from "./changePassword.vue";
import logo from "./Sidebar/Logo.vue";
import menuNav from "./menuNav.vue";
import bus from "@/utils/eventBus";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    changePassword,
    logo,
    menuNav,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  props: {
    userImg: {
      type: Boolean,
      default: false,
    },
    userImgSrc: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loginUserInfo: {},
      firstRealName: "",
      showChangePassword: false,
      lang: "",
      theme: "",
      hasUserInfo: false,
      workorderValue: 0,
      workorderBadgeHidden: false,
      alarmLogValue: 0,
      alarmLogBadgeHidden: false,
      pushWorkorder: false,
      pushAlarmLog: false,
    };
  },
  created() {
    this.lang = localStorage.getItem("kcp-lang") || "zh";
    this.theme = localStorage.getItem("kcp-theme") || "light";
    window.document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("kcp-theme", this.theme);

    // 获取用户信息
    this.getUserInfo();
  },
  mounted() {},
  methods: {
    setPushDom() {
      this.pushWorkorder = this.otherBtnShow("workorder", "check_workorder");
      this.pushAlarmLog = this.otherBtnShow("alarmEvent", "alarmLog");
      // 获取推送信息;
      this.getPushInfo();
      const timeCount = 5 * 60000;
      const timer = setInterval(() => {
        // 某些定时器操作
        this.getPushInfo();
      }, timeCount);
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      this.$once("hook:beforeDestroy", () => {
        clearInterval(timer);
      });
    },
    getPushInfo() {
      if (this.pushWorkorder) {
        // 获取待审核工单数量

        let headers = { TIME_REFRESH: "TIME_REFRESH" };
        getWaitCheckCount({}, headers)
          .then((res) => {
            let { waitCheckCount } = res;
            this.workorderValue = waitCheckCount;
            if (this.workorderValue > 0) {
              this.workorderBadgeHidden = false;
            } else {
              this.workorderBadgeHidden = true;
            }
          })
          .catch((err) => {});
      }
      if (this.pushAlarmLog) {
        // 获取告警数量
        let headers = { TIME_REFRESH: "TIME_REFRESH" };
        alarmNotifications({}, headers)
          .then((res) => {
            let { notificationsCount } = res;
            this.alarmLogValue = notificationsCount;
            if (this.alarmLogValue > 0) {
              this.alarmLogBadgeHidden = false;
            } else {
              this.alarmLogBadgeHidden = true;
            }
          })
          .catch((err) => {});
      }
    },
    // 工单审核页面
    toWorkorder() {
      this.$refs.menuNav.handleSelect("operator");
      this.$nextTick(() => {
        this.$router.push({ name: "workorder", params: {} });
        this.workorderBadgeHidden = true;
        this.workorderValue = 0;
      });
    },
    // 告警页面
    toAlarmLog() {
      this.$refs.menuNav.handleSelect("monitor");
      this.$nextTick(() => {
        this.$router.push({ name: "alarmLog", params: {} });
        this.alarmLogBadgeHidden = true;
        this.alarmLogValue = 0;
      });
    },
    setLang(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("kcp-lang", lang);
    },
    getUserInfo() {
      // 获取用户信息
      getInfo()
        .then((data) => {
          this.loginUserInfo =
            data.kcpRole === "slave" ? this.getSlaveData(data) : data;
          localStorage.setItem("userInfo", JSON.stringify(this.loginUserInfo));
          this.hasUserInfo = true;
          let realName = data.realName || data.userName;
          this.firstRealName = realName.substring(0, 1);

          this.setPushDom();
        })
        .catch((err) => {
          this.$store.dispatch("user/logout");
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          localStorage.removeItem("userInfo");
        });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    getSlaveData(data) {
      const { permissions } = data;
      const newSlavePermission = [];
      permissions.forEach((e) => {
        if (e.routeKey === "reliableCenter" || e.routeKey === "kcpha") {
          newSlavePermission.push(e);
        }
      });
      data.permissions = newSlavePermission;
      return data;
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
      localStorage.removeItem("kcp-pagekey");
      localStorage.removeItem("kcp-router");
      localStorage.removeItem("userInfo");
    },
    changePassword() {
      this.showChangePassword = true;
    },
    menuNavClick(key) {
      this.$emit("menuNavClick", key);
      // 获取推送信息;
      // this.getPushInfo();
    },
    changeLangEvent() {
      this.$confirm(this.$t("common.changeLangok"), this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          if (this.lang === "zh") {
            this.lang = "en";
            this.setLang(this.lang);
          } else {
            this.lang = "zh";
            this.setLang(this.lang);
          }
          location.reload();
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
        });
    },
    // 换肤
    changeTheme() {
      this.theme = this.theme == "light" ? "dark" : "light";
      window.document.documentElement.setAttribute("data-theme", this.theme);
      localStorage.setItem("kcp-theme", this.theme);
    },
  },
  beforeDestroy() {
    this.lang = "";
  },
};
</script>

<style lang="scss">
// 退出下拉面板边框颜色
.el-popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #b5b4b4;
}
.menu-operate {
  .el-badge__content {
    background-color: #f56c6c !important;
    border: 1px solid #f56c6c !important;
  }
  .el-badge__content.is-fixed {
    right: 20px;
  }
}
</style>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 50px;
  // overflow: hidden;
  position: relative;

  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .left-menu {
    display: flex;
    flex-grow: 1;
    align-items: center;
  }
  .right-menu {
    height: 100%;
    line-height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .menu-operate {
      margin-right: 8px;
      width: 30px;
      height: 30px;
      align-items: center;
      justify-content: center;
      display: flex;
      position: relative;

      span {
        font-size: 20px;
        color: #fff;
        cursor: pointer;
      }
      span:hover {
        color: #409eff;
      }
    }

    .avatar-container {
      margin-right: 36px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        span {
          margin: 0px 3px;
        }
        .name-avatar {
          font-size: 12px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }
        .name-avatar {
          background: $name_avatarBg;
        }
        .el-icon-arrow-down {
          cursor: pointer;
          margin: 0 5px;
        }
      }
    }
  }
  .name-lable {
    color: $headerColor;
  }
}
.el-dropdown-menu {
  min-width: 100px;
  border-radius: 0 !important;
  box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
  .el-dropdown-menu__item {
    text-align: center;
  }
}
.user-dropdown {
  top: 42px !important;
}
</style>
