<template>
  <el-drawer
    size="900px"
    :title="drawerTitle"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content-steps">
        <el-steps :active="activestep" class="kcp-steps">
          <el-step :title="$t('reliableCenter.basicInfo')"></el-step>
          <el-step :title="$t('reliableCenter.drConfig')"></el-step>
          <el-step :title="$t('reliableCenter.definiteInfo')"></el-step>
        </el-steps>
      </div>
      <div v-if="activestep == 0" class="drawer-body-content app-content">
        <el-form
          ref="createForm"
          label-width="auto"
          :model="createForm"
          :rules="rulesTemplate"
        >
          <el-form-item
            :label="$t('reliableCenter.drPolicyName')"
            prop="planName"
          >
            <el-input
              :placeholder="$t('reliableCenter.pleaseEnter')"
              v-model="createForm.planName"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            :label="$t('reliableCenter.primarySite')"
            prop="masterSiteId"
          >
            <el-select
              v-model="createForm.masterSiteId"
              :disabled="this.type === 'edit'"
              clearable
              @change="changeSite1Select"
            >
              <el-option
                v-for="(item, index) in selectData"
                :key="'site1' + index"
                :disabled="item.site1Disabled"
                :label="item.name"
                :value="item.siteId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('reliableCenter.secondarySite')"
            prop="slaveSiteId"
          >
            <el-select
              v-model="createForm.slaveSiteId"
              :disabled="this.type === 'edit'"
              clearable
              @change="changeSite2Select"
            >
              <el-option
                v-for="(item, index) in selectData"
                :key="'site2' + index"
                :disabled="item.site2Disabled"
                :label="item.name"
                :value="item.siteId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('reliableCenter.selectCloudServer')"
            prop="selectMachineList"
          >
            <el-select
              multiple
              collapse-tags
              class="serverSelect"
              :value="selectModel"
            >
              <el-option
                v-for="(item, index) in selectMachineList"
                :key="item.machineUuid"
                :label="item.machineName"
                :value="item.machineUuid"
              />
            </el-select>
            <el-button
              :disabled="!createForm.masterSiteId"
              @click="selectServerVMs"
              >{{ $t("reliableCenter.choose") }}</el-button
            >
          </el-form-item>
          <div class="dr-explain-content">
            <p class="explain-title">
              {{ $t("reliableCenter.schematicDiagram") }}
            </p>
            <img
              class="dr-explain"
              src="../../../../assets/hnkylin/dr-explain.png"
              alt=""
              srcset=""
            />
          </div>
        </el-form>
      </div>
      <div v-if="activestep == 1" class="drawer-body-content">
        <el-form
          ref="createForm2"
          label-width="auto"
          :model="createForm2"
          :rules="rulesTemplate2"
        >
          <div class="date-tips">
            {{ $t("reliableCenter.primarySiteLocalBackup") }}
          </div>
          <div class="form-content">
            <!-- 主备份站点 -->
            <el-form-item
              :label="$t('reliableCenter.backupLoc')"
              prop="masterBackupServerPath"
            >
              <el-input
                :disabled="this.type === 'edit'"
                :placeholder="$t('reliableCenter.pleaseEnter')"
                readonly
                v-model="createForm2.masterBackupServerPath"
              >
              </el-input>
              <el-button
                :disabled="this.type === 'edit'"
                @click="selectLocal('masterSiteId')"
                >{{ $t("reliableCenter.choose") }}</el-button
              >
            </el-form-item>
            <!-- 备份频率 -->
            <el-form-item
              :label="$t('reliableCenter.backupFreq')"
              prop="backupCycleType"
            >
              <el-radio-group v-model="createForm2.backupCycleType">
                <el-radio label="HOUR">{{
                  $t("reliableCenter.hour")
                }}</el-radio>
                <el-radio label="DAY">{{ $t("reliableCenter.day") }}</el-radio>
                <el-radio label="WEEK">{{
                  $t("reliableCenter.weeks")
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 周期小时 -->
            <template v-if="createForm2.backupCycleType === 'HOUR'">
              <el-form-item
                :label="$t('reliableCenter.backupCycle')"
                prop="backupCycleHour"
              >
                <el-select
                  v-model="createForm2.backupCycleHour"
                  :placeholder="$t('common.select')"
                  @change="selecCycleChange"
                >
                  <el-option
                    v-for="item in backupStepoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="$t('reliableCenter.hourBackupTips')"
                  placement="top"
                >
                  <i class="kcp-infoQues icon-infoQues"></i>
                </el-tooltip>
              </el-form-item>
            </template>
            <!-- 周期天 -->
            <template v-if="createForm2.backupCycleType === 'DAY'">
              <el-form-item
                :label="$t('reliableCenter.backupPeriod')"
                class="group-date"
              >
                <el-col :span="5">
                  <el-form-item prop="dayStartTime">
                    <el-time-picker
                      :placeholder="$t('reliableCenter.startTime')"
                      format="HH:mm"
                      value-format="HH:mm"
                      v-model="createForm2.dayStartTime"
                      style="width: 100%"
                      @change="changeFrequencyForm($event, 2)"
                    ></el-time-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="5">
                  <el-form-item prop="dayEndTime">
                    <el-time-picker
                      format="HH:mm"
                      value-format="HH:mm"
                      :placeholder="$t('reliableCenter.endTime')"
                      v-model="createForm2.dayEndTime"
                      style="width: 100%"
                      @change="changeFrequencyForm($event, 2)"
                    ></el-time-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="3" v-if="nextDay"
                  >（{{ $t("reliableCenter.nextDay") }}）</el-col
                >
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="$t('reliableCenter.dayBackupTips')"
                  placement="top"
                >
                  <i class="kcp-infoQues icon-infoQues"></i>
                </el-tooltip>
              </el-form-item>
            </template>
            <!-- 周期天 -->
            <template v-if="createForm2.backupCycleType === 'WEEK'">
              <el-form-item
                :label="$t('reliableCenter.backupCycle')"
                prop="backupCycleWeek"
              >
                <el-select
                  v-model="createForm2.backupCycleWeek"
                  multiple
                  :placeholder="$t('common.select')"
                >
                  <el-option
                    v-for="item in selectWeekDaysoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('reliableCenter.backupStartTime')"
                prop="startTime"
              >
                <el-time-picker
                  v-model="createForm2.startTime"
                  format="HH:mm"
                  value-format="HH:mm"
                  :placeholder="$t('reliableCenter.arbitraryPointInTime')"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item
                :label="$t('reliableCenter.policyDuration')"
                prop="duration"
              >
                <el-input
                  :placeholder="$t('reliableCenter.pleaseEnter')"
                  v-only-num
                  v-model="createForm2.duration"
                >
                  <template slot="append">{{
                    $t("reliableCenter.hour")
                  }}</template>
                </el-input>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="$t('reliableCenter.weekBackupTips')"
                  placement="top"
                >
                  <i class="kcp-infoQues icon-infoQues"></i>
                </el-tooltip>
              </el-form-item>
            </template>
            <!-- 单台超时时长  与原型出入原因后端需要 -->
            <el-form-item
              :label="$t('reliableCenter.singleServerTimeoutDuration')"
              prop="singleBackupTimeout"
            >
              <el-input
                :placeholder="$t('reliableCenter.pleaseEnter')"
                v-only-num
                v-model="createForm2.singleBackupTimeout"
              >
                <template slot="append">{{
                  $t("reliableCenter.hour")
                }}</template>
              </el-input>
              <el-tooltip
                class="item"
                effect="light"
                :content="$t('reliableCenter.singleBackupTimeOut')"
                placement="top"
              >
                <i class="kcp-infoQues icon-infoQues"></i>
              </el-tooltip>
            </el-form-item>
            <!-- 备份份数 -->
            <el-form-item
              :label="$t('reliableCenter.backupCopy')"
              prop="retain"
            >
              <el-input v-only-num v-model="createForm2.retain"></el-input>
            </el-form-item>
          </div>
          <div class="date-tips">
            {{ $t("reliableCenter.secondarySiteRemoteDr") }}
          </div>

          <el-form-item
            :label="$t('reliableCenter.drLocation')"
            prop="slaveBackupServerPath"
          >
            <el-input
              :placeholder="$t('reliableCenter.pleaseEnter')"
              readonly
              :disabled="this.type === 'edit'"
              v-model="createForm2.slaveBackupServerPath"
            >
            </el-input>
            <el-button
              :disabled="this.type === 'edit'"
              @click="selectLocal('slaveSiteId')"
              >{{ $t("reliableCenter.choose") }}</el-button
            >
          </el-form-item>
          <el-form-item
            v-if="createForm2.backupCycleType === 'HOUR'"
            :label="$t('reliableCenter.drRpoPeriod')"
            prop="proCycle"
          >
            <el-select
              v-model="createForm2.proCycle"
              :placeholder="$t('common.select')"
              @change="proCycleChange"
            >
              <el-option
                v-for="item in proStepoptions"
                :key="item.value"
                :label="item.label"
                :disabled="item.disabled"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('reliableCenter.transmissionMode')"
            prop="rpoCompress"
          >
            <el-checkbox v-model="createForm2.rpoCompress">{{
              $t("reliableCenter.compressedTransmission")
            }}</el-checkbox>
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('reliableCenter.dataSyncCompressed')"
              placement="top"
            >
              <i class="kcp-infoQues icon-infoQues"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="activestep == 2" class="drawer-body-content">
        <div class="addInfor">
          <div class="add-infor-title">
            {{ $t("reliableCenter.basicInfo") }}
          </div>
          <div class="add-infor-content">
            <div>
              {{ $t("reliableCenter.drPolicyName") }}：{{ createForm.planName }}
            </div>
            <div>{{ $t("reliableCenter.primarySite") }}：{{ site1Name }}</div>
            <div>{{ $t("reliableCenter.secondarySite") }}：{{ site2Name }}</div>
            <div>
              {{ $t("reliableCenter.selectCloudServer") }}：{{
                getVmtext(selectMachineList)
              }}
            </div>
          </div>
        </div>
        <div class="addInfor">
          <div class="add-infor-title">
            {{ $t("reliableCenter.primarySiteBackupMethod") }}
          </div>
          <div class="add-infor-content">
            <div>
              {{ $t("reliableCenter.backupLoc") }}:{{
                createForm2.masterBackupServerPath
              }}
            </div>
            <div v-if="createForm2.backupCycleType !== 'DAY'">
              {{ $t("reliableCenter.backupCycle") }}:{{ getCycleData() }}
            </div>
            <div v-if="createForm2.backupCycleType === 'DAY'">
              {{ $t("reliableCenter.backupPeriod") }}:{{
                createForm2.dayStartTime
              }}{{ $t("common.to") }}{{ createForm2.dayEndTime
              }}{{ this.nextDay ? `(${$t("reliableCenter.nextDay")})` : "" }}
            </div>
            <div v-if="createForm2.backupCycleType === 'WEEK'">
              {{ $t("reliableCenter.backupStartTime") }}:{{
                createForm2.startTime
              }}
            </div>
            <div v-if="createForm2.backupCycleType === 'WEEK'">
              {{ $t("reliableCenter.policyDuration") }}:{{ createForm2.duration
              }}{{ $t("reliableCenter.hour") }}
            </div>
            <div>
              {{ $t("reliableCenter.singleServerTimeoutDuration") }}:{{
                createForm2.singleBackupTimeout + $t("reliableCenter.hour")
              }}
            </div>
            <div>
              {{ $t("reliableCenter.backupCopy") }}:{{ createForm2.retain }}
            </div>
          </div>
        </div>
        <div class="addInfor">
          <div class="add-infor-title">
            {{ $t("reliableCenter.secondarySiteDrMethod") }}
          </div>
          <div class="add-infor-content">
            <div>
              {{ $t("reliableCenter.drLocation") }}:{{
                createForm2.slaveBackupServerPath
              }}
            </div>
            <div v-if="createForm2.backupCycleType === 'HOUR'">
              {{ $t("reliableCenter.drRpoPeriod") }}:{{
                secToHour(createForm2.proCycle) + $t("reliableCenter.hour")
              }}
            </div>
            <div>
              {{ $t("reliableCenter.transmissionMode") }}：{{
                createForm2.rpoCompress
                  ? $t("reliableCenter.compressedTransmission")
                  : $t("reliableCenter.uncompressedTransmission")
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-foot">
        <el-button
          v-if="activestep == 1 || activestep == 2"
          @click="handleConfirm(-1)"
        >
          {{ $t("common.previous") }}
        </el-button>
        <el-button
          type="primary"
          v-if="activestep == 0 || activestep == 1"
          @click="handleConfirm(1)"
        >
          {{ $t("common.nextStep") }}
        </el-button>
        <el-button
          type="primary"
          @click="handleConfirm(0)"
          v-if="activestep == 2"
        >
          {{ $t("common.confirmation") }}
        </el-button>
        <el-button @click="handleCloseCreate">{{
          $t("common.cancel")
        }}</el-button>
      </div>
    </div>
    <choosenVmBox
      :visible.sync="vmChoosenBox"
      :clusterId="masterClusterId"
      :selectVmList="selectMachineList"
      @selectChange="selectVmChange"
      :canDisBol="true"
    />
    <chooseLocation
      :visible.sync="locationChoosenBox"
      :siteName="siteName"
      :type="locationType"
      :clusterId="choosenClusterId"
      @selectChange="selectLocationChange"
    />
  </el-drawer>
</template>
<script>
import mcTable from "@/components/MctablePro";
import statuscell from "@/components/statuscell";
import choosenVmBox from "./choosenVmBox";
import {
  drSiteList,
  handelAddPlan,
  handelEditPlan,
} from "@/api/remoteDisasterRecovery";
import chooseLocation from "./chooseLocation";
export default {
  name: "drStrategyInfor",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: null,
    },
    modelType: {
      type: String,
      default: "",
    },
    detailInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      selectData: [],
      site1Name: "",
      site2Name: "",
      siteName: "",
      masterClusterId: null,
      slaveClusterId: "",
      selectMachineList: [],
      selectModel: [],
      drawerLoading: false,
      choosenClusterId: null,
      activestep: 0,
      nextDay: false,
      locationType: "",
      createForm: {},
      createForm2: {
        backupCycleType: "HOUR",
        rpoCompress: false,
        site1Name: "",
        slaveBackupServerPath: "",
        masterBackupServerPath: "",
        site2Name: "",
        backupCycleHour: 3600,
        singleBackupTimeout: 8,
        retain: 3,
        duration: 24,
      },
      vmChoosenBox: false,
      selectSite1Arr: [],
      selectSite2Arr: [],
      locationChoosenBox: false,
      rulesTemplate: {
        planName: [
          {
            required: true,
            message: this.$t("reliableCenter.enterDrPolicyName"),
            trigger: "change",
          },
          {
            trigger: "blur",
            max: 32,
            min: 2,
            message: this.$t("reliableCenter.policyNameFormat"),
          },
        ],
        masterSiteId: [
          {
            required: true,
            message: this.$t("reliableCenter.selectPrimarySite"),
            trigger: "change",
          },
        ],
        slaveSiteId: [
          {
            required: true,
            message: this.$t("reliableCenter.selectSecondarySite"),
            trigger: "change",
          },
        ],
        selectMachineList: [
          {
            required: true,
            message: this.$t("reliableCenter.selectCloudServer"),
            trigger: "change",
          },
        ],
      },
      selectWeekDaysoptions: [
        {
          value: "MONDAY",
          label: this.$t("reliableCenter.drStragtegyInfor.Monday"), // '星期一'
        },
        {
          value: "TUESDAY",
          label: this.$t("reliableCenter.drStragtegyInfor.Tuesday"), // '星期二'
        },
        {
          value: "WEDNESDAY",
          label: this.$t("reliableCenter.drStragtegyInfor.Wednesday"), // '星期三'
        },
        {
          value: "THURSDAY",
          label: this.$t("reliableCenter.drStragtegyInfor.Thurday"), // '星期四'
        },
        {
          value: "FRIDAY",
          label: this.$t("reliableCenter.drStragtegyInfor.Friday"), // '星期五'
        },
        {
          value: "STAURDAY",
          label: this.$t("reliableCenter.drStragtegyInfor.Saturday"), // '星期六'
        },
        {
          value: "SUNDAY",
          label: this.$t("reliableCenter.drStragtegyInfor.Sunday"), // '星期日'
        },
      ],
      backupStepoptions: [
        {
          value: 3600,
          label: "1" + this.$t("reliableCenter.hour"),
        },
        {
          value: 7200,
          label: "2" + this.$t("reliableCenter.hour"),
        },
        {
          value: 3 * 3600,
          label: "3" + this.$t("reliableCenter.hour"),
        },
        {
          value: 4 * 3600,
          label: "4" + this.$t("reliableCenter.hour"),
        },
        {
          value: 5 * 3600,
          label: "5" + this.$t("reliableCenter.hour"),
        },
        {
          value: 6 * 3600,
          label: "6" + this.$t("reliableCenter.hour"),
        },
        {
          value: 7 * 3600,
          label: "7" + this.$t("reliableCenter.hour"),
        },
        {
          value: 8 * 3600,
          label: "8" + this.$t("reliableCenter.hour"),
        },
        {
          value: 12 * 3600,
          label: "12" + this.$t("reliableCenter.hour"),
        },
      ],
      proStepoptions: [
        {
          value: 3600,
          label: "1" + this.$t("reliableCenter.hour"),
        },
        {
          value: 7200,
          label: "2" + this.$t("reliableCenter.hour"),
        },
        {
          value: 3 * 3600,
          label: "3" + this.$t("reliableCenter.hour"),
        },
        {
          value: 4 * 3600,
          label: "4" + this.$t("reliableCenter.hour"),
        },
        {
          value: 5 * 3600,
          label: "5" + this.$t("reliableCenter.hour"),
        },
        {
          value: 6 * 3600,
          label: "6" + this.$t("reliableCenter.hour"),
        },
        {
          value: 7 * 3600,
          label: "7" + this.$t("reliableCenter.hour"),
        },
        {
          value: 8 * 3600,
          label: "8" + this.$t("reliableCenter.hour"),
        },
        {
          value: 12 * 3600,
          label: "12" + this.$t("reliableCenter.hour"),
        },
        {
          value: 24 * 3600,
          label: "24" + this.$t("reliableCenter.hour"),
        },
      ],
      rulesTemplate2: {
        masterBackupServerPath: {
          required: true,
          message: this.$t("reliableCenter.selectBackupLoc"),
          trigger: "change",
        },
        slaveBackupServerPath: {
          required: true,
          message: this.$t("reliableCenter.selectDrLoc"),
          trigger: "change",
        },
        backupCycleHour: {
          required: true,
          message: this.$t("reliableCenter.selectBackupPeriod"),
          trigger: "change",
        },
        dayStartTime: {
          required: true,
          message: this.$t("reliableCenter.selectStartTime"),
          trigger: "change",
        },
        dayEndTime: {
          required: true,
          message: this.$t("reliableCenter.selectEndTime"),
          trigger: "change",
        },
        backupCycleWeek: {
          required: true,
          message: this.$t("reliableCenter.selectBackupPeriod"),
          trigger: "change",
        },
        startTime: {
          required: true,
          message: this.$t("reliableCenter.selectStartTime"),
          trigger: "change",
        },
        duration: {
          required: true,
          message: this.$t("reliableCenter.enterPolicyDuration"),
          trigger: "change",
        },
        singleBackupTimeout: {
          required: true,
          message: this.$t("reliableCenter.enterSingleTimeout"),
          trigger: "change",
        },
        retain: {
          required: true,
          message: this.$t("reliableCenter.enterBackupCopies"),
          trigger: "change",
        },
        proCycle: {
          required: true,
          message: this.$t("reliableCenter.selectDrRpoPeriod"),
          trigger: "change",
        },
      },
      drawerTitle: "",
      columnArr: [
        // "名称"
        {
          label: this.$t("reliableCenter.cloudServerName"),
          prop: "machineName",
        },
        // 类型
        {
          label: this.$t("reliableCenter.cloudServerStatus"),
          prop: "machineStatus",
        },
      ],
    };
  },
  components: { mcTable, statuscell, choosenVmBox, chooseLocation },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.getdrSiteList();
        this.drawerTitle =
          this.type === "create"
            ? this.$t("reliableCenter.createDrPolicy")
            : this.$t("reliableCenter.editDrPolicy");
      }
    },
  },
  methods: {
    getdrSiteList() {
      this.drawerLoading = true;
      drSiteList({ searchKey: "" })
        .then((res) => {
          const newSiteArr = res.map((val, index) => {
            res[index]["site1Disabled"] = false;
            res[index]["site2Disabled"] = false;
            return res[index];
          });
          this.$set(this, "selectData", newSiteArr);
          if (this.type === "edit") {
            //重新设置展示所需的站点名称
            newSiteArr.forEach((e) => {
              e.siteId === this.detailInfo.masterSiteId
                ? (this.site1Name = e.name)
                : "";
              e.siteId === this.detailInfo.slaveSiteId
                ? (this.site2Name = e.name)
                : "";
            });
            this.intDrawerData();
          }
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    intDrawerData(newSiteArr) {
      const {
        planName,
        masterSiteId,
        slaveSiteId,
        machineList,
        masterBackupServerPath,
        backupCycleType,
        singleBackupTimeout,
        retain,
        slaveBackupServerPath,
        rpoCompress,
      } = this.detailInfo;
      const createForm = {
        planName,
        masterSiteId,
        slaveSiteId,
        selectMachineList: machineList,
      };
      this.$set(this, "createForm", createForm);
      this.$set(this, "selectMachineList", machineList);
      const selectModelArr = machineList.map((e) => e.machineUuid);
      this.$set(this, "selectModel", selectModelArr);
      this.selectData.forEach((i) => {
        if (i.siteId === masterSiteId) {
          this.masterClusterId = i.clusterId;
        }
      });
      const createForm2 = {
        masterBackupServerPath,
        backupCycleType,
        singleBackupTimeout,
        retain,
        slaveBackupServerPath,
        rpoCompress,
      };
      switch (backupCycleType) {
        case "HOUR":
          const { hourDetail } = this.detailInfo;
          createForm2.backupCycleHour = hourDetail.backupCycle;
          createForm2.proCycle = hourDetail.rpoCycle;
          break;
        case "DAY":
          const { dayDetail } = this.detailInfo;
          createForm2.dayStartTime = dayDetail.startTime;
          createForm2.dayEndTime = dayDetail.endTime;
          this.nextDay = dayDetail.nextDay;
          break;
        case "WEEK":
          const { weekDetail } = this.detailInfo;
          createForm2.startTime = weekDetail.startTime;
          createForm2.duration = weekDetail.duration;
          createForm2.backupCycleWeek = weekDetail.weeks;
          break;
        default:
          break;
      }
      this.$set(this, "createForm2", createForm2);
    },
    handleCloseCreate() {
      //初始化数据
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    changeSite1Select(e) {
      this.selectData.forEach((i) => {
        if (i.siteId === e) {
          this.site1Name = i.name;
          this.masterClusterId = i.clusterId;
        }
      });
      this.$set(this.createForm2, "masterBackupServerPath", "");
      this.setSelectDisable(e, 2);
    },
    changeSite2Select(e) {
      this.selectData.forEach((i) => {
        if (i.siteId === e) {
          this.site2Name = i.name;
          this.slaveClusterId = i.clusterId;
        }
      });
      this.$set(this.createForm2, "slaveBackupServerPath", "");
      this.setSelectDisable(e, 1);
    },
    setSelectDisable(val, num) {
      const disabledKey = num === 1 ? "site1Disabled" : "site2Disabled";
      const selectKey = num === 2 ? "site1Name" : "site2Name";
      const selectListKey = num === 2 ? "selectSite1Arr" : "selectSite2Arr";
      let selectVal = "";
      this.selectData.forEach((v, n) => {
        this.selectData[n][disabledKey] = v.siteId === val;
        if (v.siteId === val) {
          selectVal = v.name;
          this.$set(this.createForm, selectKey, selectVal);
          this.$set(this, selectListKey, v.nodeList);
        }
      });

      this.$forceUpdate();
    },
    secToHour(e) {
      const hour = (e / 3600).toFixed(2);
      return hour;
    },
    selectServerVMs() {
      this.vmChoosenBox = true;
    },
    selectVmChange(e) {
      if (e.length > 0) {
        const newList = [];
        const selectModel = [];
        e.forEach((i) => {
          newList.push({
            machineName: i.aliasName,
            machineUuid: i.uuid,
          });
          selectModel.push(i.uuid);
        });
        this.$set(this, "selectMachineList", newList);
        this.$set(this.createForm, "selectMachineList", newList);
        this.$set(this, "selectModel", selectModel);
      }
    },
    // 提交
    handleConfirm(step) {
      switch (step) {
        case 0: // 确认
          this.handelCommit();
          break;
        case -1: // 上一步
          this.activestep = this.activestep + step;
          break;
        case 1:
          this.handleConfirmvalidate(step);
          break;
        default:
          this.activestep = 0;
          break;
      }
    },
    handelCommit() {
      const { planName, masterSiteId, slaveSiteId, selectMachineList } =
        this.createForm;
      const {
        masterBackupServerPath,
        slaveBackupServerPath,
        backupCycleType,
        singleBackupTimeout,
        retain,
        rpoCompress,
      } = this.createForm2;

      const params = {
        planName,
        masterSiteId,
        slaveSiteId,
        selectMachineList,
        singleBackupTimeout,
        masterBackupServerPath,
        slaveBackupServerPath,
        backupCycleType,
        singleBackupTimeout,
        retain,
        rpoCompress,
        retain,
      };
      switch (this.createForm2.backupCycleType) {
        case "HOUR":
          params.hourParam = {
            backupCycle: this.createForm2.backupCycleHour,
            rpoCycle: this.createForm2.proCycle, //容灾RPO周期
          };
          break;
        case "DAY":
          params.dayParam = {
            startTime: this.createForm2.dayStartTime,
            endTime: this.createForm2.dayEndTime, //容灾RPO周期
            nextDay: this.nextDay,
          };
          break;
        case "WEEK":
          params.weekParam = {
            startTime: this.createForm2.startTime,
            duration: this.createForm2.duration,
            weeks: this.createForm2.backupCycleWeek,
          };
          break;
        default:
          break;
      }
      this.drawerLoading = false;
      this.type === "create"
        ? this.handelCreate(params)
        : this.handelEdit(params);
    },
    handelCreate(params) {
      handelAddPlan(params).then((item) => {
        this.drawerLoading = true;
        this.$message.success(
          this.$t("reliableCenter.policyCreationSucceeded")
        );
        //初始化数据
        Object.assign(this.$data, this.$options.data.call(this));
        this.$emit("update:visible", false);
        this.$emit("freshTable");
      });
    },
    handelEdit(params) {
      params.planId = this.detailInfo.planId;
      handelEditPlan(params).then((item) => {
        this.drawerLoading = true;
        this.$message.success(
          this.$t("reliableCenter.policyModificationSucceeded")
        );
        //初始化数据
        Object.assign(this.$data, this.$options.data.call(this));
        this.$emit("update:visible", false);
        this.$emit("freshTable");
      });
    },
    handleConfirmvalidate() {
      switch (this.activestep) {
        case 0:
          this.$refs.createForm.validate((valid) => {
            if (valid) {
              this.activestep += 1;
            }
          });
          break;
        case 1:
          this.$refs.createForm2.validate((valid) => {
            if (valid) {
              this.activestep += 1;
            }
          });

          break;
        case 2:
          break;
        default:
          break;
      }
    },
    selecCycleChange(e) {
      const { backupCycleType } = this.createForm2;
      this.createForm2.proCycle && this.createForm2.proCycle < e
        ? (this.createForm2.proCycle = "")
        : "";
      this.proStepoptions.forEach((el, i) => {
        this.proStepoptions[i].disabled = el.value < e;
      });
      this.$forceUpdate();
    },
    changeFrequencyForm(e, type) {
      switch (type) {
        case 1:
          break;
        case 2:
          if (!this.createForm2.dayStartTime || !this.createForm2.dayEndTime)
            return;
          var reg1 = new RegExp(":", "g");
          const a1 = this.createForm2.dayStartTime.replace(reg1, "");
          const a2 = this.createForm2.dayEndTime.replace(reg1, "");
          this.nextDay = a1 >= a2;
          break;
        default:
          break;
      }
    },
    proCycleChange(e) {},
    selectLocal(type) {
      this.siteName = type === "masterSiteId" ? this.site1Name : this.site2Name;
      this.choosenClusterId =
        type === "masterSiteId" ? this.masterClusterId : this.slaveClusterId;
      this.locationChoosenBox = true;
      this.locationType = type;
    },
    selectLocationChange(e) {
      const locationType = this.locationType;
      switch (locationType) {
        case "masterSiteId":
          this.$set(this.createForm2, "masterBackupServerPath", e[0].sharePath);
          this.$forceUpdate();
          break;
        case "slaveSiteId":
          this.$set(this.createForm2, "slaveBackupServerPath", e[0].sharePath);
          this.$forceUpdate();
          break;

        default:
          break;
      }
    },
    getVmtext(arr) {
      const textArr = [];
      arr.forEach((e) => {
        textArr.push(e.machineName);
      });
      return textArr.join("，");
    },
    getCycleData() {
      switch (this.createForm2.backupCycleType) {
        case "WEEK":
          const weekArray = [];
          this.createForm2.backupCycleWeek.forEach((item) => {
            let result = this.selectWeekDaysoptions.find(
              (dicItem) => item === dicItem.value
            );
            weekArray.push(result.label);
          });

          return `${this.$t("reliableCenter.weeklyBackup")}<${weekArray.join(
            ","
          )}>`;
          break;
        case "HOUR":
          let result = this.backupStepoptions.find(
            (item) => item.value === this.createForm2.backupCycleHour
          );
          return `${this.$t("reliableCenter.hourlyBackup")}<${result.label}>`;
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.drawer-body-content-steps {
  padding: 20px 30px;
}

.drawer-body-content {
  @include formStyle;
  ::v-deep {
    .el-icon-time {
      margin-left: 0 !important;
    }
  }
  .group-date ::v-deep .el-form-item--small {
    margin-bottom: 0 !important;
  }
  .line {
    text-align: center;
  }
  .template-box {
    .template-box-title {
      font-size: 16px;
      font-weight: bold;
      margin-right: 25px;
      line-height: 32px;
    }
  }
  .date-tips {
    color: #333333;
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 20px;
  }

  .dr-explain-content {
    width: 464px;
    background-color: rgba(245, 247, 250, 1);
    .explain-title {
      font-size: 14px;
      color: #333;
      font-weight: 800;
      padding: 6px;
    }
    .dr-explain {
      width: 100%;
      padding: 20px 30px;
    }
  }
}

.addInfor {
  display: flex;
  flex-direction: row;
  .add-infor-title {
    font-weight: 800;
    text-align: left;
    width: 150px;
  }
  .add-infor-content {
    flex: 1;
    div {
      margin-bottom: 20px;
    }
  }
}
</style>
