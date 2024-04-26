<template>
  <!-- 计算资源 -->
  <div class="computResources-box">
    <el-form
      ref="computResourcesForm"
      label-width="auto"
      :model="computResourcesFormData"
      :rules="computResourcesRules"
    >
      <!-- 计算资源 -->
      <el-form-item
        :label="$t('workOrder.serverClusterType')"
        prop="serverClusterType"
      >
        <el-radio-group
          v-model="computResourcesFormData.serverClusterType"
          @change="serverClusterTypeChange"
        >
          <el-radio
            v-for="(item, index) in serverClusterTypeList"
            :key="item.value + index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 自定义 选择主机 -->
      <el-form-item
        v-if="computResourcesFormData.serverClusterType == 'CUSTOM'"
        :label="$t('workOrder.serverClusterTypeObj.CUSTOM')"
        prop="selectCluster"
        class="input-with-select"
      >
        <el-input
          v-model="computResourcesFormData.selectCluster"
          qlinput-readonly
          readonly
        >
          <el-button slot="append" @click="changeSelectCluster">
            {{ $t("common.select") }}
          </el-button>
        </el-input>
      </el-form-item>
      <!--  绑定资源 -->
      <el-form-item
        v-if="computResourcesFormData.serverClusterType == 'BIND_RESOURCE'"
        :label="$t('workOrder.serverClusterTypeObj.BIND_RESOURCE')"
        prop="selectTagNames"
        class="input-with-select"
      >
        <el-input
          v-model="computResourcesFormData.selectTagNames"
          qlinput-readonly
          readonly
        >
          <el-button slot="append" @click="changeSelectTagNames">
            {{ $t("common.select") }}
          </el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- 选择主机 -->
    <selectCluster-drawer
      :visible.sync="showSelectClusterDrawer"
      :selected-cluster-ids="selectedClusterIds"
      :can-cluster-list="clusterList"
      @handlerConfirm="selectClusterConfirm"
    />
    <!-- 绑定资源 -->
    <selectTagNames-drawer
      :visible.sync="showSelectTagNamesDrawer"
      :select-tag-ids="selectTagIds"
      :cluster-bind-resource-list="clusterBindResourceList"
      @handlerConfirm="selectTagIdsConfirm"
    />
  </div>
