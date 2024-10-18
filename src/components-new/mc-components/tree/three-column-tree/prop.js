export default {
  props: {
    props: {
      /*
      * `label:指定节点标签为节点对象的某个属性值, string, function(data, node)`
      * `children:指定子树为节点对象的某个属性值, string`
      * `disabled:指定节点选择框是否禁用为节点对象的某个属性值,	boolean, function(data, node)`
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
    // tree 搜索, 左边
    filterTreeData: {
      type: [String, Function],
      default: ''
    },
    // 标签 搜索，右边
    filterLabelData: {
      type: [String, Function],
      default: ''
    },
    // 是否显示tab 头部
    showHeader: {
      type: Boolean,
      default: true
    },
    // 编辑时，传递已选值
    deaultSelectData: {
      type: Object,
      default: () => {
        return {
          select: [],
          exclude: []
        }
      }
    },
    // 存在只需要选择树不需要展示列表的情况，此时only-left 为true
    onlyLeft: {
      type: Boolean,
      default: false
    },
    // 只有一个tab标签
    onlyLabel: {
      type: Boolean,
      default: false
    },
    // 是否只能选择用户，不选择组
    onlyUser: {
      type: Boolean,
      default: false
    },
    // 是否是白色主题，默认为false，暗色主题
    white: {
      type: Boolean,
      default: false
    },
    // 是否需要展示剔除操作
    isRidOf: {
      type: Boolean,
      default: false
    },
    // tree 的高度
    height: {
      type: String,
      default: '600px'
    },
    // 左边tab的文案
    leftTabText: {
      type: String,
      default: ''
    },
    // 右边tab的文案
    rightTabText: {
      type: String,
      default: ''
    },
    // 是否展示可选择
    showCheckbox: {
      type: Boolean,
      default: false
    },
    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法, false 表示关联，true 表示不关联
    checkStrictly: {
      type: Boolean,
      default: false
    },
    // api 获取左边tab内数据的方法
    getTreeLeftList: {
      type: Function,
      default: null
    },
    // api 获取右边tab内数据的方法
    getTreeRightList: {
      type: Function,
      default: null
    },
    // 优先级：midColumn > user相关（大部分都是用户选择，所以将user相关设置为默认table列）
    midColumn: {
      type: Array,
      default: () => []
    },
    // 优先级: midColumn > rightColumn > user相关
    // 默认中间表格和右侧的table列应该一样的
    rightColumn: {
      type: Array,
      default: () => []
    },
    // api 点击左边tree，中间的表格同步更新数据，所调用的接口
    getMidTableFilter: {
      type: Function,
      default: null
    },
    // 父级选中，子级是否禁止勾选，即父子是否关联
    midRelated: {
      type: Boolean,
      default: true
    },
    // 是否是用户相关，用户相关的有默认值（用户相关最常用）
    isUserGroup: {
      type: Boolean,
      default: false
    },
    // 三列最右侧，问号提示是否展示
    pushlishTip: {
      type: Boolean,
      default: true
    },
    // 是否展示tree，right tab的icon
    isShowRightLabelIcon: {
      type: Boolean,
      default: true
    },
    // mid 选择的时候，进行拦截，return promise
    beforeSelect: {
      type: Function,
      default: null
    },
    // mid 排除的时候，进行拦截，return promise
    beforeExclude: {
      type: Function,
      default: null
    },
    // right 取消选择的时候，进行拦截，return promise
    beforeCancelSelect: {
      type: Function,
      default: null
    },
    // right 取消排除的时候，进行拦截，return promise
    beforeCancelExclude: {
      type: Function,
      default: null
    },
    // 中间表格input框的placeholder
    midPlaceholder: {
      type: String,
      default: ''
    }
  }
}
