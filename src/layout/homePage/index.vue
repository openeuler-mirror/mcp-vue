<template>
  <div class="page-wrapper">
    <div class="page-wrapper-content">
      <!-- 管理员页面 -->
      <homePage v-if="uesrType == 'administrator'"></homePage>
      <!-- 普通用户页面 -->
      <ordinaryHomePage
        v-else-if="uesrType == 'generalUser'"
      ></ordinaryHomePage>
      <div v-else></div>
    </div>
  </div>
</template>

<script>
import homePage from "@/views/homePage";
import ordinaryHomePage from "@/views/homePage/ordinaryHome/index.vue";
export default {
  name: "",
  components: { homePage, ordinaryHomePage },
  computed: {},
  data() {
    return {
      uesrType: "",
    };
  },
  mounted() {
    
    let info = JSON.parse(localStorage.getItem("userInfo"));

    let key = info.topUser;
    switch (key) {
      case true:
        this.uesrType = "administrator";
        break;
      case false:
        this.uesrType = "generalUser";
        break;

      default:
        this.uesrType = "";
        break;
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
</style>
