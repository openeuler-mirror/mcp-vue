<template>
  <div class="drawer-content">
    <div class="drawer-body-content">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
        >
          <el-form-item :label="$t('authorityMgr.roleType')" prop="roleType">
            <!-- ORG(组织管理) SELF_SERVICE(自服务) PLATFORM(平台管理) -->
            <!-- <el-radio-group v-model="createDataFormData.roleType">
              <el-radio :label="createDataFormData.roleType">
                {{ getroleTypeLabel(createDataFormData.roleType) }}
              </el-radio>
            </el-radio-group> -->
            <span>{{ getroleTypeLabel(createDataFormData.roleType) }}</span>
          </el-form-item>
          <el-form-item :label="$t('authorityMgr.roleName')" prop="roleName">
            <span>{{ createDataFormData.roleName }}</span>
          </el-form-item>
          <el-form-item
            :label="$t('authorityMgr.setPermission')"
            prop="permissionset"
          >
            <div class="jurisdiction-box">
              <div class="left-jurisdiction">
                <div class="jurisdiction-content kcp-el-tree">
                  <el-tree
                    ref="lefttree"
                    default-expand-all
                    :data="lefttreeData"
                    :props="lefttreeProps"
                    :node-key="leftnodeKey"
                  >
                  </el-tree>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item :label="$t('authorityMgr.remark')" prop="remark">
            <span>{{ createDataFormData.remark }}</span>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import footBtn from "@/components/Footbtn";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  components: {
    footBtn,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      leftnodeKey: "permissionId",
      lefttreeData: [],
      lefttreeProps: {
        children: "child",
        label: "name",
        disabled: function (data, node) {
          return !data.canSelected;
        },
      },

      oriFormData: {
        roleType: "PLATFORM", // 角色类型
        roleName: "", // 角色名称
        permissions: [],
        remark: "", // 描述
      },
      createDataFormData: {},
    };
  },
  watch: {},
  created() {
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { formData } = this.formOptions;
    this.createDataFormData.roleType = formData.roleType;
    this.createDataFormData.roleId = formData.roleId;
    this.createDataFormData.roleName = formData.roleName;
    this.createDataFormData.remark = formData.remark;
    this.lefttreeData = formData.permissionTree;
  },
  computed: {},
  methods: {
    getroleTypeLabel(key) {
      return dictionary.getDesc(key, dictionary.roleTypeArr);
    },
    // 提交
    handlerConfirm() {
      this.$parent.closeDrawer();
    },

    handlerCancel() {
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.drawer-body-content {
  @include formStyle;
  flex: 1;
  max-height: 82vh;
  overflow: auto;
  $input-width: 375px;

  .el-input {
    width: $input-width;
  }

  .el-textarea {
    width: $input-width;
  }

  .jurisdiction-box {
    width: 700px;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .jurisdiction-content {
      width: 300px;
      height: 100%;
      display: flex;
      flex-direction: column;
      border: 1px solid #e8e8e8;
      padding: 5px;
    }
  }
}
</style>
