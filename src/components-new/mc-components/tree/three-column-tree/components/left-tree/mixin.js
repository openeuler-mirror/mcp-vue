import treeGroup from '@/components-new/mc-components/tree/tree-group/index.vue'
import bus from '@/utils/bus'
export default {
  components: {
    treeGroup
  },
  data () {
    return {
      activeNodeId: null,
      filterData: [],
      searchVal: '',
      isLoading: false
    }
  },
  mounted () {
    bus.$on('treeloadOver', () => {
      this.isLoading = false
    })
  },
  beforeDestroy () {
    bus.$off('treeloadOver')
  },
  created () {
    this.getTreeData(-1, true)
  },
  methods: {
    reloadTree (id = -1, params = {}) {
      if (this.searchVal) {
        this.handleSearch(this.searchVal, id)
        return
      }
      const defaultParams = {
        reload: true // 是否刷新tree
      }
      const setParams = Object.assign({}, defaultParams, params)
      if (setParams.reload) {
        this.getTreeData(id)
        return
      }
      this.activeNodeId = id || -1
    },
    searchTree (request, val) {
      this.isLoading = true
      request({
        name: val
      }).then(res => {
        this.filterData = res.map(item => {
          item[this.props['label']] = item.name || item[this.props['label']]
          return item
        })
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
