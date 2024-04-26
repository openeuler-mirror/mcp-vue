<template>
  <el-drawer
    v-if="drawerVisible"
    size="900px"
    :title="$t('workOrder.passapplyservervm')"
    direction="rtl"
    custom-class="workorder-pass-apply-servervm-drawer"
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleClosePass"
    :destroy-on-close="true"
  >
    <!-- 模板审核 -->
    <PassServervmApplyDrawer
      v-if="showTemplate"
      ref="PassServervmApply"
      :form-data="passApplyFormData"
      :pass-apply-data="passApplyData"
    />
    <!-- iso审核 -->
    <PassServervmIsoApplyDrawer
      v-if="showIsoTemplate"
      ref="PassServervmApply"
      :form-data="passApplyFormData"
      :pass-apply-data="passApplyData"
    />
  </el-drawer>
</template>

<script>
import PassServervmApplyDrawer from './PassServervmApply.vue'
import PassServervmIsoApplyDrawer from './PassServervmIsoApply.vue'
import { passApplyServerVmDetail } from '@/api/workOrder'

export default {
  components: {
    PassServervmApplyDrawer,
    PassServervmIsoApplyDrawer
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
      passApplyData: null,
      passApplyFormData: null,
      showTemplate: false,
      showIsoTemplate: false
    }
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis
      this.passApplyData = this.selectRowData
      if (isvis) {
        this.getApplyDetail()
      }
    },
    selectRowData: {
      handler(selectRow, oldselectRow) {
        // this.passApplyData = selectRow;
        // this.getApplyDetail();
      },
      // 代表在wacth里声明了 立即先去执行handler方法
      immediate: false,
      deep: true
    }

    // visible(isvis) {
    //   this.drawerVisible = isvis;
    // },
    // selectRowData(selectRow) {
    //   this.passApplyData = selectRow;
    //   this.getApplyDetail();
    // },
  },
  created() {},
  methods: {
    getApplyDetail() {
      const workOrderId = this.passApplyData.workOrderId

      this.$nextTick(() => {
        this.$showFullScreenLoading('.el-drawer__body')
      })
      passApplyServerVmDetail({ workOrderId })
        .then((res) => {
          const { applyServerVmType } = res
          switch (applyServerVmType) {
            case 'TEMPLATE':
              this.showTemplate = true
              break
            case 'ISO':
              this.showIsoTemplate = true
              break
            default:
              this.showTemplate = false
              this.showIsoTemplate = false
              break
          }
          // applyServerVmType: "TEMPLATE";
          this.passApplyFormData = res
          this.$hideFullScreenLoading()
        })
        .catch((err) => {
          this.$hideFullScreenLoading()
        })
    },
    handleClosePass(done) {
      // this.$refs.PassServervmApply.handlerCancel()
      this.showTemplate = false
      this.showIsoTemplate = false
      // this.passApplyData = null;
      this.$emit('update:visible', false)
      done()
    }
  }
}
</script>
<style>
</style>
