<template>
  <el-drawer
    v-if="drawerVisible"
    size="800px"
    :title="$t('workOrder.selectiso')"
    direction="rtl"
    :append-to-body="true"
    :modal="false"
    custom-class=""
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <bindTemplateBox
      ref="bindTemplateBox"
      :all-iso-list="allIsoList"
      :default-selected-keys="defaultSelectedKeys"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import bindTemplateBox from './bindTemplateBox.vue'
export default {
  components: {
    bindTemplateBox
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    defaultSelectedKeys: {
      type: Array,
      default: () => []
    },
    allIsoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      drawerVisible: this.visible
    }
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis
    }
  },
  methods: {
    handleCloseCreate() {
      this.$emit('update:visible', false)
      // this.$parent.renderTable();
    },
    confirm(rows) {
      this.$emit('confirm', rows)
    }
  }
}
</script>

<style>
</style>
