<template>
  <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
    <!-- 面包屑导航 -->
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >
          {{ item.meta.title }}
        </span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from "path-to-regexp";

export default {
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      /**
       * 面包屑导航显示条件
       * 1. meta 属性要存在
       * 2. meta 中的title 要存在
       * 3. meta 中的breadcrumb != false ，默认为true
       * 4. 侧边栏会读取 children 第一项作为内容，所以设置 children 第一项中meta 为true
       */
      this.levelList = this.$route.matched.filter(
        (item) =>
          item.meta &&
          item.meta.title &&
          item.meta.breadcrumb !== false &&
          !item.meta.default
      );
    },
    pathCompile(path) {
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.$route.path);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 30px;
  margin-bottom: 15px;

  .no-redirect {
    cursor: text;
  }
}
</style>
