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
          <el-form-item
            :label="$t('authorityMgr.organizationName')"
            prop="organizationName"
          >
            <el-input
              v-model="createDataFormData.organizationName"
              :placeholder="$t('authorityMgr.organizationNameplc')"
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('authorityMgr.roleNametooltip')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
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
import validate from "@/utils/validate";
import { modifyTopOrgName } from "@/api/organization";
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
        organizationName: "", // 组织名称
      },
      createDataFormData: {},

      rulesTemplate: {
        organizationName: [
          {
            required: true,
            message: this.$t("authorityMgr.organizationNameNotNull"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 18,
            message: this.$t("authorityMgr.roleNameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("authorityMgr.roleNametooltip"),
            validator: validate.validateCharZhEnNum,
          },
        ],
      },
    };
  },
  watch: {},
  created() {
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { editflag, formData } = this.formOptions;
    if (editflag) {
      // 编辑
      this.oriEditFormData = JSON.parse(JSON.stringify(this.formOptions));
      this.createDataFormData.orgId = formData.organizationId;
      this.createDataFormData.organizationName = formData.organizationName;
    } else {
    }
  },
  computed: {},
  methods: {
    // 提交
    handlerConfirm() {
      let { editflag } = this.formOptions;

      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          if (editflag) {
            // 编辑组织信息
            this.commitEdit();
          } else {
          }
        } else {
          return false;
        }
      });
    },
    commitEdit() {
      let editOrgData = {
        orgId: this.createDataFormData.orgId,
        organizationName: this.createDataFormData.organizationName, // 组织名称
      };
      let successMsg = this.$t("authorityMgr.editOrgNamesuccessMsg"); // "修改组织名称成功";
      modifyTopOrgName(editOrgData)
        .then((res) => {
          this.alertTips(successMsg, "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
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
