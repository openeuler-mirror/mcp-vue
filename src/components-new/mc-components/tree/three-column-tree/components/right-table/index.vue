<template>
  <div class="right-table">
    <r-table
      :table-data="selectTableData"
      :height="tableHeight"
      :class="{isRidOf : 'r-table--first'}"
      @updateTable="updateSelectRow"
    />
    <r-table
      v-if="isRidOf"
      :is-rid-of="isRidOf"
      :table-data="ridOfTableData"
      :height="tableHeight"
      @updateTable="updateRifOfRow"
    />
  </div>
</template>

<script>
import rTable from './table'
export default {
  components: {
    rTable
  },
  inject: ['isRidOf'],
  props: {
    // 待发布数组
    selectTableData: {
      type: Array,
      default: () => []
    },
    // 排除数组
    ridOfTableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tableHeight () {
      return this.isRidOf ? '280px' : '640px'
    }
  },
  methods: {
    updateSelectRow (selections) {
      this.$emit('updateSelectRow', selections)
    },
    updateRifOfRow (selections) {
      this.$emit('updateRidOfRow', selections)
    }
  }
}
</script>
<style lang="scss" scoped>
.r-table--first{
  border-bottom: 1px $defaultBorderColor solid;
}
</style>

