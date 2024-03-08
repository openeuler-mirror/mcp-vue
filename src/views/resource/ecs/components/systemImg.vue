<template>
  <div class="systemImg">
    <img v-if="imgSrc" :src="imgSrc" alt="" />
  </div>
</template>

<script>
import { downLoadServerVmLog } from "@/api/serverVm";
export default {
  name: "systemImg",
  props: {
    // 状态
    imgInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      imgSrc: "",
    };
  },
  created() {
    this.getimgSrc();
  },
  methods: {
    getimgSrc() {
      let imgObj = {
        mcServerVmLogoPath: this.imgInfo.logo || "",
        mcServerVmLogoName: this.imgInfo.logoName || "",
        serverVmUuid: this.imgInfo.serverVmUuid,
      };
      downLoadServerVmLog(imgObj).then((res) => {
        this.imgSrc = "data:image/png;base64," + res.body;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.systemImg {
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>