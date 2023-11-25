<template>
  <el-drawer
    size="900px"
    :title="$t('reliableCenter.backupSiteDRRecovery')"
    direction="rtl"
    custom-class=""
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <el-form
          ref="form"
          label-width="110px"
          label-position="left"
          :model="form"
        >
          <el-form-item
            :label="$t('reliableCenter.recoveryMethod')"
            prop="reWay"
            required
          >
            <el-radio-group v-model="form.reWay">
              <el-radio :label="1">{{
                $t("reliableCenter.plannedRecovery")
              }}</el-radio>
              <el-radio :label="0">{{
                $t("reliableCenter.DRRecovery")
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="top-pick">
            <div class="pick-content">
              <img
                style="width: 100%"
                v-if="form.reWay === 1"
                src="@/assets/hnkylin/main2sleaver.png"
                alt=""
              />
              <img
                v-if="form.reWay === 0"
                src="@/assets/hnkylin/slaverMain.png"
                alt=""
              />
              <img
                v-if="form.reWay === 0"
                src="@/assets/hnkylin/slaverSlaver.png"
                alt=""
              />
            </div>
            <p v-if="form.reWay === 1">
              <!--注：计划内恢复会立即关闭主站点云服务器，将最新数据同步到备站点，数据同步完成后，自动在备站点拉起容灾备机。 -->

              {{ $t("reliableCenter.startTestNote") }}
              <span class="red-text">{{
                $t("reliableCenter.startTestNote1")
              }}</span>
              {{ $t("reliableCenter.startTestNote2") }}
            </p>
            <p v-else>
              {{ $t("reliableCenter.endTestNote") }}
              <span class="red-text">{{
                $t("reliableCenter.endTestNote2")
              }}</span>
            </p>
          </div>

          <el-form-item
            :label="$t('reliableCenter.recoveryServer')"
            prop="machineName"
            required
          >
            <!-- planMachineId -->
            <el-input v-model="form.machineName" disabled></el-input>
          </el-form-item>
          <!-- slaveClusterId -->
          <el-form-item
            :label="$t('reliableCenter.recoveryToBackup')"
            prop="slaveSiteName"
          >
            <el-input v-model="form.slaveSiteName" disabled></el-input>
          </el-form-item>
          <!-- recoverPointId -->
          <el-form-item
            :label="$t('reliableCenter.recoveryPoint')"
            v-if="form.reWay === 0"
            prop="recoverPointName"
            :rules="{
              required: true,
              message: $t('reliableCenter.recoveryPoint'),
              trigger: 'change',
            }"
          >
            <el-input v-model="form.recoverPointName" readonly disabled>
            </el-input>
            <el-button @click="handelShowRecoverModel">{{
              $t("reliableCenter.choose")
            }}</el-button>
          </el-form-item>
          <!-- serverClusterType -->
          <el-form-item
            :label="$t('reliableCenter.runLocation')"
            prop="serverClusterType"
          >
            <el-radio-group v-model="form.serverClusterType">
              <el-radio label="AUTO">{{ $t("reliableCenter.auto") }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- storageLocationId -->
          <el-form-item
            :label="$t('reliableCenter.storageLocation')"
            prop="storageLocationName"
            :rules="{
              required: true,
              message: $t('reliableCenter.chooseStorageLocation'),
              trigger: 'change',
            }"
          >
            <el-input v-model="form.storageLocationName" readonly disabled>
            </el-input>
            <el-button @click="handelShowLocalModel">{{
              $t("reliableCenter.choose")
            }}</el-button>
          </el-form-item>

          <el-form-item
            v-for="(item, index) in netWorkArr"
            :key="index"
            :label="
              $t('reliableCenter.networkInterface') + (index === 0 ? '' : index)
            "
            :prop="`netWorkArr[${index}].name`"
            :rules="{
              required: true,
              message: $t('reliableCenter.chooseNetworkInterfaceData'),
              trigger: 'change',
            }"
          >
            <el-input v-model="form.netWorkArr[index].name" readonly disabled>
            </el-input>
            <el-button @click="handelShowNetCard(index)">{{
              $t("reliableCenter.choose")
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-foot">
        <el-button type="primary" @click="handelSubmit">{{
          $t("externalCloud.vmOperate.sure")
        }}</el-button>
        <el-button @click="handelClose">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
    <!--  -->
    <recoverPlaceModel
      :clusterId="selectClusterId"
      :planMachineId="selectPlanMachineId"
      :visible.sync="showRecoverModel"
      :selectRowId="form.recoverPointId"
      selectRowKey="recoverPointId"
      @selectChange="recoverSelectChange"
    ></recoverPlaceModel>
    <getStorageBox
      :visible.sync="showStorage"
      :clusterId="selectClusterId"
      :selectData="locationData"
      @selectChange="selectStorageChange"
    />
    <getNetworkCardBox
      :visible.sync="showNetCard"
      :clusterId="selectClusterId"
      :selectData="netCardData"
      @selectChange="selectNetCardChange"
    ></getNetworkCardBox>
  </el-drawer>
</template>
<script>
import {
  handelPlanRecover,
  handelfailureRecover,
  getBackupDataList,
  handelStartDrill,
  handelRpoBackupFile,
} from "@/api/remoteDisasterRecovery";
import recoverPlaceModel from "../components/recoverPlaceModel";
import getStorageBox from "../components/getStorageBox";
import getNetworkCardBox from "../components/getNetworkCardBox";
import { serverVmNetwork } from "@/api/serverVm";
export default {
  name: "sleaverSiteRecovery",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default: null,
    },
  },
  components: { recoverPlaceModel, getStorageBox, getNetworkCardBox },
  data() {
    return {
      drawerVisible: this.visible,
      drawerLoading: false,
      showStorage: false,
      showRecoverModel: false,
      showNetCard: false,
      selectPlanMachineId: "",
      clusterId: "",
      selectClusterId: "",
      serverVmUuid: "",
      netWorkArr: [],
      rewayDisable: null,
      selectNetIndex: null,
      locationData: {},
      netCardData: {},
      form: {
        reWay: 1,
        vmName: "",
        netWorkArr: [{ name: "", id: "" }],
        serverClusterType: "AUTO",
      },
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        const {
          slaveSiteName,
          planMachineId,
          slaveClusterId,
          machineName,
          machineUuid,
          materClusterId,
        } = this.rowData;
        this.clusterId = materClusterId;
        this.form.machineName = machineName;
        this.form.slaveSiteName = slaveSiteName;
        this.serverVmUuid = machineUuid;
        this.selectClusterId = slaveClusterId;
        this.selectPlanMachineId = planMachineId;
        //根据传入数据判断顶部选择
        this.setTypeVal();
        this.getServerVmNetwork();
      }
    },
  },
  methods: {
    setTypeVal() {
      const { status } = this.rowData;
      switch (status) {
        case "NORMAL":
          //  保护中 只有开始没有结束
          this.form.reWay = 1;
          this.rewayDisable = 0;
          break;
        case "DRILL":
          //  保护中 只有结束没有开始
          this.form.reWay = 0;
          this.rewayDisable = 1;
          break;
      }
    },
    getServerVmNetwork() {
      this.drawerLoading = true;
      serverVmNetwork({
        clusterId: this.clusterId,
        serverVmUuid: this.serverVmUuid,
      })
        .then((res) => {
          this.netWorkArr = res;
          const netCardArr = [];
          res.forEach((e) => {
            netCardArr.push({ name: null, id: null });
          });
          this.$set(this.form, "netWorkArr", netCardArr);
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    handelClose() {
      this.$refs.form.resetFields(); //初始化数据
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    //提交容灾演练
    handelSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 编辑信息
          const { serverClusterType, recoverPointId, storageLocationId } =
            this.form;
          const { planMachineId } = this.rowData;
          const params = {
            planMachineId,
            recoverPointId,
            serverClusterType,
            storageLocationId,
            //暂时需要等待主机集群确定后
            selectClusterUuid: "",
            networkIdList: this.getNetCardList(),
          };
          this.drawerLoading = true;
          this.form.reWay === 1
            ? this.submitHandelPlanRecover(params)
            : this.submitHandelfailureRecover(params);
        } else {
          return false;
        }
      });
    },
    getNetCardList() {
      const idArr = this.form.netWorkArr.map((e) => e.id);
      return idArr;
    },
    handleSelectione(e) {
      this.selectData = e;
    },
    getOtherText(status) {
      const rowStatus = {
        NONEXIST: this.$t("reliableCenter.notExist"),
        NORMAL: this.$t("reliableCenter.normal"),
        RPOING: this.$t("reliableCenter.RPOSyncing"),
        DELETING: this.$t("reliableCenter.deleting"),
      };
      return rowStatus[status];
    },
    handelShowRecoverModel() {
      this.showRecoverModel = true;
    },
    handelShowLocalModel() {
      this.showStorage = true;
    },
    handelShowNetCard(index) {
      this.selectNetIndex = index;
      this.showNetCard = true;
    },
    recoverSelectChange(e) {
      const { backupName, recoverPointId } = e[0];
      this.$set(this, "form", {
        ...this.form,
        recoverPointId: recoverPointId,
        recoverPointName: backupName,
      });
    },
    selectStorageChange(e) {
      this.locationData = e[0];
      const { name, id } = e[0];
      this.$set(this, "form", {
        ...this.form,
        storageLocationName: name,
        storageLocationId: id,
      });
    },
    selectNetCardChange(e) {
      this.locationData = e[0];
      const { networkName, networkSpecId } = e[0];
      const newArr = this.form.netWorkArr;
      newArr[this.selectNetIndex] = {
        name: networkName,
        id: networkSpecId,
      };
      this.$set(this.form, "netWorkArr", newArr);
    },
    submitHandelPlanRecover(params) {
      //计划内备份恢复
      handelPlanRecover(params)
        .then((res) => {
          this.$message.success(
            this.$t("reliableCenter.plannedRecoverySubmitted")
          );
          this.$emit("freshTable");
          this.drawerLoading = false;
          this.handelClose();
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    submitHandelfailureRecover(params) {
      //灾难后恢复备份恢复
      handelfailureRecover(params)
        .then((res) => {
          this.$message.success(this.$t("reliableCenter.DRRecoverySubmitted"));
          this.$emit("freshTable");
          this.drawerLoading = false;
          this.handelClose();
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.top-title {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 15px;
}
.top-pick {
  width: 500px;
  height: 205px;
  background-color: rgba(245, 247, 250, 1);
  padding: 15px;
  margin-left: 100px;
  margin-bottom: 18px;
  .pick-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  img {
    width: 180px;
  }
  .red-text {
    color: #f56c6c;
  }
  p {
    font-size: 13px;
    margin-top: 20px;
  }
}
</style>
