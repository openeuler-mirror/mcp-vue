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
        <div class="service-modify">
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
                  :rows="3"
                  placeholder=""
                  maxlength="50"
                  show-word-limit
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
import footBtn from '@/components/Footbtn'
import { refuseWorkOrder } from '@/api/workOrder'
import ReMessage from '@/utils/message'
import validate from '@/utils/validate'
export default {
  components: {
    footBtn
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRowData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      drawerVisible: this.visible,
      refuseFormData: {
        auditOpinion: ''
      },
      rulesTemplate: {
        auditOpinion: [
          {
            required: true,
            message: this.$t('workOrder.commentsNotempty'), // "审核意见不能为空",
            trigger: 'blur'
          },
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.commentsspecialChar'), // "审核意见不能出现特殊字符",

            validator: validate.special_char
          }
        ]
      }
    }
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis
    },
    selectRowData(selectRow) {}
  },
  methods: {
    // 提交申请
    handlerConfirm() {
      this.$refs.refuseForm.validate((valid) => {
        if (valid) {
          const workOrderId = this.selectRowData.workOrderId
          const auditOpinion = this.refuseFormData.auditOpinion

          refuseWorkOrder({ workOrderId, auditOpinion }).then((res) => {
            this.refuseSuccess()
          })
        } else {
          return false
        }
      })
    },
    handlerCancel() {
      this.$refs.refuseForm.resetFields()
      this.$emit('update:visible', false)
    },
    handleCloseRefuse(done) {
      this.handlerCancel()
      done()
    },
    refuseSuccess() {
      this.$parent.refreshTable()
      ReMessage.success(this.$t('common.refusesucc'))
      this.handlerCancel()
    }
  }
}
</script>

<style lang="scss" scope >
@import "~@/styles/mixin.scss";
@include DrawerRtl;
.service-modify {
  display: flex;
  flex-direction: column;
  flex: 1;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-height: 82vh;
  padding: 0 50px;
}
</style>
