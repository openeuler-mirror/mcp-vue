<template>
  <div class="workDetail app-container">
    <div class="workDetail-content">
      <h3>基本信息</h3>
      <!-- 变更云服务器 -->
      <el-form ref="form" label-width="auto" v-if="isModifyServerVM">
        <el-form-item label="工单类型">
          <span>{{ modifyServerVM.workOrderTypeDesc }}</span>
        </el-form-item>
        <el-form-item label="工单对象">
          <span>{{ modifyServerVM.workOrderTarget }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ modifyServerVM.statusDesc }}</span>
        </el-form-item>
        <el-form-item label="操作系统">
          <span>{{ modifyServerVM.osMachine }}</span>
        </el-form-item>
        <el-form-item label="架构">
          <span>{{ modifyServerVM.architecture }}</span>
        </el-form-item>
        <el-form-item label="规格">
          <div>
            <p v-if="!modifyServerVM.ifModifyCpu">
              CPU：{{ modifyServerVM.cpu }}核
            </p>
            <p v-else class="newAdd">
              CPU：{{ modifyServerVM.originalCpu }}核 ->
              {{ modifyServerVM.cpu }}核
            </p>
            <p v-if="!modifyServerVM.ifModifyMem">
              内存：{{ modifyServerVM.mem }}{{ modifyServerVM.menUtil }}
            </p>
            <p v-else class="newAdd">
              内存：{{ modifyServerVM.originalMem }}
              {{ modifyServerVM.menUtil }}->
              {{ modifyServerVM.mem }}
              {{ modifyServerVM.menUtil }}
            </p>
            <p
              v-for="(item, index) in modifyServerVM.disks"
              :key="'disk' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd"
                >磁盘{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB,{{ item.purpose
                }}<span class="modifyType">(新增磁盘)</span></span
              >
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld"
                >磁盘{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB <span class="modifyType"></span
              ></span>
              <span v-else-if="item.modifyType === 'MODIFY'" class="newAdd"
                >磁盘{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：
                {{ item.oldDiskSize }}GB -> {{ item.diskSize }}GB
              </span>
              <span v-else
                >磁盘{{ modifyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB</span
              >
            </p>
            <p
              v-for="(item, index) in modifyServerVM.networks"
              :key="'network' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd"
                >网卡{{
                  modifyServerVM.networks.length > 1 ? index + 1 : ""
                }}：{{ item.purpose }}<span class="modifyType">(新增网卡)</span>

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld"
                >网卡{{
                  modifyServerVM.networks.length > 1 ? index + 1 : ""
                }}：{{ item.purpose }}<span class="modifyType"></span
              ></span>
              <span v-else-if="item.modifyType === 'NONE'"
                >网卡{{
                  modifyServerVM.networks.length > 1 ? index + 1 : ""
                }}：{{ item.purpose }}

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else class="newAdd"
                >网卡{{
                  modifyServerVM.networks.length > 1 ? index + 1 : ""
                }}：{{ item.purpose }}

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
            </p>
          </div>
        </el-form-item>
        <el-form-item label="到期时间">
          <span>{{ modifyServerVM.deadLineTime }}</span>
        </el-form-item>
        <el-form-item label="到期处理">
          <span>{{ modifyServerVM.deadlineTypeDesc }}</span>
        </el-form-item>
        <el-form-item label="申请原因">
          <span>{{ modifyServerVM.applyReason }}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          <span>{{ modifyServerVM.applyTime }}</span>
        </el-form-item>
        <el-form-item label="审核者">
          <span>{{ modifyServerVM.auditionUser }}</span>
        </el-form-item>
        <el-form-item label="审核时间">
          <span>{{ modifyServerVM.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ modifyServerVM.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 申请云服务器 -->
      <el-form ref="form" label-width="auto" v-if="isApplyServerVM">
        <el-form-item :label="$t('workOrder.howtocreate')">
          <span>{{ applyServerVmType[applyServerVM.applyServerVmType] }}</span>
        </el-form-item>
        <el-form-item label="所属集群">
          <span>{{ applyServerVM.clusterName }}</span>
        </el-form-item>
        <el-form-item label="工单类型">
          <span>{{ applyServerVM.workOrderTypeDesc }}</span>
        </el-form-item>
        <el-form-item label="工单对象">
          <span>{{ applyServerVM.workOrderTarget }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ applyServerVM.statusDesc }}</span>
        </el-form-item>
        <el-form-item
          v-if="applyServerVM.applyServerVmType == 'ISO'"
          label="镜像"
        >
          <span>{{ applyServerVM.isoList[0].isoFile }}</span>
        </el-form-item>
        <el-form-item v-else label="模板名称">
          <span>{{ applyServerVM.templateName }}</span>
        </el-form-item>

        <!-- <el-form-item label="模板名称">
        <span>{{ applyServerVM.templateName }}</span>
      </el-form-item> -->
        <el-form-item label="操作系统">
          <span>{{ applyServerVM.osMachine }}</span>
        </el-form-item>
        <el-form-item label="架构">
          <span>{{ applyServerVM.architecture }}</span>
        </el-form-item>
        <el-form-item label="申请个数">
          <span v-if="!applyServerVM.ifModifyApplyNum">
            {{ applyServerVM.applyNum }}
          </span>
          <span v-else class="newAdd">
            {{ applyServerVM.applyNum }} -> {{ applyServerVM.modifyApplyNum }}
          </span>
        </el-form-item>

        <el-form-item label="描述">
          <span>{{ applyServerVM.description }}</span>
        </el-form-item>
        <el-form-item label="规格">
          <div>
            <p v-if="!applyServerVM.ifModifyCpu">
              CPU：{{ applyServerVM.cpu }}核
            </p>
            <p v-else class="newAdd">
              CPU：{{ applyServerVM.cpu }}核 -> {{ applyServerVM.modifyCpu }}核
            </p>
            <p v-if="!applyServerVM.ifModifyMem">
              内存：{{ applyServerVM.mem }}{{ applyServerVM.menUtil }}
            </p>
            <p v-else class="newAdd">
              内存：{{ applyServerVM.mem }}{{ applyServerVM.menUtil }} ->
              {{ applyServerVM.modifyMem }}{{ applyServerVM.menUtil }}
            </p>

            <p
              v-for="(item, index) in applyServerVM.disks"
              :key="'disk' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd">
                磁盘{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB,{{ item.purpose }}
                <span class="modifyType">(新增磁盘)</span>
              </span>
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld">
                磁盘{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB <span class="modifyType"> </span
              ></span>
              <span v-else-if="item.modifyType === 'MODIFY'" class="newAdd">
                磁盘{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.oldDiskSize
                }}GB -> {{ item.diskSize }}GB
              </span>
              <span v-else
                >磁盘{{ applyServerVM.disks.length > 1 ? index + 1 : "" }}：{{
                  item.diskSize
                }}GB</span
              >
            </p>

            <p
              v-for="(item, index) in applyServerVM.networks"
              :key="'network' + index"
            >
              <span v-if="item.modifyType === 'ADD'" class="newAdd"
                >网卡{{
                  applyServerVM.networks.length > 1 ? index + 1 : ""
                }}：{{ item.purpose }}<span class="modifyType">(新增网卡)</span>

                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else-if="item.modifyType === 'DELETE'" class="deleteOld"
                >网卡{{
                  applyServerVM.networks.length > 1 ? index + 1 : ""
                }}：{{ item.purpose }}<span class="modifyType"></span
              ></span>
              <span v-else-if="item.modifyType === 'NONE'"
                >网卡{{
                  applyServerVM.networks.length > 1 ? index + 1 : ""
                }}：{{ item.purpose }}
                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
              <span v-else class="newAdd">
                网卡{{ applyServerVM.networks.length > 1 ? index + 1 : "" }}：{{
                  item.purpose
                }}
                <ipsetDeiatl v-if="item.setIpInfo" :ipinfo="item"></ipsetDeiatl>
              </span>
            </p>
          </div>
        </el-form-item>
        <el-form-item label="使用时间">
          <span>{{ applyServerVM.useMonth }} 个月</span>
        </el-form-item>
        <el-form-item label="到期处理">
          <span>{{ applyServerVM.deadlineTypeDesc }}</span>
        </el-form-item>
        <el-form-item label="申请原因">
          <span>{{ applyServerVM.applyReason }}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          <span>{{ applyServerVM.applyTime }}</span>
        </el-form-item>
        <el-form-item label="审核者">
          <span>{{ applyServerVM.auditionUser }}</span>
        </el-form-item>
        <el-form-item label="审核时间">
          <span>{{ applyServerVM.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ applyServerVM.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 延期云服务器 -->
      <el-form ref="form" label-width="auto" v-if="isApplyDeferredDetail">
        <el-form-item label="工单类型">
          <span>{{ applyDeferredDetail.workOrderTypeDesc }}</span>
        </el-form-item>
        <el-form-item label="工单对象">
          <span>{{ applyDeferredDetail.workOrderTarget }}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{ applyDeferredDetail.statusDesc }}</span>
        </el-form-item>
        <el-form-item label="原到期时间">
          <span>{{ applyDeferredDetail.oldDeadlineTime }}</span>
        </el-form-item>
        <el-form-item label="延期时间">
          <span>{{ applyDeferredDetail.newDeadlineTime }}</span>
        </el-form-item>
        <el-form-item label="申请原因">
          <span>{{ applyDeferredDetail.applyReason }}</span>
        </el-form-item>
        <el-form-item label="申请时间">
          <span>{{ applyDeferredDetail.applyTime }}</span>
        </el-form-item>
        <el-form-item label="审核者">
          <span>{{ applyDeferredDetail.auditionUser }}</span>
        </el-form-item>
        <el-form-item label="审核时间">
          <span>{{ applyDeferredDetail.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ applyDeferredDetail.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 注册用户 -->
      <el-form ref="form" label-width="auto" v-if="isRegisterUserDetail">
        <el-form-item label="工单类型">
          <span>{{ registerUserDetail.workOrderTypeDesc }}</span>
        </el-form-item>
        <el-form-item label="工单对象">
          <span>{{ registerUserDetail.workOrderTarget }}</span>
        </el-form-item>
        <el-form-item label="工单状态">
          <span>{{ registerUserDetail.statusDesc }}</span>
        </el-form-item>
        <el-form-item label="真实姓名">
          <span>{{ registerUserDetail.realName }}</span>
        </el-form-item>
        <el-form-item label="密码">
          <span>*********</span>
        </el-form-item>
        <el-form-item label="组织">
          <span>{{ registerUserDetail.organizationName }}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{ registerUserDetail.mobile }}</span>
        </el-form-item>
        <el-form-item label="原因">
          <span>{{ registerUserDetail.applyReason }}</span>
        </el-form-item>
        <el-form-item label="审核者">
          <span>{{ registerUserDetail.auditionUser }}</span>
        </el-form-item>
        <el-form-item label="审核时间">
          <span>{{ registerUserDetail.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ registerUserDetail.auditOpinion }}</span>
        </el-form-item>
      </el-form>
      <!-- 修改账号 -->
      <el-form ref="form" label-width="auto" v-if="isUpdateUserDetail">
        <el-form-item label="工单类型">
          <span>{{ updateUserDetail.workOrderTypeDesc }}</span>
        </el-form-item>
        <el-form-item label="工单对象">
          <span>{{ updateUserDetail.workOrderTarget }}</span>
        </el-form-item>
        <el-form-item label="工单状态">
          <span>{{ updateUserDetail.statusDesc }}</span>
        </el-form-item>
        <el-form-item label="真实姓名">
          <span>{{ updateUserDetail.realName }}</span>
        </el-form-item>
        <el-form-item label="新真实姓名">
          <span class="special">{{ updateUserDetail.newRealName }}</span>
        </el-form-item>
        <el-form-item label="密码">
          <span>*********</span>
        </el-form-item>
        <!-- <el-form-item label="组织">
        <span>{{updateUserDetail.organizationName}}</span>
      </el-form-item> -->
        <el-form-item label="手机号">
          <span>{{ updateUserDetail.mobile }}</span>
        </el-form-item>
        <el-form-item label="原因">
          <span>{{ updateUserDetail.applyReason }}</span>
        </el-form-item>
        <el-form-item label="审核者">
          <span>{{ updateUserDetail.auditionUser }}</span>
        </el-form-item>
        <el-form-item label="审核时间">
          <span>{{ updateUserDetail.auditionTime }}</span>
        </el-form-item>
        <!-- 审核意见 -->
        <el-form-item :label="$t('workOrder.reviewComments')">
          <span>{{ updateUserDetail.auditOpinion }}</span>
        </el-form-item>
      </el-form>
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
} from "@/api/workOrder";
import ipsetDeiatl from "./ipsetDeiatl";

export default {
  name: "WorkDetail",
  components: { ipsetDeiatl },
  data() {
    return {
      workOrderId: this.$route.params.id,
      type: this.$route.params.type,
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
    };
  },
  created() {
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
  },
};
</script>

<style lang="scss">
.workDetail {
  // @include formStyle;
  margin: 0;
  display: flex;
  flex: 1;
  height: 0px;
  flex-direction: column;
  .workDetail-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .el-form > .el-form-item {
      margin-bottom: 5px !important;
    }

    h3 {
      margin: 0;
      margin-bottom: 15px;
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