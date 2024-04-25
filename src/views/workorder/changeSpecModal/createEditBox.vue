<template>
  <div class="drawer-content changeSpecModal">
    <!-- 分配资源 -->
    <div class="create-new-formtable">
      <!-- 一级vdc -->
      <firstVdcresource
        v-if="showfirstVdc"
        ref="firstVdcresource"
        :form-options="firstVdcFormData"
      />
      <!-- 非一级vdc -->
      <vdcresource
        v-else
        ref="vdcresource"
        :form-options="vdcFormData"
      />

      <div class="template-box">
        <el-form
          ref="refuseForm"
          label-width="80px"
          :model="refuseFormData"
          :rules="rulesTemplate"
        >
          <!-- 原因 -->
          <el-form-item
            :label="$t('resourceMgr.vdcauditOpinion')"
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

    <div class="drawer-foot footBtn">
      <el-button type="primary" @click="handleConfirm()">
        <!-- 确认 -->
        {{ $t("common.confirmation") }}
      </el-button>

      <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
    </div>
  </div>
</template>
<script>
import validate from '@/utils/validate'
import firstVdcresource from '@/views/components/vdcResourceAss/firstVdcresource.vue' // 一级VDC
import vdcresource from '@/views/components/vdcResourceAss/vdcresource.vue' // 非一级VDC
import { passModifyVdc } from '@/api/workOrder'
export default {
  components: { firstVdcresource, vdcresource },
  props: {
    formOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 一级Vdc
      firstVdcFormData: {},
      // 非一级VDC
      vdcFormData: {},
      showfirstVdc: false,
      refuseFormData: {
        auditOpinion: ''
      },
      rulesTemplate: {
        auditOpinion: [
          {
            required: true,
            message: this.$t('resourceMgr.vdcauditOpinionEmpt'), // "变更原因不能为空",
            trigger: 'blur'
          },
          {
            required: true,
            trigger: 'blur',
            message: this.$t('resourceMgr.vdcauditOpinionspecialChar'), // "变更原因只能由中文、英文、数字组合",
            validator: validate.special_char
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.setshowfirstVdc()
  },
  mounted() {},
  methods: {
    tovdcResource(formData) {
      const architectureList = formData.applyArchitectureResourceList
      const vdcResource = {
        totalStorage: '',
        usableStorage: '',
        currentStorage: '',
        usedStorage: '',
        storageUnit: '',
        architectureResourceList: []
      }
      const list = []
      architectureList.forEach((element) => {
        // currentVcpu	// 当前cpu
        // usedCpu	// 已使用cpu
        // parentUsableCpu	// 上级剩余CPU
        // currentMem	// 当前内存
        // usedMem	// 已使用内存
        // parentUsableMem	// 上级剩余内存
        // memUnit	// 内存单位
        // architectureType	// 架构
        list.push({
          usableVcpu: element.parentUsableCpu,
          currentVcpu: element.currentVcpu,
          applyCpu: element.applyCpu,
          usedCpu: element.usedCpu,
          usableMem: element.parentUsableMem,
          currentMem: element.currentMem,
          applyMem: element.applyMem,
          usedMem: element.usedMem,
          memUnit: element.memUnit,
          architectureType: element.architectureType
        })
      })

      // currentStorage	// 当前存储
      // storageUnit	// 存储单位
      // usedStorage	// 已使用存储
      // parentUsableStorage	// 上级剩余存储
      // vdcResource.totalStorage = formData.currentStorage;
      vdcResource.usableStorage = formData.parentUsableStorage
      vdcResource.currentStorage = formData.currentStorage
      vdcResource.applyStorage = formData.applyStorage
      vdcResource.usedStorage = formData.usedStorage
      vdcResource.storageUnit = formData.storageUnit
      vdcResource.modifyChild = true

      vdcResource.architectureResourceList = list
      return vdcResource
    },
    setshowfirstVdc() {
      const { editflag, formData } = this.formOptions

      const { firstVdc } = formData

      const vdcResource = this.tovdcResource(formData)
      if (firstVdc) {
        // 一级vdc
        this.firstVdcFormData = {
          vdcResource: vdcResource,
          editflag,
          formData
        }
        this.showfirstVdc = true
      } else {
        // 非一级vdc
        this.vdcFormData = {
          vdcResource: vdcResource,
          editflag,
          formData
        }
        this.showfirstVdc = false
      }
    },

    handleConfirmvalidate() {
      const This = this
      const allValidate = []
      let vdcResourceValidate = ''
      if (this.showfirstVdc) {
        vdcResourceValidate = this.$refs.firstVdcresource.handleConfirm()
      } else {
        vdcResourceValidate = this.$refs.vdcresource.handleConfirm()
      }

      allValidate.push(vdcResourceValidate)
      allValidate.push(
        new Promise((rev, rej) => {
          // 划重点：This.$refs['item'+index][0]
          This.$refs.refuseForm.validate((valid) => {
            if (valid) {
              rev()
            } else {
              rej()
            }
          })
        })
      )

      return Promise.all(allValidate)
    },
    // 提交
    handleConfirm() {
      this.handleConfirmvalidate()
        .then(() => {
          let architectureResourceList = ''
          let storageDataForm = ''
          if (this.showfirstVdc) {
            architectureResourceList =
              this.$refs.firstVdcresource.architectureResourceFormList
            storageDataForm = this.$refs.firstVdcresource.storageDataForm
          } else {
            architectureResourceList =
              this.$refs.vdcresource.architectureResourceFormList
            storageDataForm = this.$refs.vdcresource.storageDataForm
          }
          this.handleCommit(architectureResourceList, storageDataForm)
        })
        .catch(() => {})
    },
    handleCommit(architectureList, storageDataForm) {
      const { editflag, formData } = this.formOptions
      const commitData = {
        workOrderId: formData.workOrderId, // 工单ID
        realStorage: storageDataForm.applyStorage, // 真实存储
        storageUnit: storageDataForm.storageUnit, // 存储单位
        auditOpinion: this.refuseFormData.auditOpinion, // 审核意见
        architectureResourceList: []
      }
      const list = []
      architectureList.forEach((element) => {
        list.push({
          realCpu: element.applyCpu, // 真实cpu
          realMem: element.applyMem, // 真实内存
          memUnit: element.memUnit, // 内存单位
          architectureType: element.architectureType // 架构
        })
      })
      commitData.architectureResourceList = list
      // 申请云服务器
      passModifyVdc(commitData)
        .then((res) => {
          this.alertTips(res, 'success')
          this.handleCancel()
        })
        .catch((err) => {
          this.alertTips(err)
        })
    },

    handleCancel() {
      this.$parent.closeDrawer()
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@include DrawerRtl;

.changeSpecModal {
  .create-new-formtable {
    display: flex;
    flex-direction: column;
    flex: 1;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    max-height: 82vh;
    padding: 0 50px;
  }
  .template-box {
    margin-top: 15px;
    .el-textarea {
      width: 375px;
      max-height: 100px;
    }
  }
}
.footBtn {
  //position: absolute;bottom: 0;right: 0;left: 0;
  padding: 25px 70px;

  border-top: 1px $borderColor solid;
  .el-button {
    margin-right: 15px;
  }
}
</style>
