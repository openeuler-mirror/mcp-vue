<template>
  <el-drawer
    size="900px"
    :title="$t('externalCloud.vmList.migrationMc')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseTransfer"
  >
    <div class="drawer-content" v-loading="drawLoading">
      <div class="create-new-form-steps">
        <el-steps :active="activestep" class="kcp-steps">
          <el-step :title="$t('resourceMgr.clusterBaseInfo')"></el-step>
          <el-step :title="$t('resourceMgr.clusterSettingInfo')"></el-step>
        </el-steps>
      </div>
      <div v-show="activestep == 0" class="drawer-body-content">
        <el-form
          ref="editForm"
          label-position="left"
          label-width="90px"
          :model="form"
          :rules="rules"
        >
          <!-- 名称 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.name')"
            prop="targetServerName"
          >
            <el-input v-model="form.targetServerName"></el-input>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.description')"
            prop="targetServerDescription"
          >
            <el-input
              v-model="form.targetServerDescription"
              :maxlength="100"
              show-word-limit
              type="text"
            ></el-input>
          </el-form-item>
          <!--物理集群-->
          <el-form-item
            :label="$t('externalCloud.vmOperate.physicalCluster')"
            prop="targetRunningCluster"
          >
            <el-select
              v-model="form.targetRunningCluster"
              @change="changeCluster"
              :placeholder="
                $t('common.pleaseSelsect') +
                $t('externalCloud.vmOperate.physicalCluster')
              "
            >
              <el-option
                v-for="(item, index) in clusterArr"
                :key="index"
                :label="item.clusterName"
                :value="item.clusterId"
                :disabled="item.status === 'OFFLINE'"
                >{{ item.clusterName }}</el-option
              >
            </el-select>
          </el-form-item>
          <!--自动安置-->
          <el-form-item
            :label="$t('externalCloud.vmOperate.autoPlace')"
            prop="isAutoPosition"
          >
            <el-switch
              class="switch"
              :active-text="$t('common.open')"
              :active-value="true"
              :inactive-text="$t('common.close')"
              :inactive-value="false"
              v-model="form.isAutoPosition"
              @change="setDefaultForm"
            >
            </el-switch>
          </el-form-item>
          <!--计算资源-->
          <el-form-item
            v-if="!form.isAutoPosition"
            :label="$t('externalCloud.vmOperate.computingRes')"
            prop="computeResourceType"
          >
            <el-radio-group
              v-model="form.computeResourceType"
              class="create-radio-group"
              size="medium"
            >
              <!-- 目前暂定自动 后面等待集群 -->
              <el-radio label="AUTO">{{
                $t("externalCloud.vmOperate.automatic")
              }}</el-radio>
              <!-- <el-radio :label="2">自定义</el-radio>
              <el-radio :label="3">绑定资源</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="!form.isAutoPosition"
            :label="$t('externalCloud.vmOperate.storageLocation')"
            prop="storageLocationId"
          >
            <el-select
              v-model="form.storageLocationId"
              :placeholder="
                $t('common.pleaseSelsect') +
                $t('externalCloud.vmOperate.storageLocation')
              "
            >
              <el-option
                v-for="(item, index) in locationArr"
                :key="index"
                :label="item.name"
                :value="item.id"
                >{{ item.name }}</el-option
              >
            </el-select>
          </el-form-item>
          <!--迁移方式-->
          <el-form-item
            :label="$t('externalCloud.vmOperate.modeMig')"
            prop="migrateType"
          >
            <el-select
              value="SHUTDOWN_AFTER_MIGRATED"
              :placeholder="
                $t('common.pleaseSelsect') +
                $t('externalCloud.vmOperate.modeMig')
              "
              disabled
            >
              <el-option
                :label="$t('externalCloud.vmOperate.shutDownTips')"
                value="SHUTDOWN_AFTER_MIGRATED"
                >{{ $t("externalCloud.vmOperate.stopTips") }}</el-option
              >
            </el-select>
            <tips :tipsText="$t('externalCloud.transVmTips1')" />
          </el-form-item>
          <!--迁入后启动-->
          <el-form-item
            :label="$t('externalCloud.vmOperate.startMoving')"
            prop="isAutoStartTargetServer"
          >
            <el-switch
              class="switch"
              :active-text="$t('common.open')"
              :active-value="true"
              :inactive-text="$t('common.close')"
              :inactive-value="false"
              v-model="form.isAutoStartTargetServer"
            >
            </el-switch>
            <tips :tipsText="$t('externalCloud.transVmTips2')" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="activestep == 1" class="drawer-body-content">
        <el-form
          ref="netForm"
          label-position="left"
          label-width="70px"
          :model="form2"
        >
          <!-- cpu  -->
          <el-form-item label="CPU:" prop="cpuCore"
            >{{ form.cpuCore }}{{ $t("externalCloud.vmOperate.core") }}
          </el-form-item>
          <!-- 内存 -->
          <el-form-item
            :label="$t('externalCloud.vmOperate.memory') + ':'"
            prop="memorySize"
            >{{ form.memorySize }}GB
          </el-form-item>
          <!-- 磁盘 -->
          <el-form-item
            v-for="(item, index) in form.diskCapacitys"
            :key="index"
            :label="$t('externalCloud.vmOperate.disk') + (index + 1) + ':'"
            >{{ item.diskCapacity }}GB
          </el-form-item>
          <el-form-item
            :label="$t('common.network')"
            v-if="form2.networkSpecificationIds.length === 0"
          >
            <!-- 该云服务器没有申请，请按需添加网卡 -->
            <span>{{ $t("externalCloud.vmOperate.addNicTips") }}</span>
            <i class="el-icon-circle-plus-outline" @click="addNetworkItem" />
          </el-form-item>
          <!-- 网卡 -->
          <el-form-item
            v-for="(item, index) in form2.networkSpecificationIds"
            :key="index + 'networkSpecificationIds'"
            :label="$t('externalCloud.vmOperate.netCard') + ':' + (index + 1)"
            :prop="'networkSpecificationIds.' + index + '.name'"
            :rules="rules.netCard"
          >
            <el-input
              disabled
              v-model="form2.networkSpecificationIds[index].name"
            >
              <el-button slot="append" @click="changeSelectNetwork(index)">
                {{ $t("common.select") }}
              </el-button>
            </el-input>
            <i
              class="el-icon-remove-outline"
              @click="deleteNetworkItem(index)"
            />

            <i
              v-if="index === form2.networkSpecificationIds.length - 1"
              class="el-icon-circle-plus-outline"
              @click="addNetworkItem"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-foot">
        <el-button v-if="activestep == 1" @click="handleConfirm(-1)">
          {{ $t("common.previous") }}
        </el-button>
        <el-button
          type="primary"
          v-if="activestep == 0"
          @click="handleConfirm(1)"
        >
          {{ $t("common.nextStep") }}
        </el-button>
        <el-button
          type="primary"
          @click="handleConfirm(0)"
          v-if="activestep == 1"
        >
          {{ $t("common.confirmation") }}
        </el-button>
        <el-button @click="handleCloseTransfer">{{
          $t("common.cancel")
        }}</el-button>
      </div>
    </div>
    <getNetworkCardBox
      :visible.sync="showNetSpec"
      :clusterId="form.targetRunningCluster"
      :selectData="netCardData"
      @selectChange="selectNetCardChange"
    ></getNetworkCardBox>
  </el-drawer>
