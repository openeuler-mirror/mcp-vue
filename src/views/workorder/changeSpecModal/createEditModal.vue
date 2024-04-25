<template>
  <el-drawer
    v-if="drawerVisible"
    size="900px"
    :title="options.title"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <createEditBox ref="createEditBox" :form-options="formOptions" />
  </el-drawer>
</template>

<script>
import createEditBox from './createEditBox.vue'
export default {
  components: {
    createEditBox
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      drawerVisible: this.visible,
      formOptions: this.options
    }
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis
    }
  },
  created() {},
  methods: {
    handleCloseCreate() {
      this.$emit('update:visible', false)
      this.$parent.renderTable()
    }
  }
}
</script>

<style>
</style>
