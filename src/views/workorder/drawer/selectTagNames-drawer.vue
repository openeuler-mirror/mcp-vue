<template>
  <!-- 选择计算资源 -->
  <el-drawer
    size="800px"
    :title="$t('workOrder.chooseComputingRes')"
    direction="rtl"
    custom-class="workorder-pass-drawer"
    :wrapper-closable="true"
    :visible.sync="drawerVisible"
    :before-close="handleCloseSelectCluster"
    :destroy-on-close="true"
    append-to-body
    @opened="setTableselectTagIds"
  >
    <template><div class="drawer-content">
      <div class="service-modify">
        <mc-table
          ref="multiTable"
          :data="clusterBindResourceList"
          :rowkey="rowkey"
          :selection-type="selectionType"
          @selection-change="handlerSelectionClusterChange"
        >
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <template v-for="(item, index) in columnArr">
            <el-table-column
              :key="index"
              :resizable="index != 0 && index != columnArr.length - 1"
              :label="item.label"
            >
              <template slot-scope="{ row }">
                <span>{{ row[item.prop] }}</span>
              </template>
            </el-table-column>
          </template>
        </mc-table>
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
import mcTable from '@/components/MctablePro'
import footBtn from '@/components/Footbtn'
import ReMessage from '@/utils/message'
export default {
  components: {
    mcTable,
    footBtn
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectTagIds: {
      type: String,
      default: ''
    },
    clusterBindResourceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drawerVisible: this.visible,
      selectTable: [],
      rowkey: 'id',
      selectionType: 'multipleTable',
      columnArr: [
        { label: '名称', prop: 'name' },
        { label: '集群', prop: '' },
        { label: '说明', prop: 'description' }
      ]
    }
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis
    }
  },
  methods: {
    setTableselectTagIds() {
      const selected = this.selectTagIds.split(',')
      for (let i = 0; i < selected.length; i++) {
        const row = this.clusterBindResourceList.find(
          (item) => item.id.toString() === selected[i]
        )
        if (row) {
          this.$refs.multiTable.$refs.elTable.toggleRowSelection(row)
        }
      }
    },
    // 表格勾选
    handlerSelectionClusterChange(selection) {
      this.selectTable = selection
    },
    // 提交
    handlerConfirm() {
      const length = this.selectTable.length
      const errMsg = this.$t('workOrder.pchooseComputingRes') // "请至少勾选一个计算资源节点";
      if (length < 1) {
        ReMessage.error(errMsg)
        return
      }
      let selectTagIds = ''
      let selectTagNames = ''
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          selectTagIds += this.selectTable[i].id
          selectTagNames += this.selectTable[i].name
        } else {
          selectTagIds += this.selectTable[i].id + ','
          selectTagNames += this.selectTable[i].name + ','
        }
      }
      this.$emit('handlerConfirm', { selectTagIds, selectTagNames })
      this.handlerCancel()
    },
    handlerCancel() {
      if (this.selectTable.length > 0) {
        this.$refs.multiTable.$refs.elTable.clearSelection()
      }
      this.selectTable = []
      this.$emit('update:visible', false)
    },
    handleCloseSelectCluster() {
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
