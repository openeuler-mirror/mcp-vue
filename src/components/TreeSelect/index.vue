<template>
  <el-select
    ref="select"
    :value="value"
    :placeholder="placeholder"
    size="small"
    @visible-change="visibleChange"
    clearable
    style="width: 100%"
    @clear="clear"
  >
    <el-option
      ref="option"
      class="option"
      :value="optionData.id"
      :label="optionData.name"
    >
      <el-tree
        ref="tree"
        class="tree"
        :node-key="nodeKey"
        :data="data"
        :props="props"
        :default-expanded-keys="[value]"
        highlight-current
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "TreeSelect",
  props: {
    placeholder: {
      type: [String, Number],
      default: "",
    },
    // v-model绑定
    value: {
      type: [String, Number],
      default: "",
    },
    // 树形的数据
    data: {
      type: Array,
      default: function () {
        return [
          {
            label: "系统",
            id: 1,
            children: [
              { label: "用户", id: 2 },
              { label: "用户组", id: 3 },
              { label: "角色", id: 4 },
              { label: "菜单", id: 5 },
              { label: "组织架构", id: 6 },
            ],
          },
          {
            label: "商品",
            id: 7,
            children: [
              { label: "列表", id: 8 },
              { label: "添加", id: 9 },
              { label: "修改", id: 10 },
              { label: "删除", id: 11 },
              { label: "商品分类", id: 12 },
              { label: "分类修改", id: 13 },
            ],
          },
        ];
      },
    },
    // 每个树节点用来作为唯一标识的属性
    nodeKey: {
      type: [String, Number],
      default: "id",
    },
    // tree的props配置
    props: {
      type: Object,
      default: function () {
        return {
          label: "label",
          children: "children",
        };
      },
    },
  },
  data() {
    return {
      optionData: {
        id: "",
        name: "",
      },
    };
  },
  watch: {
    value: {
      handler(val) {
        if (!this.isEmpty(this.data)) {
          this.init(val);
        }
      },
      immediate: true,
    },
    data: function (val) {
      if (!this.isEmpty(val)) {
        this.init(this.value);
      }
    },
  },
  methods: {
    // 是否为空
    isEmpty(val) {
      for (let key in val) {
        return false;
      }
      return true;
    },
    handleNodeClick(data) {
      this.$emit("input", data[this.nodeKey]);
      this.$refs.select.visible = false;
    },
    init(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(val);
          let node = this.$refs.tree.getNode(val);
          this.optionData.id = val;
          this.optionData.name = node.label;
        });
      } else {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(null);
        });
      }
    },
    visibleChange(e) {
      if (e) {
        let selectDom = this.$refs.tree.$el.querySelector(".is-current");
        setTimeout(() => {
          this.$refs.select.scrollToOption({ $el: selectDom });
        }, 0);
      }
    },
    clear() {
      this.$emit("input", "");
    },
  },
};
</script>

<style lang="scss" scoped>
.option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}

.tree {
  padding: 4px 20px;
  font-weight: 400;
}
</style>