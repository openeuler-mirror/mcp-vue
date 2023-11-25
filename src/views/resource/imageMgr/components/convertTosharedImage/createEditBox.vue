<template>
  <div class="drawer-content">
    <div class="drawer-body-content">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 镜像名称 -->
          <el-form-item :label="$t('imageMgr.imageName')" prop="imageName">
            <el-input
              v-model="createDataFormData.imageName"
              :placeholder="$t('imageMgr.imageNameplac')"
            />
          </el-form-item>
          <!-- 描述 -->
          <el-form-item :label="$t('imageMgr.imageRemark')" prop="imageRemark">
            <el-input
              type="textarea"
              :placeholder="$t('imageMgr.imageRemarkplac')"
              maxlength="400"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.imageRemark"
            />
          </el-form-item>
          <!-- 组织 -->
          <el-form-item :label="$t('imageMgr.orgName')" prop="orgId">
            <TreeSelect
              v-model="createDataFormData.orgId"
              :data="treeList"
              :placeholder="$t('imageMgr.orgNameplac')"
            ></TreeSelect>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import footBtn from "@/components/Footbtn";
import { changeToShare } from "@/api/imageApi";
import { queryParentOrg, canSelectOrg } from "@/api/organization";
import TreeSelect from "@/components/TreeSelect";
export default {
  components: {
    footBtn,
    TreeSelect,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      oriFormData: {
        imageId: "",
        imageName: "", // 镜像名称
        imageRemark: "", // 镜像描述
        orgId: "", // 组织id
      },
      createDataFormData: {},

      rulesTemplate: {
        imageName: [
          {
            required: true,
            message: this.$t("imageMgr.imageNameplac"), // "请输入镜像名称",
            trigger: "blur",
          },
        ],
        orgId: [
          {
            required: true,
            message: this.$t("imageMgr.orgNameplac"), // "请选择组织",
            trigger: "blur",
          },
        ],
      },
      treeList: [],
    };
  },
  watch: {},
  created() {},
  computed: {},
  mounted() {
    this.getParentOrg();
    this.setPageData();
  },
  methods: {
    getParentOrg() {
      let info = JSON.parse(localStorage.getItem("userInfo"));
      canSelectOrg({ imageId: this.formOptions.formData.imageId })
        .then((res) => {
          this.treeList = this.gettreeList(
            res,
            "organizationId",
            "organizationName"
          );
        })
        .catch((err) => {
          this.treeList = [];
          this.alertTips(err);
        });
    },
    gettreeList(dataList, id, label) {
      let data = dataList;

      var fn = function (data) {
        if (Array.isArray(data)) {
          // 判断是否是数组并且没有的情况
          data.forEach((item) => {
            item.id = item[id];
            item.label = item[label];
            fn(item.children);
          });
        }
      };
      fn(data); // 调用一下
      return data;
    },
    setPageData() {
      this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
      let { formData } = this.formOptions;
      this.createDataFormData = {
        imageId: formData.imageId,
        imageName: formData.imageName, // 镜像名称
        imageRemark: formData.imageRemark, // 镜像描述
        visibleType: formData.visibleType,
        orgId: "",
      };
    },

    // 提交
    handlerConfirm() {
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          // 编辑信息
          this.commitEdit();
        } else {
          return false;
        }
      });
    },

    commitEdit() {
      let editData = {
        imageId: this.createDataFormData.imageId, // 镜像id
        imageName: this.createDataFormData.imageName, // 镜像名称
        imageRemark: this.createDataFormData.imageRemark, // 镜像描述
        orgId: this.createDataFormData.orgId, // 组织id
      };
      changeToShare(editData)
        .then((res) => {
          this.alertTips("操作成功", "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$parent.closeDrawer();
        });
    },

    handlerCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.drawer-body-content {
  @include formStyle;
}
</style>
