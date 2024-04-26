<template>
  <div class="drawer-content">
    <div class="check-modify-servervm">
      <div class="template-box">
        <el-form
          ref="passModifyServervmForm"
          label-width="80px"
          :model="passModifyServervmFormData"
          :rules="rulesTemplate"
        >
          <!-- 名称 -->
          <el-form-item :label="$t('workOrder.aliasName')" prop="aliasName">
            <el-input v-model="passModifyServervmFormData.aliasName" />
          </el-form-item>
          <!-- 操作系统  -->
          <el-form-item :label="$t('workOrder.osMachine')">
            <span>{{ passModifyServervmFormData.osMachine }}</span>
          </el-form-item>
          <!-- 架构 -->
          <el-form-item :label="$t('workOrder.architecture')">
            <span>{{ passModifyServervmFormData.architecture }}</span>
          </el-form-item>
          <!-- 类型 -->
          <el-form-item :label="$t('workOrder.systemType')">
            <span>{{ passModifyServervmFormData.systemType }}</span>
          </el-form-item>

          <!-- 计算资源 -->
          <computResources
            ref="computResources"
            :form-data="passModifyformData"
          />
          <!-- 存储位置  -->
          <el-form-item
            :label="$t('workOrder.storageLocation')"
            prop="storageLocationId"
          >
            <el-select
              v-model="passModifyServervmFormData.storageLocationId"
              :placeholder="$t('workOrder.placstorageLocation')"
            >
              <el-option
                v-for="item in storageLocationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="CPU" prop="cpu">
            <el-input-number v-model="passModifyServervmFormData.cpu" />
          </el-form-item>
          <!-- 内存 -->
          <el-form-item :label="$t('common.mem')" prop="mem">
            <el-input v-model="passModifyServervmFormData.mem" v-only-num>
              <template slot="append">GB</template>
            </el-input>
          </el-form-item>
          <!-- 磁盘 -->
          <setDiskInfo
            ref="setDiskInfo"
            :form-data="disksformData"
            page-mode="CHANGE"
          />

          <!-- 网卡 -->
          <setNetWorkInfo
            ref="setNetWorkInfo"
            :form-data="networksformData"
            page-mode="CHANGE"
          />
          <div class="network-group-wrap">
            <div v-for="(item, index) in orlIsoShowList" :key="index">
              <!-- 光驱 -->
              <el-form-item
                :label="
                  $t('common.cdRom') +
                    (orlIsoShowList.length > 1 ? index + 1 : '')
                "
                prop="network"
              >
                <span>{{ item.isoFile }}</span>
              </el-form-item>
            </div>
          </div>
          <!-- 审核意见 -->
          <el-form-item
            :label="$t('workOrder.reviewComments')"
            prop="auditOpinion"
          >
            <el-input
              v-model="passModifyServervmFormData.auditOpinion"
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
<script>
import footBtn from '@/components/Footbtn'
import ReMessage from '@/utils/message'
import { passModifyServerVmDetail, passModifyServerVm } from '@/api/workOrder'
import validate from '@/utils/validate'
import computResources from './computResources.vue' // 计算资源
import setDiskInfo from './setDiskInfo.vue' // 设置磁盘信息
import setNetWorkInfo from './setNetWorkInfo.vue' // 设置网卡信息
export default {
  components: {
    footBtn,
    computResources,
    setDiskInfo,
    setNetWorkInfo
  },
  props: ['passModifyData'],
  data() {
    const validApplyNum = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error(rule.message))
      } else if (Number(value) < 1 || Number(value) > 4) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      passModifyServervmFormData: {
        auditOpinion: '',
        osMachine: '',
        architecture: '',
        templateName: '',
        systemType: '',
        aliasName: '',
        selectCluster: '',
        selectClusterUuid: '',
        storageLocationId: '',
        cpu: '',
        mem: '',
        memUnit: 'GB',
        disks: [], // 磁盘信息
        networks: [], // 网卡信息
        applyNum: ''
      },
      storageLocationList: [],
      rulesTemplate: {
        aliasName: [
          {
            required: true,
            message: this.$t('workOrder.aliasNameNotNull'), // "名称不能为空",
            trigger: 'blur'
          },
          {
            min: 6,
            max: 32,
            message: this.$t('workOrder.aliasNameLength'), // "名称长度应控制在 6 ~ 32 个字符",
            trigger: 'blur'
          }
        ],
        applyNum: [
          {
            required: true,
            message: this.$t('workOrder.serverNumNotNull'), // "申请个数不能为空",
            trigger: 'blur'
          },
          {
            message: this.$t('workOrder.serverNumIsoRange'), // "申请个数应控制在 1 ~ 4 范围",
            trigger: 'blur',
            validator: validApplyNum
          }
        ],
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
      },

      // 磁盘信息
      disksformData: {},
      // 网卡信息
      networksformData: {},

      // 光驱列表
      orlIsoShowList: [],
      passModifyformData: {}
    }
  },

  created() {
    this.getApplyDetail()
  },
  methods: {
    // 获取模板详情
    getApplyDetail() {
      const workOrderId = this.passModifyData.workOrderId
      passModifyServerVmDetail({ workOrderId }).then((res) => {
        this.passModifyformData = res
        this.passModifyServervmFormData.applyNum = res.applyNum
        this.passModifyServervmFormData.aliasName = res.aliasName
        this.passModifyServervmFormData.osMachine = res.osMachine
        this.passModifyServervmFormData.architecture = res.architecture
        this.passModifyServervmFormData.systemType = res.systemType
        this.passModifyServervmFormData.cpu = res.cpu
        this.passModifyServervmFormData.mem = res.mem
        this.passModifyServervmFormData.memUnit = res.memUnit
        this.passModifyServervmFormData.selectCluster = res.selectCluster
        this.passModifyServervmFormData.selectClusterUuid =
          res.selectClusterUuid
        this.passModifyServervmFormData.storageLocationId =
          res.storageLocationId

        this.storageLocationList = res.storageLocationList

        // 处理网卡数据
        this.networksformData = JSON.parse(
          JSON.stringify(this.passModifyformData)
        )
        // 处理磁盘数据
        this.disksformData = JSON.parse(
          JSON.stringify(this.passModifyformData)
        )

        this.orlIsoShowList = res.applyIsoList
      })
    },
    // 提交
    handlerConfirm() {
      const that = this
      let computResourcesvalidate = true
      let netWorkInfovalidate = true
      let setDiskInfovalidate = true
      // 检验计算资源
      computResourcesvalidate = this.$refs.computResources.submitForm()
      // 检验磁盘信息
      setDiskInfovalidate = this.$refs.setDiskInfo.submitForm()
      // 检验网卡信息
      netWorkInfovalidate = this.$refs.setNetWorkInfo.submitForm()

      const confirmMsg = this.$t('workOrder.sureApproved') // "确定审核通过？";
      this.$refs.passModifyServervmForm.validate((valid) => {
        if (
          valid &&
          computResourcesvalidate &&
          netWorkInfovalidate &&
          setDiskInfovalidate
        ) {
          this.alertConfirm(confirmMsg)
            .then((err) => {
              that.commitModifyPass()
            })
            .catch((err) => {})
        } else {
          return false
        }
      })
    },
    commitModifyPass() {
      const workOrderId = this.passModifyData.workOrderId
      const auditOpinion = this.passModifyServervmFormData.auditOpinion
      const aliasName = this.passModifyServervmFormData.aliasName

      const storageLocationId = this.passModifyServervmFormData.storageLocationId
      const vcpus = this.passModifyServervmFormData.cpu
      const memory = this.passModifyServervmFormData.mem
      const memUnit = this.passModifyServervmFormData.memUnit
      const plateformType = this.passModifyServervmFormData.architecture
      const operatingSystem = this.passModifyServervmFormData.osMachine
      const systemType = this.passModifyServervmFormData.systemType

      const computResources = this.$refs.computResources.computResourcesFormData
      const computResourcesFormData = {
        serverClusterType: computResources.serverClusterType,
        // 自定义 选择主机
        selectCluster: computResources.selectCluster, // 模板所选计算资源
        selectClusterUuid: computResources.selectClusterUuid, // 模板所选计算资源uuid

        selectResourceTagId: computResources.selectTagIds, // 绑定资源ID
        selectTagNames: computResources.selectTagNames // 绑定资源的名称
      }

      // 网络
      const networkList = this.$refs.setNetWorkInfo.cmtnetworkList

      // 磁盘处理
      const diskList = this.$refs.setDiskInfo.cmtdiskList

      const commitData = {
        workOrderId,
        auditOpinion,
        aliasName,
        plateformType,
        operatingSystem,
        systemType,

        storageLocationId,
        vcpus,
        memory,
        memUnit,
        diskList,
        networkList,
        ...computResourcesFormData
      }
      passModifyServerVm(commitData).then((res) => {
        this.passSuccess()
      })
    },
    handlerCancel() {
      this.$parent.closeDrawer()
    },
    passSuccess() {
      ReMessage.success(this.$t('common.reviewsucc'))
      this.$parent.$parent.$parent.refreshTable()
      this.handlerCancel()
    }
  }
}
</script>

<style lang="scss" scope>
@import "~@/styles/mixin.scss";

.check-modify-servervm {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;

  .el-input {
    width: $input-width;
  }
  .el-input-number {
    width: $input-width;
  }
  .el-textarea {
    width: 380px;
    max-height: 100px;
  }
}
</style>
