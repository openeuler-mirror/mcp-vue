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
          <!-- 可用区 -->
          <el-form-item :label="$t('imageMgr.zoneName')" prop="zoneIds">
            <el-select
              v-model="createDataFormData.zoneIds"
              multiple
              :placeholder="$t('imageMgr.zoneNameplac')"
            >
              <el-option
                v-for="(item, index) in zoneList"
                :key="'type' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
import { zoneList } from "@/api/vdcapi";
import { modifyImage } from "@/api/imageApi";
export default {
  components: {
    footBtn,
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
        zoneIds: [], // 可用区id
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
        zoneIds: [
          {
            required: true,
            message: this.$t("imageMgr.zoneNameplac"), // "请选择可用区",
            trigger: "blur",
          },
        ],
      },

      zoneList: [],
    };
  },
  watch: {},
  created() {
    this.getzoneList();
  },
  computed: {},
  mounted() {
    this.setPageData();
  },
  methods: {
    setPageData() {
      this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));

      let { formData } = this.formOptions;
      this.createDataFormData = {
        imageId: formData.imageId,
        imageName: formData.imageName, // 镜像名称
        imageRemark: formData.imageRemark, // 镜像描述
        visibleType: formData.visibleType,
        zoneIds: formData.zoneIdList, // 可用区id
      };
    },
    getzoneList() {
      let list = [];
      zoneList()
        .then((res) => {
          res.forEach((element) => {
            list.push({
              value: element.zoneId,
              label: element.name,
            });
          });
          this.zoneList = list;
        })
        .catch((err) => {
          this.alertTips(err);
        });
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
        zoneIds: this.createDataFormData.zoneIds.toString(), // 镜像可用区
        visibleType: this.createDataFormData.visibleType,
      };
      let editImageSuccess = this.$t("imageMgr.editImageSuccess"); // 编辑镜像成功!
      modifyImage(editData)
        .then((res) => {
          this.alertTips(editImageSuccess, "success");
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
