<template>
  <div class="drawer-content">
    <div class="check-apply-servervm">
      <div class="template-box">
        <el-form
          ref="passApplyServervmForm"
          label-width="80px"
          :model="passApplyServervmFormData"
          :rules="rulesTemplate"
        >
          <el-form-item :label="$t('workOrder.howtocreate')">
            <span>
              {{
                applyServerVmType[passApplyServervmFormData.applyServerVmType]
              }}
            </span>
          </el-form-item>
          <!-- 名称 -->
          <el-form-item :label="$t('workOrder.aliasName')" prop="aliasName">
            <el-input v-model="passApplyServervmFormData.aliasName" />
          </el-form-item>
          <!-- 数量 -->
          <el-form-item :label="$t('workOrder.serverNum')" prop="applyNum">
            <!-- <span>{{ passApplyServervmFormData.applyNum }}</span> -->
            <el-input v-model="passApplyServervmFormData.applyNum" />
          </el-form-item>
          <!-- 模板 -->
          <el-form-item :label="$t('workOrder.servertemplate')">
            <span>{{ passApplyServervmFormData.templateName }}</span>
          </el-form-item>
          <!-- 操作系统  -->
          <el-form-item :label="$t('workOrder.osMachine')">
            <span>{{ passApplyServervmFormData.osMachine }}</span>
          </el-form-item>
          <!-- 架构 -->
          <el-form-item :label="$t('workOrder.architecture')">
            <span>{{ passApplyServervmFormData.architecture }}</span>
          </el-form-item>
          <!-- 类型 -->
          <el-form-item :label="$t('workOrder.systemType')">
            <span>{{ passApplyServervmFormData.systemType }}</span>
          </el-form-item>
          <!-- 创建类型 -->
          <el-form-item :label="$t('workOrder.cloneType')">
            <el-radio-group v-model="passApplyServervmFormData.cloneType">
              <el-radio
                v-for="(item, index) in cloneTypeList"
                :key="item.value + index"
                :label="item.value"
              >{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 自动安置 -->
          <el-form-item :label="$t('workOrder.autoConfiguration')">
            <el-switch
              v-model="passApplyServervmFormData.autoConfiguration"
              class="switchStyle"
              :active-value="true"
              :inactive-value="false"
              :active-text="$t('workOrder.autoConfigurationOn')"
              :inactive-text="$t('workOrder.autoConfigurationOff')"
            />
          </el-form-item>
          <!-- 计算资源 -->
          <computResources
            v-if="!passApplyServervmFormData.autoConfiguration"
            ref="computResources"
            :form-data="formData"
          />
          <!-- 存储位置  -->
          <el-form-item
            v-if="!passApplyServervmFormData.autoConfiguration"
            :label="$t('workOrder.storageLocation')"
            prop="storageLocationId"
          >
            <el-select
              v-model="passApplyServervmFormData.storageLocationId"
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
            <el-input-number v-model="passApplyServervmFormData.cpu" />
          </el-form-item>
          <!-- 内存 -->
          <el-form-item :label="$t('common.mem')" prop="mem">
            <el-input v-model="passApplyServervmFormData.mem" v-only-num>
              <template slot="append">GB</template>
            </el-input>
          </el-form-item>
          <!-- 磁盘 -->
          <setDiskInfo
            ref="setDiskInfo"
            :form-data="disksformData"
            page-mode="TEMPADD"
          />

          <!-- 网卡 -->
          <setNetWorkInfo
            ref="setNetWorkInfo"
            :form-data="networksformData"
            page-mode="TEMPADD"
          />

          <!-- 审核意见 -->
          <el-form-item
            :label="$t('workOrder.reviewComments')"
            prop="auditOpinion"
          >
            <el-input
              v-model="passApplyServervmFormData.auditOpinion"
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
import { passApplyServerVm } from '@/api/workOrder'
import validate from '@/utils/validate'
import computResources from './computResources.vue' // 计算资源
import setDiskInfo from './setDiskInfo.vue' // 设置磁盘信息
import setNetWorkInfo from './setNetWorkInfo.vue' // 设置网卡信息
import dictionary from '@/assets/common/dataDictionary/dictionary'
export default {
  components: {
    footBtn,
    computResources,
    setDiskInfo,
    setNetWorkInfo
  },
  props: ['passApplyData', 'formData'],
  data() {
    const validApplyNum = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error(rule.message))
      } else if (Number(value) < 1 || Number(value) > 100) {
        callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    return {
      applyServerVmType: {
        ISO: this.$t('workOrder.serverVmType.ISO'), // ISO镜像
        TEMPLATE: this.$t('workOrder.serverVmType.TEMPLATE') // 模板
      },
      passApplyServervmFormData: {
        auditOpinion: '',
        osMachine: '',
        architecture: '',
        systemType: '',
        templateName: '',
        applyNum: 5,
        aliasName: '',
        autoConfiguration: true,
        selectCluster: '',
        selectClusterUuid: '',
        storageLocationId: '',
        cpu: '',
        mem: '',
        memUnit: 'GB',
        disks: [], // 磁盘信息
        networks: [], // 网卡信息
        cloneType: 'FULL_CLONE' // 克隆类型
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
            message: this.$t('workOrder.serverNumRange'), // "申请个数应控制在 1 ~ 100 范围",
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

      // 克隆
      cloneTypeList: dictionary.cloneTypeArr
    }
  },

  created() {
    this.getApplyDetail()
  },
  methods: {
    // 获取模板详情
    getApplyDetail() {
      const res = this.formData
      this.passApplyServervmFormData.applyServerVmType = res.applyServerVmType
      this.passApplyServervmFormData.aliasName = res.aliasName
      this.passApplyServervmFormData.applyNum = res.applyNum
      this.passApplyServervmFormData.templateName = res.templateName
      this.passApplyServervmFormData.osMachine = res.osMachine
      this.passApplyServervmFormData.architecture = res.architecture
      this.passApplyServervmFormData.systemType = res.systemType
      this.passApplyServervmFormData.cpu = res.cpu
      this.passApplyServervmFormData.mem = res.mem
      this.passApplyServervmFormData.memUnit = res.memUnit
      this.passApplyServervmFormData.storageLocationId = res.storageLocationId

      this.storageLocationList = res.storageLocationList

      this.passApplyServervmFormData.cloneType = 'LINK_CLONE'

      // 处理网卡数据
      this.networksformData = JSON.parse(JSON.stringify(this.formData))
      // 处理磁盘数据
      this.disksformData = JSON.parse(JSON.stringify(this.formData))
    },
    // 提交
    handlerConfirm() {
      const that = this
      let computResourcesvalidate = true
      let netWorkInfovalidate = true
      let setDiskInfovalidate = true
      // 检验计算资源
      if (!this.passApplyServervmFormData.autoConfiguration) {
        computResourcesvalidate = this.$refs.computResources.submitForm()
      }

      // 检验磁盘信息
      setDiskInfovalidate = this.$refs.setDiskInfo.submitForm()
      // 检验网卡信息
      netWorkInfovalidate = this.$refs.setNetWorkInfo.submitForm()

      const confirmMsg = this.$t('workOrder.sureApproved') // "确定审核通过？";
      this.$refs.passApplyServervmForm.validate((valid) => {
        if (
          valid &&
          computResourcesvalidate &&
          netWorkInfovalidate &&
          setDiskInfovalidate
        ) {
          this.alertConfirm(confirmMsg)
            .then((err) => {
              that.commitPass()
            })
            .catch((err) => {})
        } else {
          return false
        }
      })
    },
    commitPass() {
      const workOrderId = this.passApplyData.workOrderId
      const auditOpinion = this.passApplyServervmFormData.auditOpinion
      const aliasName = this.passApplyServervmFormData.aliasName

      const storageLocationId = this.passApplyServervmFormData.storageLocationId
      const vcpus = this.passApplyServervmFormData.cpu
      const memory = this.passApplyServervmFormData.mem
      const memUnit = this.passApplyServervmFormData.memUnit

      const plateformType = this.passApplyServervmFormData.architecture
      const operatingSystem = this.passApplyServervmFormData.osMachine
      const systemType = this.passApplyServervmFormData.systemType
      const vmNumber = this.passApplyServervmFormData.applyNum

      const remotePassword = this.createRemotePassword()
      // 枚举: TEMPLATE,ISO
      // 枚举备注: TEMPLATE(基于模板创建) ISO(ISO创建)
      const applyServerVmType = 'TEMPLATE'

      let computResourcesFormData = {
        serverClusterType: this.formData.serverClusterType,
        // 自定义 选择主机
        selectCluster: this.formData.selectCluster, // 模板所选计算资源
        selectClusterUuid: this.formData.selectClusterUuid, // 模板所选计算资源uuid

        selectResourceTagId: this.formData.selectTagIds, // 绑定资源ID
        selectTagNames: this.formData.selectTagNames // 绑定资源的名称
      }
      if (!this.passApplyServervmFormData.autoConfiguration) {
        const computResources =
          this.$refs.computResources.computResourcesFormData
        computResourcesFormData = {
          serverClusterType: computResources.serverClusterType,
          // 自定义 选择主机
          selectCluster: computResources.selectCluster, // 模板所选计算资源
          selectClusterUuid: computResources.selectClusterUuid, // 模板所选计算资源uuid

          selectResourceTagId: computResources.selectTagIds, // 绑定资源ID
          selectTagNames: computResources.selectTagNames // 绑定资源的名称
        }
      }

      // 网络
      const networkList = this.$refs.setNetWorkInfo.cmtnetworkList

      // 磁盘处理
      const diskList = this.$refs.setDiskInfo.cmtdiskList

      const cloneType = this.passApplyServervmFormData.cloneType

      const commitData = {
        workOrderId,
        auditOpinion,
        aliasName,
        plateformType,
        operatingSystem,
        systemType,
        vmNumber,
        storageLocationId,
        vcpus,
        memory,
        memUnit,
        diskList,
        networkList,
        remotePassword,
        applyServerVmType,
        ...computResourcesFormData,
        cloneType
      }

      // 申请云服务器
      passApplyServerVm(commitData).then((res) => {
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
    },
    createRemotePassword() {
      var arr = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ]
      var rand1 = Math.floor(Math.random() * 62)
      var rand2 = Math.floor(Math.random() * 62)
      var rand3 = Math.floor(Math.random() * 62)
      var rand4 = Math.floor(Math.random() * 62)
      var rand5 = Math.floor(Math.random() * 62)
      var rand6 = Math.floor(Math.random() * 62)
      return (
        arr[rand1] +
        arr[rand2] +
        arr[rand3] +
        arr[rand4] +
        arr[rand5] +
        arr[rand6]
      )
    }
  }
}
</script>

<style lang="scss" scope>
@import "~@/styles/mixin.scss";

.check-apply-servervm {
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
