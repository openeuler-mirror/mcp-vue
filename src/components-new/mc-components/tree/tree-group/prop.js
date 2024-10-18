export default {
  props: {
    visibleExpand: {
      type: Boolean,
      default: true
    },
    // 左边树的高度
    height: {
      type: String,
      default: '600px'
    },
    props: {
      /*
      * `label:指定节点标签为节点对象的某个属性值, string, function(data, node)`
      * `children:指定子树为节点对象的某个属性值, string`
      * `disabled:指定节点选择框是否禁用为节点对象的某个属性值,	boolean, function(data, node)`
      * `isLeaf:指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效,	boolean, function(data, node)`
      */
      type: Object,
      default () {
        return {
          children: 'children',
          label: 'label',
          disabled: 'disabled'
        }
      }
    },
    // 唯一标识的属性,默认id字段
    nodeKey: {
      type: String,
      default: 'id'
    },
    // tree信息
    treeData: {
      type: Array,
      default: () => []
    },
    // tree 搜索之后的结果
    filterData: {
      type: Array,
      default: () => []
    },
    // 是否是白色主题，默认为false，暗色主题
    white: {
      type: Boolean,
      default: false
    },
    // 当前选中的节点
    currentNodeKey: {
      type: [String, Number],
      default: ''
    },
    // 主动赋值，更新nodeid
    activeNodeId: {
      type: [String, Number],
      default: ''
    },
    // 是否展示可选择
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // 是否只能选择用户，不选择组
    onlyUser: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: [Function, null],
      default: null
    },
    isShowRightLabelIcon: {
      type: Boolean,
      default: true
    }
  }
}
