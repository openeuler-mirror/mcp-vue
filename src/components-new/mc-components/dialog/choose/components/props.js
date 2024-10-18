export default {
  props: {
    // 中间获取table数据的接口方法
    getTableList: {
      type: Function,
      default: () => {
        return Promise.resolve({})
      }
    },
    // 中间table展示的列,每项由label(头部名称),fixed(是否固定列),value(每列字段名)组成
    tableColumn: {
      type: Array,
      default: () => []
    },
    // 中间table搜索时传往后台接口的字段名
    tableSearchKey: {
      type: String,
      default: ''
    },
    // 中间列表数据唯一标识,默认是id字段
    tableKey: {
      type: String,
      default: 'id'
    },
    // 中间table查询时的分组字段名，默认为groupId
    tableGroupKey: {
      type: String,
      default: 'groupId'
    },
    // 中间table要传入的其他请求参数
    tableOptions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 右侧已选展示的列,每项由label(头部名称),fixed(是否固定列),value(每列字段名)组成
    seletcedColumn: {
      type: Array,
      default: () => []
    }
  }
}
