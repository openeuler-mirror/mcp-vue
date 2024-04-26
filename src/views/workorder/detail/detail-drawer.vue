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
    <detailBox ref="detailBox" :form-options="formOptions" />
  </el-drawer>
</template>

<script>
import detailBox from './detail.vue'
export default {
  components: {
    detailBox
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
      //   this.$parent.renderTable();
    }
  }
}
</script>

<style>
</style>
