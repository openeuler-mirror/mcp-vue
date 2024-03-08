<template>
  <div class="drawer-content">
    <div class="create-new-form">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <el-form-item :label="$t('authorityMgr.roleType')" prop="roleType">
            <el-radio-group
              v-if="formOptions.editflag"
              disabled
              v-model="createDataFormData.roleType"
            >
              <!-- ORG(组织管理) SELF_SERVICE(自服务) PLATFORM(平台管理) -->

              <el-radio label="ORG"> {{ getroleTypeLabel("ORG") }}</el-radio>
              <el-radio label="SELF_SERVICE">
                {{ getroleTypeLabel("SELF_SERVICE") }}
              </el-radio>
              <el-radio label="PLATFORM">
                {{ getroleTypeLabel("PLATFORM") }}
              </el-radio>
            </el-radio-group>
            <el-radio-group
              v-else
              disabled
              v-model="createDataFormData.roleType"
            >
              <el-radio label="PLATFORM">
                {{ getroleTypeLabel("PLATFORM") }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('authorityMgr.roleName')" prop="roleName">
            <el-input
              v-model="createDataFormData.roleName"
              :placeholder="$t('authorityMgr.roleNameplaceholder')"
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('authorityMgr.roleNametooltip')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item
            :label="$t('authorityMgr.setPermission')"
            prop="permissionset"
          >
            <div class="jurisdiction-box">
              <div class="left-jurisdiction">
                <div class="jurisdiction-title">
                  {{ $t("authorityMgr.optionalPermissions") }}
                </div>
                <div class="jurisdiction-content kcp-el-tree">
                  <el-tree
                    ref="lefttree"
                    show-checkbox
                    default-expand-all
                    :data="lefttreeData"
                    :props="lefttreeProps"
                    :node-key="leftnodeKey"
                    :default-expanded-keys="leftdefaultExpandedkeys"
                    @node-click="lefthandleNodeClick"
                  >
                  </el-tree>
                </div>
              </div>
              <div class="cneter-jurisdiction">
                <div class="jurisdiction-toright">
                  <div class="jurisdiction-btn" @click="getLeftCheckedKeys">
                    {{ btniconLeft }}
                  </div>
                </div>
                <div class="jurisdiction-toleft">
                  <div class="jurisdiction-btn" @click="getRightCheckedKeys">
                    {{ btniconRight }}
                  </div>
                </div>
              </div>
              <div class="right-jurisdiction">
                <div class="jurisdiction-title">
                  {{ $t("authorityMgr.selectedPermissions") }}
                </div>
                <div class="jurisdiction-content kcp-el-tree">
                  <el-tree
                    ref="righttree"
                    show-checkbox
                    default-expand-all
                    :data="righttreeData"
                    :props="righttreeProps"
                    :node-key="rightnodeKey"
                    :default-expanded-keys="rightdefaultExpandedkeys"
                    @node-click="righthandleNodeClick"
                  >
                  </el-tree>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item :label="$t('authorityMgr.remark')" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.remark"
            />
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
import validate from "@/utils/validate";
import footBtn from "@/components/Footbtn";
import bindOrgModal from "../../../organizationMgr/bindOrganization/bindOrgModal.vue";
import {
  customPlatformRoleMaxPermission,
  createRole,
  modifyRole,
} from "@/api/roleMgr";
import dealtree from "@/utils/dealtree";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  components: {
    footBtn,
    bindOrgModal,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      btniconLeft: ">",
      btniconRight: "<",

      leftnodeKey: "permissionId",
      leftdefaultExpandedkeys: [],
      lefttreeData: [],
      lefttreeProps: {
        children: "children",
        label: "name",
      },

      rightnodeKey: "permissionId",
      rightdefaultExpandedkeys: [],
      righttreeData: [],
      righttreeProps: {
        children: "children",
        label: "name",
      },

      oriFormData: {
        roleType: "PLATFORM", // 角色类型
        roleName: "", // 角色名称
        permissions: [],
        remark: "", // 描述
      },
      createDataFormData: {},

      rulesTemplate: {
        roleType: [
          {
            required: true,
            message: this.$t("authorityMgr.roleTypeplaceholder"),
            trigger: "blur",
          },
        ],
        roleName: [
          {
            required: true,
            message: this.$t("authorityMgr.roleNameNotNull"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 18,
            message: this.$t("authorityMgr.roleNameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("authorityMgr.roleNametooltip"),
            validator: validate.validateCharZhEnNum,
          },
        ],
        permissionset: [
          {
            required: false,
            message: this.$t("authorityMgr.setPermissionplaceholder"),
            trigger: "blur",
          },
        ],
      },

      showbindOrgModal: false,
      orgSelectedKeys: [],
    };
  },
  mounted() {
    this.setPageData();
  },
  methods: {
    setPageData() {
      this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
      let { editflag, formData } = this.formOptions;
      if (editflag) {
        // 编辑
        this.createDataFormData.roleType = formData.roleType;
        this.createDataFormData.roleId = formData.roleId;
        this.createDataFormData.roleName = formData.roleName;
        this.createDataFormData.remark = formData.remark;
        this.createDataFormData.permissions = formData.permissions
        // 获取左侧节点树
        this.getLeftTree(0);
        // 获取右侧节点树
        this.getRightTree(formData.roleId);
      } else {
        // 新增
        // 获取左侧节点树
        this.getLeftTree(0);

        this.createDataFormData.permissions = [];
      }
    },
    getroleTypeLabel(key) {
      return dictionary.getDesc(key, dictionary.roleTypeArr);
    },

    // 提交
    handlerConfirm() {
      let { editflag } = this.formOptions;
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          if (editflag) {
            // 编辑信息
            this.commitEdit();
          } else {
            // 新增信息
            this.commitCreate();
          }
        } else {
          return false;
        }
      });
    },
    commitCreate() {
      let createOrgData = {
        roleName: this.createDataFormData.roleName, // 角色名称
        permissions: this.getRightCheckedAllKeys(), // 已选权限集合
        remark: this.createDataFormData.remark, // 组织描述
      };
      createRole(createOrgData)
        .then((res) => {
          this.alertTips(this.$t("authorityMgr.createRoleSuccMsg"), "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },

    commitEdit() {
      let editRoleData = {
        roleId: this.createDataFormData.roleId, // 角色ID
        roleName: this.createDataFormData.roleName, // 角色名称
        permissions: this.getRightCheckedAllKeys(), // 已选权限集合
        remark: this.createDataFormData.remark, // 组织描述
      };
      modifyRole(editRoleData)
        .then((res) => {
          this.alertTips(this.$t("authorityMgr.modifyRoleSuccMsg"), "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },

    handlerCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
    openSelectModal(key) {
      switch (key) {
        case "org":
          this.showbindOrgModal = true;
          break;

        default:
          this.showbindOrgModal = false;
          break;
      }
    },
    // 获取左侧树节点
    getLeftTree(roleId) {
      this.lefttreeData = [];
      customPlatformRoleMaxPermission({ roleId: roleId })
        .then((res) => {
          let treeList = [];
          res.forEach((element) => {
            if (element) {
              treeList.push(element);
            }
          });
          this.lefttreeData = JSON.parse(JSON.stringify(treeList));
          let permissions = dealtree.getKeyWihoutParent(this.createDataFormData.permissions.slice(),this.lefttreeData)
          let { editflag } = this.formOptions;
          if (editflag) {
            // 编辑
            this.$nextTick(() => {
              this.$refs.lefttree.setCheckedKeys(permissions, false);
              // this.getLeftCheckedKeys();
            });
          } else {
            // 新增
            this.$nextTick(() => {
              this.$refs.lefttree.setCheckedKeys(permissions, false);
              // this.getLeftCheckedKeys();
            });
          }
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    // 获取右侧树节点
    getRightTree(roleId) {
      this.righttreeData = [];
      customPlatformRoleMaxPermission({ roleId: roleId })
        .then((res) => {
          let righttreeList = [];
          res.forEach((element) => {
            if (element) {
              righttreeList.push(element);
            }
          });
          let lsit = dealtree.treeToList(righttreeList);
          let permissions = this.createDataFormData.permissions;

          let treeLsit = [];
          lsit.forEach((element) => {
            if (permissions.indexOf(element.permissionId) > -1) {
              treeLsit.push(element);
            }
          });

          this.righttreeData = dealtree.listToTree(
            "permissionId",
            "parentId",
            treeLsit
          );
          
          this.$nextTick(() => {
            this.$refs.righttree.setCheckedKeys(permissions, false);
            // this.getRightCheckedKeys();
          });
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },

    getLeftCheckedKeys() {
      let leftCheckedNodes = this.$refs.lefttree.getCheckedNodes(false, true);
      let leftCheckedNodesNotChildren = [];
      leftCheckedNodes.forEach((element) => {
        if (element.children) {
          delete element.children;
        }
        leftCheckedNodesNotChildren.push(element);
      });
      let list = JSON.parse(JSON.stringify(leftCheckedNodes));
      this.righttreeData = dealtree.listToTree(
        "permissionId",
        "parentId",
        list
      );

      let leftCheckedKeys = this.$refs.lefttree.getCheckedKeys();
      this.$refs.righttree.setCheckedKeys(leftCheckedKeys);
    },

    getRightCheckedKeys() {
      let rightCheckedKeys = this.$refs.righttree.getCheckedKeys(true);
      this.$refs.lefttree.setCheckedKeys(rightCheckedKeys);
      this.getLeftCheckedKeys();
    },
    getRightCheckedAllKeys() {
      let leftCheckedKeys = this.$refs.righttree.getCheckedKeys();
      let leftHalfCheckedKeys = this.$refs.righttree.getHalfCheckedKeys();

      let permissions = leftHalfCheckedKeys.concat(leftCheckedKeys);
      return permissions;
    },
    lefthandleNodeClick() {
      console.log("lefthandleNodeClick");
    },
    righthandleNodeClick() {
      console.log("lefthandleNodeClick");
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
@include DrawerRtl;

.create-new-form {
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

    .left-jurisdiction,
    .right-jurisdiction {
      width: 300px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .jurisdiction-content {
        width: 300px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid #e8e8e8;
        padding: 5px;
      }
    }
    .cneter-jurisdiction {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .jurisdiction-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid;
        font-size: 20px;
        font-weight: 400;
        background-color: transparent;
        border-color: #e8e8e8;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .jurisdiction-btn:hover {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
  }
}
</style>