</template>
<script>
import {
  getClusterList,
  getClusterPageStorageList,
  getClusterResourceList,
  getTranseferDetail,
  handelSubmitTransfer,
} from "@/api/vcenter";
import getNetworkCardBox from "@/components/getNetworkCardBox";
import validate from "@/utils/validate";
import tips from "@/components/tips";
export default {
  name: "transferVmBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    choosenData: {
      type: Object,
      default: () => ({}),
    },
    modelType: {
      type: String,
      default: "",
    },
    rowData: {
      type: Object,
      default: "",
    },
  },
  components: { getNetworkCardBox, tips },
  data() {
    return {
      activestep: 0,
      clusterArr: [],
      locationArr: [],
      netCardData: [],
      drawerVisible: this.visible,
      selectNetIndex: null,
      vcenterId: this.$route.params.id,
      showNetSpec: false,
      form: {
        sourceServerName: "",
        vcenterId: this.vcenterId,
        isAutoPosition: false,
        sourceServerPowerStatus: 0, //源虚拟机电源状态-可不用，后台动态获取，前端默认给个0
        computeResourceType: "AUTO",
        migrateType: "SHUTDOWN_AFTER_MIGRATED",
        isAutoStartTargetServer: true,
      },
      form2: {
        networkSpecificationIds: [{ name: "", id: "" }],
      },
      drawLoading: false,
      rules: {
        targetServerName: [
          // 名称不能为空
          {
            required: true,
            message:
              this.$t("externalCloud.vcenter.name") + this.$t("common.notNull"),
            trigger: "blur",
          },
          // 名称长度应控制在 2 ~ 32 个字符
          {
            min: 2,
            max: 32,
            message:
              this.$t("externalCloud.vcenter.name") +
              this.$t("externalCloud.vcenter.nameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.vmName"), // "输入有误",
            validator: validate.validateCharNum,
          },
        ],
        targetRunningCluster: [
          {
            required: true,
            message: this.$t("externalCloud.vmOperate.phyTips"),
            trigger: "blur",
          },
        ],
        storageLocationId: [
          {
            required: true,
            message: this.$t("externalCloud.vmOperate.storageTips"),
            trigger: "blur",
          },
        ],
        netCard: [
          {
            required: true,
            message: this.$t("externalCloud.vmOperate.nicTips"),
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.$set(this.form, "serverName", this.rowData.serverName);
        this.$set(this.form, "targetServerName", this.rowData.serverName);
        this.$set(
          this.form,
          "targetServerDescription",
          this.rowData.description
        );

        this.intData();
      }
    },
  },
  methods: {
    intData() {
      const { serverName, vcenterServerIdentifier } = this.rowData;
      this.form.sourceServerName = serverName;
      this.intcluster();
    },
    intcluster() {
      this.drawLoading = true;
      getClusterList()
        .then((res) => {
          this.clusterArr = res;
          // 下面接口需要预设一个值，但是袁野懒得屏蔽就前端处理下数据
          const canselectArr = res.filter((e) => e.status !== "OFFLINE");
          canselectArr.length > 0
            ? (this.form.targetRunningCluster = canselectArr[0].clusterId)
            : "";
          this.changeCluster();
        })
        .finally(() => {
          this.drawLoading = false;
        });
    },
    changeCluster() {
      this.form.storageLocationId = "";
      Promise.all([this.intlocation(), this.getTranseferDetail()]).finally(
        (res) => {
          this.drawLoading = false;
        }
      );
    },
    intlocation() {
      const clusterId = this.form.targetRunningCluster;
      getClusterPageStorageList({ clusterId }).then((res) => {
        this.locationArr = res;
      });
    },
    //第二步详情数据
    getTranseferDetail() {
      const { serverName } = this.rowData;
      getTranseferDetail({
        vcenterId: this.vcenterId,
        serverName,
      }).then((res) => {
        const { cpuCores, memorySize, disks } = res;
        this.form = {
          ...this.form,
          cpuCore: cpuCores,
          memorySize,
          diskCapacitys: disks,
        };
      });
    },

    // 提交
    handleConfirm(step) {
      switch (step) {
        case 0: // 确认
          this.$refs.netForm.validate((valid) => {
            if (valid) {
              this.commitCreate();
            }
          });
          break;
        case -1: // 上一步
          this.activestep = this.activestep + step;
          break;
        case 1:
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.activestep += 1;
            }
          });
          break;
        default:
          this.activestep = 0;
          break;
      }
    },
    setDefaultForm(e) {
      if (e) {
        this.$set(this.form, "storageLocationId", this.locationArr[0].id);
      }
    },
    commitCreate() {
      /**
       * vcenterId 列表
       * sourceServerName 源虚拟机名称
       * sourceServerPowerStatus 源虚拟机电源状态-可不用，后台动态获取，前端默认给个0
       *
       * targetServerName	迁移至mc后的虚拟机名称
       * targetServerDescription 迁移至mc后的虚拟机描述
       * isAutoPosition 是否自动安置
       *
       * targetRunningCluster 运行集群id
       * computeResourceType 计算资源类型
       * bindResource 绑定资源组名称 不传
       * runningHost 运行主机
       * storageLocationId 存储位置id
       * migrateType 迁移类型
       * isAutoStartTargetServer  是否自动启动MC虚拟机
       *
       *
       * cpuCore cpu核数
       * memorySize 内存大小
       * diskCapacitys 磁盘大小数组
       * networkSpecificationIds 网络规格数组
       **/

      const diskCapacitys = this.form.diskCapacitys.map(
        (res) => res.diskCapacity
      );
      const networkSpecificationIds = this.form2.networkSpecificationIds.map(
        (res) => res.id
      );
      this.drawerLoading = true;
      handelSubmitTransfer({
        ...this.form,
        vcenterId: this.vcenterId,
        diskCapacitys,
        networkSpecificationIds,
      })
        .then((res) => {
          this.$message.success(this.$t("externalCloud.vmOperate.offlineMig"));
          this.handleCloseTransfer();
          this.$emit("freshTable");
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    changeSelectNetwork(i) {
      this.selectNetIndex = i;
      this.showNetSpec = true;
    },
    deleteNetworkItem(i) {
      this.form2.networkSpecificationIds.splice(i, 1);
    },
    addNetworkItem() {
      this.form2.networkSpecificationIds.push({
        name: "",
        id: "",
      });
    },
    selectNetCardChange(e) {
      this.locationData = e[0];
      const { networkName, networkSpecId } = e[0];
      this.$set(
        this.form2.networkSpecificationIds[this.selectNetIndex],
        "name",
        networkName
      );
      this.$set(
        this.form2.networkSpecificationIds[this.selectNetIndex],
        "id",
        networkSpecId
      );
      this.$forceUpdate();
    },
    handleCloseTransfer() {
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.create-new-form-steps {
  padding: 20px 30px 0;
}
.drawer-body-content {
  @include formStyle;
}
</style>
