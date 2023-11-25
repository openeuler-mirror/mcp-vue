<template>
  <div class="header-outbox">
    <div class="header-box">
      <div class="header-left">
        <!-- 上传镜像 -->
        <el-button
          v-if="otherBtnShow('public_image', 'public_image_upload')"
          @click="uploadImage"
        >
          {{ $t("imageMgr.uploadImage") }}
        </el-button>
        <!-- 删除 -->
        <el-button
          v-if="otherBtnShow('public_image', 'public_image_delete')"
          :disabled="deleteImageDis"
          @click="deleteImage"
          style="margin-left: 15px"
        >
          {{ $t("imageMgr.deleteImage") }}
        </el-button>
        <!-- 搜索 -->
        <searchInput style="margin-left: 15px" @change="searchInputChange" />
      </div>
      <div class="header-right">
        <utilsButton type="fresh" :spinBol="spinBol" @refresh="refresh" />
      </div>
    </div>
  </div>
</template>

<script>
import utilsButton from "@/components/utilsButton";
import searchInput from "@/components/SearchInput";
import { batchDeleteImage } from "@/api/imageApi";

export default {
  components: {
    searchInput,
    utilsButton,
  },
  props: {
    spinBol: {
      type: Boolean,
      default: false,
    },
    // 选中的数组
    selectData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      deleteImageDis: true,
    };
  },
  watch: {
    selectData: {
      handler: function (newV, oldV) {
        this.initDisabled(true);
        if (newV.length > 0) {
          this.setBtnsDis(newV);
        }
      },
      deep: true,
    },
  },
  created() {},
  methods: {
    initDisabled() {
      this.deleteImageDis = true;
    },
    setBtnsDis(list) {
      let deleteImageBtnDis = list.some(
        (item) => item.deleteImageDisabled == true
      );
      if (!deleteImageBtnDis) {
        this.deleteImageDis = false;
      }
    },
    uploadImage() {
      const routerUrl = this.$router.resolve({
        name: "imageupload",
        params: {
          type: "publicImage",
        },
      });
      window.open(routerUrl.href, "_blank");
    },
    deleteImage() {
      let ids = [];
      let list = this.selectData;
      list.forEach((element) => {
        let { imageId } = element;
        ids.push(imageId);
      });
      let params = {
        imageIds: ids.toString(),
      };
      let deleteConfirm = this.$t("imageMgr.deletebatchConfirm"); //  确定删除所选镜像?
      let deleteSuccess = this.$t("imageMgr.deleteSuccess"); // "删除镜像成功!"
      this.$confirm(deleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          batchDeleteImage(params)
            .then((res) => {
              this.alertTips(deleteSuccess, "success");
              this.$emit("refreshTable");
            })
            .catch((err) => {
              this.alertTips(err);
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
        });
    },
    // 搜索
    searchInputChange(val) {
      this.$parent.changeSearchKey(val);
      this.$emit("refreshTable");
    },
    // 刷新
    refresh() {
      this.$emit("refreshTable");
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
