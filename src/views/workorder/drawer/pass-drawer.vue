<template>
  <el-drawer
    size="900px"
    :title="$t('workOrder.workorderpass')"
    direction="rtl"
    custom-class="workorder-pass-drawer"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleClosePass"
  >
    <template>
      <div class="drawer-body-content">
        <div class="template-box">
          <el-form
            ref="passForm"
            label-width="auto"
            :model="passFormData"
            :rules="rulesTemplate"
          >
            <el-form-item
              :label="$t('workOrder.reviewComments')"
              prop="auditOpinion"
            >
              <el-input
                v-model="passFormData.auditOpinion"
                type="textarea"
                placeholder=""
                maxlength="400"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <foot-btn
        class="drawer-foot"
        @confirm="handlerConfirm"
        @cancel="handlerCancel"
      />
    </template>
  </el-drawer>
</template>

<script>
import footBtn from "@/components/Footbtn";
import {
  checkPassRegister,
  checkPassUpdateUser,
  checkPassDeferred,
} from "@/api/workOrder";
import ReMessage from "@/utils/message";
import validate from "@/utils/validate";
export default {
  components: {
    footBtn,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectRowData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      passFormData: {
        auditOpinion: "",
      },
      rulesTemplate: {
        auditOpinion: [
          {
            required: true,
            message: this.$t("workOrder.commentsNotempty"), // "审核意见不能为空",
            trigger: "blur",
          },
          {
            required: true,
            trigger: "blur",
            message: this.$t("workOrder.commentsspecialChar"), // "审核意见不能出现特殊字符",

            validator: validate.special_char,
          },
        ],
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
    },
    selectRowData(selectRow) {},
  },
  methods: {
    // 提交
    handlerConfirm() {
      this.$refs.passForm.validate((valid) => {
        if (valid) {
          this.sethandlerConfirm();
        } else {
          return false;
        }
      });
    },
    sethandlerConfirm() {
      let workOrderId = this.selectRowData.workOrderId;
      let auditOpinion = this.passFormData.auditOpinion;
      let type = this.selectRowData.type;

      if (type === "REGISTER_USER") {
        checkPassRegister({ workOrderId, auditOpinion }).then((res) => {
          this.passSuccess();
        });
      } else if (type === "MODIFY_USER") {
        checkPassUpdateUser({ workOrderId, auditOpinion }).then((res) => {
          this.passSuccess();
        });
      } else if (type === "DEFERRED_SERVERVM") {
        checkPassDeferred({ workOrderId, auditOpinion }).then((res) => {
          this.passSuccess();
        });
      }
    },
    handlerCancel() {
      this.$refs.passForm.resetFields();
      this.$emit("update:visible", false);
    },
    handleClosePass(done) {
      this.handlerCancel();

      done();
    },
    passSuccess() {
      this.$parent.refreshTable();
      ReMessage.success(this.$t("common.reviewsucc"));
      this.handlerCancel();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
