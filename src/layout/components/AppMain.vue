<template>
  <section class="app-main">
    <Breadcrumb></Breadcrumb>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
export default {
  name: "AppMain",
  components: { Breadcrumb },
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;

  box-sizing: border-box;

  display: flex;
  flex-direction: column;
}
</style>
