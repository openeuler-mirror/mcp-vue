<template>
  <!-- 审核拒绝 -->
  <el-drawer
    size="900px"
    :title="$t('workOrder.reviewRejection')"
    direction="rtl"
    custom-class="workorder-refuse-drawer"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleCloseRefuse"
  >
    <template>
      <div class="drawer-content">
        <div class="drawer-body-content">
          <div class="template-box">
            <el-form
              ref="refuseForm"
              label-width="auto"
              :model="refuseFormData"
              :rules="rulesTemplate"
            >
              <!-- 拒绝意见 -->
              <el-form-item
                :label="$t('workOrder.rejectOpinion')"
                prop="auditOpinion"
              >
                <el-input
                  v-model="refuseFormData.auditOpinion"
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
      </div>
    </template>
  </el-drawer>
</template>

<script>
import footBtn from "@/components/Footbtn";
import { refuseWorkOrder } from "@/api/workOrder";
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
      refuseFormData: {
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
    // 提交申请
    handlerConfirm() {
      this.$refs.refuseForm.validate((valid) => {
        if (valid) {
          let workOrderId = this.selectRowData.workOrderId;
          let auditOpinion = this.refuseFormData.auditOpinion;

          refuseWorkOrder({ workOrderId, auditOpinion }).then((res) => {
            this.refuseSuccess();
          });
        } else {
          return false;
        }
      });
    },
    handlerCancel() {
      this.$refs.refuseForm.resetFields();
      this.$emit("update:visible", false);
    },
    handleCloseRefuse(done) {
      this.handlerCancel();
      done();
    },
    refuseSuccess() {
      this.$parent.refreshTable();
      ReMessage.success(this.$t("common.refusesucc"));
      this.handlerCancel();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
</style>
