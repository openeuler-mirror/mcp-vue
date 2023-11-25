<template>
  <el-drawer
    size="900px"
    :title="$t('reliableCenter.DRTest')"
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
              <el-radio :label="1" :disabled="rewayDisable === 1">{{
                $t("reliableCenter.startTest")
              }}</el-radio>
              <el-radio :label="0" :disabled="rewayDisable === 0">{{
                $t("reliableCenter.endTest")
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="top-pick">
            <div class="pick-content">
              <img src="@/assets/hnkylin/main-server.png" alt="" />
              <img
                v-if="form.reWay === 1"
                src="@/assets/hnkylin/online-brz.png"
                alt=""
              />
              <img v-else src="@/assets/hnkylin/cant-brz.png" alt="" />
            </div>
            <p v-if="form.reWay === 1">
              {{ $t("reliableCenter.startDrNote") }}
            </p>
            <p v-else>
              {{ $t("reliableCenter.endDrNote")
              }}<span class="red-text">{{
                $t("reliableCenter.endDrNote2")
              }}</span>
            </p>
          </div>

          <el-form-item
            :label="$t('reliableCenter.testServer')"
            prop="machineName"
            required
          >
            <!-- planMachineId -->
            <el-input v-model="form.machineName" disabled></el-input>
          </el-form-item>
          <template v-if="form.reWay === 1">
            <!-- slaveClusterId -->
            <el-form-item
              :label="$t('reliableCenter.testToBackup')"
              prop="slaveSiteName"
            >
              <el-input v-model="form.slaveSiteName" disabled></el-input>
            </el-form-item>
            <!-- recoverPointId -->
            <el-form-item
              :label="$t('reliableCenter.testRecoveryPoint')"
              prop="recoverPointName"
              :rules="{
                required: true,
                message: $t('reliableCenter.chooseRecoveryPoint'),
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
                <el-radio label="AUTO">{{
                  $t("reliableCenter.auto")
                }}</el-radio>
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
                $t('reliableCenter.networkInterface') +
                (index === 0 ? '' : index)
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
          </template>
        </el-form>
      </div>
      <div class="drawer-foot footBtn">
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
  getBackupDataList,
  handelStartDrill,
  handelEndDrill,
  handelRpoBackupFile,
} from "@/api/remoteDisasterRecovery";
import recoverPlaceModel from "../components/recoverPlaceModel";
import getStorageBox from "../components/getStorageBox";
import getNetworkCardBox from "../components/getNetworkCardBox";
import { serverVmNetwork } from "@/api/serverVm";
export default {
  name: "disasterRecoveryDrill",
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
      if (this.form.reWay === 1) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 编辑信息
            const { serverClusterType, recoverPointId, storageLocationId } =
              this.form;
            const { planMachineId, slaveClusterId } = this.rowData;
            const params = {
              planMachineId,
              slaveClusterId,
              recoverPointId,
              serverClusterType,
              storageLocationId,
              //暂时需要等待主机集群确定后
              selectClusterUuid: "",
              networkIdList: this.getNetCardList(),
            };
            this.drawerLoading = true;
            handelStartDrill(params)
              .then((res) => {
                this.$message.success(this.$t("reliableCenter.testSubmitted"));
                this.$emit("freshTable");
                this.drawerLoading = false;
                this.handelClose();
              })
              .finally(() => {
                this.drawerLoading = false;
              });
          } else {
            return false;
          }
        });
      } else {
        handelEndDrill({ planMachineId: this.rowData.planMachineId })
          .then((res) => {
            this.$message.success(this.$t("reliableCenter.endTestSubmitted"));
            this.$emit("freshTable");
            this.drawerLoading = false;
            this.handelClose();
          })
          .finally(() => {
            this.drawerLoading = false;
          });
      }
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
