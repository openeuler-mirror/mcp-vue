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
      <div class="drawer-content">
        <div class="service-modify">
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
                  :rows="3"
                  placeholder=""
                  maxlength="500"
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
import {
  checkPassRegister,
  checkPassUpdateUser,
  checkPassDeferred
} from '@/api/workOrder'
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
      passFormData: {
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
    // 提交
    handlerConfirm() {
      this.$refs.passForm.validate((valid) => {
        if (valid) {
          this.sethandlerConfirm()
        } else {
          return false
        }
      })
    },
    sethandlerConfirm() {
      const workOrderId = this.selectRowData.workOrderId
      const auditOpinion = this.passFormData.auditOpinion
      const type = this.selectRowData.type

      if (type === 'REGISTER_USER') {
        checkPassRegister({ workOrderId, auditOpinion }).then((res) => {
          this.passSuccess()
        })
      } else if (type === 'MODIFY_USER') {
        checkPassUpdateUser({ workOrderId, auditOpinion }).then((res) => {
          this.passSuccess()
        })
      } else if (type === 'DEFERRED_SERVERVM') {
        checkPassDeferred({ workOrderId, auditOpinion }).then((res) => {
          this.passSuccess()
        })
      }
    },
    handlerCancel() {
      this.$refs.passForm.resetFields()
      this.$emit('update:visible', false)
    },
    handleClosePass(done) {
      this.handlerCancel()

      done()
    },
    passSuccess() {
      this.$parent.refreshTable()
      ReMessage.success(this.$t('common.reviewsucc'))
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
