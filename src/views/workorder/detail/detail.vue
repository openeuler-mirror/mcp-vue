<template>
  <div class="workDetail">
    <div class="workDetail-content">
      <!-- 变更云服务器 -->
      <el-form ref="form" label-width="auto" v-if="isModifyServerVM">
        <!-- 工单类型 -->
        <el-form-item :label="$t('workOrder.typeDesc')">
          <span>{{ modifyServerVM.workOrderTypeDesc }}</span>
        </el-form-item>
        <!-- 工单对象 -->
        <el-form-item :label="$t('workOrder.target')">
          <span>{{ modifyServerVM.workOrderTarget }}</span>
        </el-form-item>
        <!-- 所属组织 -->
        <el-form-item :label="$t('workOrder.organizationName')">
          <span>{{ modifyServerVM.orgName }}</span>
        </el-form-item>
        <!-- 状态  -->
        <el-form-item :label="$t('workOrder.statusDesc')">
          <span>{{ modifyServerVM.statusDesc }}</span>
        </el-form-item>
        <!-- 操作系统  -->
        <el-form-item :label="$t('workOrder.osMachine')">
          <span>{{ modifyServerVM.osMachine }}</span>
        </el-form-item>
        <!-- 架构 -->
        <el-form-item :label="$t('workOrder.architecture')">
          <span>{{ modifyServerVM.architecture }}</span>
        </el-form-item>
        <!-- 规格 -->
        <el-form-item :label="$t('workOrder.specification')">
          <div>
            <p v-if="!modifyServerVM.ifModifyCpu">
              CPU：{{ modifyServerVM.cpu }}{{ $t("common.cpu") }}
            </p>
            <p v-else class="newAdd">
              CPU：{{ modifyServerVM.originalCpu }}{{ $t("common.cpu") }} ->
              {{ modifyServerVM.cpu }}{{ $t("common.cpu") }}
            </p>
            <p v-if="!modifyServerVM.ifModifyMem">
              {{ $t("common.mem") }}：{{ modifyServerVM.mem
              }}{{ modifyServerVM.menUtil }}
            </p>
            <p v-else class="newAdd">
              {{ $t("common.mem") }}：{{ modifyServerVM.originalMem }}
              {{ modifyServerVM.menUtil }}->
              {{ modifyServerVM.mem }}
              {{ modifyServerVM.menUtil }}
            </p>
            <p
              v-for="(item, index) in modifyServerVM.disks"
              :key="'disk' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd"
                >{{ $t("common.hard")
                }}{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB,{{ item.purpose
                }}<span class="modifyType"
                  >({{ $t("common.newDisk") }})</span
                ></span
              >
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld"
                >{{ $t("common.hard")
                }}{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB <span class="modifyType"></span
              ></span>
              <span v-else-if="item.modifyType === 'MODIFY'" class="newAdd"
                >{{ $t("common.hard")
                }}{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：
                {{ item.oldDiskSize }}GB -> {{ item.diskSize }}GB
              </span>
              <span v-else
                >{{ $t("common.hard")
                }}{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB</span
              >
            </p>
            <p
              v-for="(item, index) in modifyServerVM.networks"
              :key="'network' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd"
                >{{ $t("common.network")
                }}{{ modifyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}<span class="modifyType"
                  >({{ $t("common.newnetwork") }})</span
                >

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld"
                >{{ $t("common.network")
                }}{{ modifyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}<span class="modifyType"></span
              ></span>
              <span v-else-if="item.modifyType === 'NONE'"
                >{{ $t("common.network")
                }}{{ modifyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else class="newAdd"
                >{{ $t("common.network")
                }}{{ modifyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
            </p>
          </div>
        </el-form-item>
        <!-- 到期时间 -->
        <el-form-item :label="$t('workOrder.deadLineTime')">
          <span>{{ modifyServerVM.deadLineTime }}</span>
        </el-form-item>
        <!-- 到期处理 -->
        <el-form-item :label="$t('workOrder.deadlineTypeDesc')">
          <span>{{ modifyServerVM.deadlineTypeDesc }}</span>
        </el-form-item>
        <!-- 申请原因 -->
        <el-form-item :label="$t('workOrder.applyReason')">
          <span>{{ modifyServerVM.applyReason }}</span>
        </el-form-item>
        <!-- 申请时间 -->
        <el-form-item :label="$t('workOrder.applyTime')">
          <span>{{ modifyServerVM.applyTime }}</span>
        </el-form-item>
        <!-- 审核者 -->
        <el-form-item :label="$t('workOrder.auditionUser')">
          <span>{{ modifyServerVM.auditionUser }}</span>
        </el-form-item>
        <!-- 审核时间 -->
        <el-form-item :label="$t('workOrder.auditionTime')">
          <span>{{ modifyServerVM.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ modifyServerVM.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 申请云服务器 -->
      <el-form ref="form" label-width="auto" v-if="isApplyServerVM">
        <!-- 创建方式 -->
        <el-form-item :label="$t('workOrder.howtocreate')">
          <span>{{ applyServerVmType[applyServerVM.applyServerVmType] }}</span>
        </el-form-item>
        <!-- 所属集群  -->
        <el-form-item :label="$t('workOrder.clusterName')">
          <span>{{ applyServerVM.clusterName }}</span>
        </el-form-item>
        <!-- 工单类型 -->
        <el-form-item :label="$t('workOrder.typeDesc')">
          <span>{{ applyServerVM.workOrderTypeDesc }}</span>
        </el-form-item>
        <!-- 工单对象 -->
        <el-form-item :label="$t('workOrder.target')">
          <span>{{ applyServerVM.workOrderTarget }}</span>
        </el-form-item>
        <!-- 创建类型 -->

        <el-form-item
          v-if="
            applyServerVM.applyServerVmType == 'TEMPLATE' &&
            applyServerVM.status == 'CHECK_PASS'
          "
          label="创建类型"
        >
          <span>{{ getmcCloneTypeDesc(applyServerVM.mcCloneType) }}</span>
        </el-form-item>
        <!-- 所属组织 -->
        <el-form-item :label="$t('workOrder.organizationName')">
          <span>{{ applyServerVM.orgName }}</span>
        </el-form-item>
        <!-- 状态  -->
        <el-form-item :label="$t('workOrder.statusDesc')">
          <span>{{ applyServerVM.statusDesc }}</span>
        </el-form-item>
        <!-- 镜像 -->
        <el-form-item
          v-if="applyServerVM.applyServerVmType == 'ISO'"
          :label="$t('workOrder.iso')"
        >
          <span>{{ applyServerVM.isoList[0].isoFile }}</span>
        </el-form-item>
        <!-- 模板名称 -->
        <el-form-item v-else :label="$t('workOrder.templateName')">
          <span>{{ applyServerVM.templateName }}</span>
        </el-form-item>

        <!-- <el-form-item label="模板名称">
        <span>{{ applyServerVM.templateName }}</span>
      </el-form-item> -->
        <!-- 操作系统  -->
        <el-form-item :label="$t('workOrder.osMachine')">
          <span>{{ applyServerVM.osMachine }}</span>
        </el-form-item>
        <!-- 架构 -->
        <el-form-item :label="$t('workOrder.architecture')">
          <span>{{ applyServerVM.architecture }}</span>
        </el-form-item>
        <!-- 申请个数 -->
        <el-form-item :label="$t('workOrder.applyNum')">
          <span v-if="!applyServerVM.ifModifyApplyNum">
            {{ applyServerVM.applyNum }}
          </span>
          <span v-else class="newAdd">
            {{ applyServerVM.applyNum }} -> {{ applyServerVM.modifyApplyNum }}
          </span>
        </el-form-item>
        <!-- 描述 -->
        <el-form-item :label="$t('workOrder.description')">
          <span>{{ applyServerVM.description }}</span>
        </el-form-item>
        <!-- 规格 -->
        <el-form-item :label="$t('workOrder.specification')">
          <div>
            <p v-if="!applyServerVM.ifModifyCpu">
              CPU：{{ applyServerVM.cpu }}{{ $t("common.cpu") }}
            </p>
            <p v-else class="newAdd">
              CPU：{{ applyServerVM.cpu }}{{ $t("common.cpu") }} ->
              {{ applyServerVM.modifyCpu }}{{ $t("common.cpu") }}
            </p>
            <p v-if="!applyServerVM.ifModifyMem">
              {{ $t("common.mem") }}：{{ applyServerVM.mem
              }}{{ applyServerVM.menUtil }}
            </p>
            <p v-else class="newAdd">
              {{ $t("common.mem") }}：{{ applyServerVM.mem
              }}{{ applyServerVM.menUtil }} -> {{ applyServerVM.modifyMem
              }}{{ applyServerVM.menUtil }}
            </p>

            <p
              v-for="(item, index) in applyServerVM.disks"
              :key="'disk' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd">
                {{ $t("common.hard")
                }}{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB,{{ item.purpose }}
                <span class="modifyType">({{ $t("common.newDisk") }})</span>
              </span>
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld">
                {{ $t("common.hard")
                }}{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB <span class="modifyType"> </span
              ></span>
              <span v-else-if="item.modifyType === 'MODIFY'" class="newAdd">
                {{ $t("common.hard")
                }}{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.oldDiskSize
                }}GB -> {{ item.diskSize }}GB
              </span>
              <span v-else
                >{{ $t("common.hard")
                }}{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB</span
              >
            </p>

            <p
              v-for="(item, index) in applyServerVM.networks"
              :key="'network' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd"
                >{{ $t("common.network")
                }}{{ applyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}<span class="modifyType"
                  >({{ $t("common.newnetwork") }})</span
                >

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld"
                >{{ $t("common.network")
                }}{{ applyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}<span class="modifyType"></span
              ></span>
              <span v-else-if="item.modifyType === 'NONE'"
                >{{ $t("common.network")
                }}{{ applyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}
                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else class="newAdd">
                {{ $t("common.network")
                }}{{ applyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}
                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
            </p>
          </div>
        </el-form-item>
        <!-- 使用时间 -->
        <el-form-item :label="$t('workOrder.useMonth')">
          <span>
            {{ applyServerVM.useMonth }}
            {{ $t("workOrder.useMonthUnit") }}
          </span>
        </el-form-item>
        <!-- 到期处理 -->
        <el-form-item :label="$t('workOrder.deadlineTypeDesc')">
          <span>{{ applyServerVM.deadlineTypeDesc }}</span>
        </el-form-item>
        <!-- 申请原因 -->
        <el-form-item :label="$t('workOrder.applyReason')">
          <span>{{ applyServerVM.applyReason }}</span>
        </el-form-item>
        <!-- 申请时间 -->
        <el-form-item :label="$t('workOrder.applyTime')">
          <span>{{ applyServerVM.applyTime }}</span>
        </el-form-item>
        <!-- 审核者 -->
        <el-form-item :label="$t('workOrder.auditionUser')">
          <span>{{ applyServerVM.auditionUser }}</span>
        </el-form-item>
        <!-- 审核时间 -->
        <el-form-item :label="$t('workOrder.auditionTime')">
          <span>{{ applyServerVM.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ applyServerVM.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 延期云服务器 -->
      <el-form ref="form" label-width="auto" v-if="isApplyDeferredDetail">
        <!-- 工单类型 -->
        <el-form-item :label="$t('workOrder.typeDesc')">
          <span>{{ applyDeferredDetail.workOrderTypeDesc }}</span>
        </el-form-item>
        <!-- 工单对象 -->
        <el-form-item :label="$t('workOrder.target')">
          <span>{{ applyDeferredDetail.workOrderTarget }}</span>
        </el-form-item>
        <!-- 所属组织 -->
        <el-form-item :label="$t('workOrder.organizationName')">
          <span>{{ applyDeferredDetail.orgName }}</span>
        </el-form-item>
        <!-- 状态  -->
        <el-form-item :label="$t('workOrder.statusDesc')">
          <span>{{ applyDeferredDetail.statusDesc }}</span>
        </el-form-item>
        <!-- 原到期时间 -->
        <el-form-item :label="$t('workOrder.oldDeadlineTime')">
          <span>{{ applyDeferredDetail.oldDeadlineTime }}</span>
        </el-form-item>
        <!-- 延期时间 -->
        <el-form-item :label="$t('workOrder.newDeadlineTime')">
          <span>{{ applyDeferredDetail.newDeadlineTime }}</span>
        </el-form-item>
        <!-- 申请原因 -->
        <el-form-item :label="$t('workOrder.applyReason')">
          <span>{{ applyDeferredDetail.applyReason }}</span>
        </el-form-item>
        <!-- 申请时间 -->
        <el-form-item :label="$t('workOrder.applyTime')">
          <span>{{ applyDeferredDetail.applyTime }}</span>
        </el-form-item>
        <!-- 审核者 -->
        <el-form-item :label="$t('workOrder.auditionUser')">
          <span>{{ applyDeferredDetail.auditionUser }}</span>
        </el-form-item>
        <!-- 审核时间 -->
        <el-form-item :label="$t('workOrder.auditionTime')">
          <span>{{ applyDeferredDetail.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ applyDeferredDetail.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 注册用户 -->
      <el-form ref="form" label-width="auto" v-if="isRegisterUserDetail">
        <!-- 工单类型 -->
        <el-form-item :label="$t('workOrder.typeDesc')">
          <span>{{ registerUserDetail.workOrderTypeDesc }}</span>
        </el-form-item>
        <!-- 工单对象 -->
        <el-form-item :label="$t('workOrder.target')">
          <span>{{ registerUserDetail.workOrderTarget }}</span>
        </el-form-item>
        <!-- 状态  -->
        <el-form-item :label="$t('workOrder.statusDesc')">
          <span>{{ registerUserDetail.statusDesc }}</span>
        </el-form-item>
        <!-- 真实姓名 -->
        <el-form-item :label="$t('workOrder.realName')">
          <span>{{ registerUserDetail.realName }}</span>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item :label="$t('workOrder.pwd')">
          <span>*********</span>
        </el-form-item>
        <!-- 所属组织 -->
        <el-form-item :label="$t('workOrder.organizationName')">
          <span>{{ registerUserDetail.organizationName }}</span>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item :label="$t('workOrder.mobile')">
          <span>{{ registerUserDetail.mobile }}</span>
        </el-form-item>
        <!-- 原因 -->
        <el-form-item :label="$t('workOrder.reason')">
          <span>{{ registerUserDetail.applyReason }}</span>
        </el-form-item>
        <!-- 审核者 -->
        <el-form-item :label="$t('workOrder.auditionUser')">
          <span>{{ registerUserDetail.auditionUser }}</span>
        </el-form-item>
        <!-- 审核时间 -->
        <el-form-item :label="$t('workOrder.auditionTime')">
          <span>{{ registerUserDetail.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ registerUserDetail.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 修改账号 -->
      <el-form ref="form" label-width="auto" v-if="isUpdateUserDetail">
        <!-- 工单类型 -->
        <el-form-item :label="$t('workOrder.typeDesc')">
          <span>{{ updateUserDetail.workOrderTypeDesc }}</span>
        </el-form-item>
        <!-- 工单对象 -->
        <el-form-item :label="$t('workOrder.target')">
          <span>{{ updateUserDetail.workOrderTarget }}</span>
        </el-form-item>
        <!-- 所属组织 -->
        <el-form-item :label="$t('workOrder.organizationName')">
          <span>{{ updateUserDetail.orgName }}</span>
        </el-form-item>
        <!-- 状态  -->
        <el-form-item :label="$t('workOrder.statusDesc')">
          <span>{{ updateUserDetail.statusDesc }}</span>
        </el-form-item>
        <!-- 真实姓名 -->
        <el-form-item :label="$t('workOrder.realName')">
          <span>{{ updateUserDetail.realName }}</span>
        </el-form-item>
        <!-- 新真实姓名 -->
        <el-form-item :label="$t('workOrder.newRealName')">
          <span class="special">{{ updateUserDetail.newRealName }} </span>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item :label="$t('workOrder.pwd')">
          <span>*********</span>
        </el-form-item>
        <!-- <el-form-item label="组织">
          <span>{{ updateUserDetail.organizationName }}</span>
        </el-form-item> -->
        <!-- 手机号 -->
        <el-form-item :label="$t('workOrder.mobile')">
          <span>{{ updateUserDetail.mobile }}</span>
        </el-form-item>
        <!-- 原因 -->
        <el-form-item :label="$t('workOrder.reason')">
          <span>{{ updateUserDetail.applyReason }}</span>
        </el-form-item>
        <!-- 审核者 -->
        <el-form-item :label="$t('workOrder.auditionUser')">
          <span>{{ updateUserDetail.auditionUser }}</span>
        </el-form-item>
        <!-- 审核时间 -->
        <el-form-item :label="$t('workOrder.auditionTime')">
          <span>{{ updateUserDetail.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ updateUserDetail.auditOpinion }}</span>
        </el-form-item>
      </el-form>

      <!-- isModifyVdcVM -->
      <modifyVdcDetail v-if="isModifyVdcVM" :formOptions="modifyVdcVMDetail">
      </modifyVdcDetail>
    </div>
  </div>
</template>

<script>
import {
  getApplyServerVmDetail,
  getModifyServerVmDetail,
  getApplyDeferredDetail,
  getRegisterUserDetail,
  getUpdateUserDetail,
  applyModifyVdcDetail,
} from "@/api/workOrder";

import ipsetDeiatl from "./ipsetDeiatl";
import modifyVdcDetail from "./modifyVdcDetail.vue";
import dictionary from "@/assets/common/dataDictionary/dictionary";

export default {
  name: "WorkDetail",
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  components: { ipsetDeiatl, modifyVdcDetail },
  data() {
    return {
      workOrderId: "",
      type: "",
      // 变更云服务器
      modifyServerVM: {},
      // 申请云服务器
      applyServerVM: {},
      // 延期云服务器
      applyDeferredDetail: {},
      // 注册用户
      registerUserDetail: {},
      // 修改账号
      updateUserDetail: {},
      applyServerVmType: {
        ISO: "ISO镜像",
        TEMPLATE: "模板",
      },
      modifyVdcVMDetail: {
        formData: {},
      },
    };
  },
  created() {
    let { formData } = this.formOptions;

    this.workOrderId = formData.workOrderId;
    this.type = formData.type;
    const workOrderId = this.workOrderId;
    const type = this.type;
    // 申请云服务器
    this.isApplyServerVM &&
      getApplyServerVmDetail({ workOrderId, type }).then((data) => {
        this.applyServerVM = data;
      });

    // 变更云服务器
    this.isModifyServerVM &&
      getModifyServerVmDetail({ workOrderId, type }).then((data) => {
        this.modifyServerVM = data;
      });

    // 延期云服务器
    this.isApplyDeferredDetail &&
      getApplyDeferredDetail({ workOrderId, type }).then((data) => {
        this.applyDeferredDetail = data;
      });

    // 注册账号
    this.isRegisterUserDetail &&
      getRegisterUserDetail({ workOrderId, type }).then((data) => {
        this.registerUserDetail = data;
      });

    // 修改账号
    this.isUpdateUserDetail &&
      getUpdateUserDetail({ workOrderId, type }).then((data) => {
        this.updateUserDetail = data;
      });
    // 工单详情-变更VDC
    this.isModifyVdcVM &&
      applyModifyVdcDetail({ workOrderId }).then((data) => {
        this.modifyVdcVMDetail.formData = data;
      });
  },
  mounted() {},
  computed: {
    isModifyServerVM: function () {
      return this.type === "MODIFY_SERVERVM";
    },
    isApplyServerVM: function () {
      return this.type === "APPLY_SERVERVM";
    },
    isApplyDeferredDetail: function () {
      return this.type === "DEFERRED_SERVERVM";
    },
    isRegisterUserDetail: function () {
      return this.type === "REGISTER_USER";
    },
    isUpdateUserDetail: function () {
      return this.type === "MODIFY_USER";
    },
    isModifyVdcVM: function () {
      return this.type === "MODIFY_VDC";
    },
  },
  methods: {
    getmcCloneTypeDesc(key) {
      return dictionary.getDesc(key, dictionary.cloneTypeArr);
    },
  },
};
</script>

<style lang="scss" scope>
@import "~@/styles/mixin.scss";
@include DrawerRtl;
.workDetail {
  @include formStyle;
  display: flex;
  flex: 1;
  flex-direction: column;
  .workDetail-content {
    display: flex;
    flex-direction: column;
    height: 0px;
    flex: 1;
    overflow: auto;
    .el-form > .el-form-item {
      margin-bottom: 0px !important;
    }
    p {
      margin: 0;
    }
  }
}
.special {
  color: rgb(226, 111, 17);
}
.newAdd {
  color: rgb(226, 111, 17);
}
.deleteOld {
  text-decoration: line-through;
}
.modifyType {
  margin-left: 10px;
  font-size: 8px;
}
</style>