</template>
<script>
import selectClusterDrawer from './selectCluster-drawer'
import selectTagNamesDrawer from './selectTagNames-drawer.vue'
export default {
  components: {
    selectClusterDrawer,
    selectTagNamesDrawer
  },
  props: ['formData'],
  data() {
    return {
      // 枚举备注: AUTO(自动) CUSTOM(自定义) BIND_RESOURCE(绑定资源)
      serverClusterTypeList: [
        {
          label: this.$t('workOrder.serverClusterTypeObj.AUTO'), // "自动",
          value: 'AUTO'
        },
        {
          label: this.$t('workOrder.serverClusterTypeObj.CUSTOM'), // "自定义",
          value: 'CUSTOM'
        },
        {
          label: this.$t('workOrder.serverClusterTypeObj.BIND_RESOURCE'), // "绑定资源",
          value: 'BIND_RESOURCE'
        }
      ],
      computResourcesFormData: {
        serverClusterType: 'AUTO',
        // 自定义 选择主机
        selectCluster: '', // 模板所选计算资源
        selectClusterUuid: '', // 模板所选计算资源uuid

        selectTagIds: '', // 绑定资源ID
        selectTagNames: '' // 绑定资源的名称
      },
      computResourcesRules: {
        serverClusterType: [{ required: true, message: '', trigger: 'blur' }],
        selectCluster: [
          {
            required: true,
            message: this.$t('workOrder.pselectCluster'), // "请选择主机",
            trigger: 'blur'
          }
        ],
        selectTagNames: [
          {
            required: true,
            message: this.$t('workOrder.pselectCluster'), // "请绑定资源",
            trigger: 'blur'
          }
        ]
      },

      showSelectClusterDrawer: false,
      selectedClusterIds: '',
      clusterList: [],

      showSelectTagNamesDrawer: false,
      selectTagIds: '',
      clusterBindResourceList: []
    }
  },
  watch: {
    formData(val) {
      this.setPageDefaultData(val)
    }
  },

  created() {},
  mounted() {
    if (this.formData) {
      this.setPageDefaultData(this.formData)
    }
  },
  beforeDestroy() {
    this.resetForm()
  },
  // watch: {
  //   data: {
  //     handler: function (newValue, oldValue) {
  //       if (newValue) {
  //         this.$refs.elTable.clearSelection();
  //         this.tableData = newValue;
  //         this.toggleSelection();
  //         this.$nextTick(() => {
  //           this.calcTableHeight();
  //         });
  //       }
  //     },
  //     // 代表在wacth里声明了 立即先去执行handler方法
  //     immediate: false,
  //     deep: true,
  //   },
  // },
  methods: {
    setPageDefaultData(defaultData) {
      const { serverClusterType, clusterList, clusterBindResourceList } =
        defaultData
      this.clusterList = clusterList
      this.clusterBindResourceList = clusterBindResourceList
      this.serverClusterTypeChange(serverClusterType)
    },
    serverClusterTypeChange(val) {
      this.resetForm()
      this.computResourcesFormData.serverClusterType = val
      const { selectCluster, selectClusterUuid, selectTagIds, selectTagNames } =
        this.formData
      switch (val) {
        case 'AUTO':
          this.computResourcesFormData.selectCluster = '' // 模板所选计算资源
          this.computResourcesFormData.selectClusterUuid = '' // 模板所选计算资源uuid
          this.computResourcesFormData.selectTagIds = '' // 绑定资源ID
          this.computResourcesFormData.selectTagNames = '' // 绑定资源的名称
          break
        case 'CUSTOM':
          this.computResourcesFormData.selectCluster = selectCluster // 模板所选计算资源
          this.computResourcesFormData.selectClusterUuid = selectClusterUuid // 模板所选计算资源uuid
          this.computResourcesFormData.selectTagIds = '' // 绑定资源ID
          this.computResourcesFormData.selectTagNames = '' // 绑定资源的名称

          break
        case 'BIND_RESOURCE':
          this.computResourcesFormData.selectCluster = '' // 模板所选计算资源
          this.computResourcesFormData.selectClusterUuid = '' // 模板所选计算资源uuid
          this.computResourcesFormData.selectTagIds = selectTagIds // 绑定资源ID
          this.computResourcesFormData.selectTagNames = selectTagNames // 绑定资源的名称
          break
        default:
          this.computResourcesFormData.selectCluster = '' // 模板所选计算资源
          this.computResourcesFormData.selectClusterUuid = '' // 模板所选计算资源uuid
          this.computResourcesFormData.selectTagIds = '' // 绑定资源ID
          this.computResourcesFormData.selectTagNames = '' // 绑定资源的名称
          break
      }
    },

    changeSelectCluster() {
      this.selectedClusterIds = this.computResourcesFormData.selectClusterUuid
      this.showSelectClusterDrawer = true
    },
    selectClusterConfirm(val) {
      this.computResourcesFormData.selectCluster = val.selectCluster // 模板所选计算资源
      this.computResourcesFormData.selectClusterUuid = val.selectClusterUuid // 模板所选计算资源uuid
    },

    changeSelectTagNames() {
      this.selectTagIds = this.computResourcesFormData.selectTagIds
      this.showSelectTagNamesDrawer = true
    },
    selectTagIdsConfirm(val) {
      this.computResourcesFormData.selectTagIds = val.selectTagIds // 绑定资源ID
      this.computResourcesFormData.selectTagNames = val.selectTagNames // 绑定资源的名称
    },

    submitForm() {
      let flag
      this.$refs.computResourcesForm.validate((valid) => {
        if (valid) {
          flag = true
        } else {
          flag = false
        }
      })
      return flag
    },
    resetForm() {
      this.$refs.computResourcesForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scope>
.computResources-box {
}
</style>
