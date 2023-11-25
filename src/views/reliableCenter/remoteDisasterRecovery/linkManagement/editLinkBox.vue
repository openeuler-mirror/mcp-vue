<template>
  <el-drawer
    size="900px"
    :title="$t('reliableCenter.editLink')"
    direction="rtl"
    custom-class=""
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseEdit"
    :destroy-on-close="true"
  >
    <div class="drawer-body-content">
      <div v-loading="drawLoading">
        <div class="top-tips">
          <i class="el-icon-warning-outline"></i>
          <!-- 配置站点与站点的管理节点主机IP，使站点与站点之间能正常通信和传输数据。 -->
          {{ $t("reliableCenter.sectionDescri") }}
        </div>
        <el-form
          ref="createDataForm"
          label-width="auto"
          label-position="left"
          :model="createForm"
          :rules="rulesTemplate"
        >
          <el-form-item :label="$t('reliableCenter.site1')" prop="site1">
            <el-select
              v-model="createForm.site1"
              style="width: 400px"
              disabled
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
          <el-form-item :label="$t('reliableCenter.site2')" prop="site2">
            <el-select
              v-model="createForm.site2"
              style="width: 400px"
              disabled
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
          <!-- 链路宽带限制 -->
          <el-form-item
            :label="$t('reliableCenter.linkRestr')"
            prop="broadbandLimit"
            :rules="
              createForm.broadbandLimitFlag
                ? rulesTemplate.broadbandLimitFlag
                : [{ required: false }]
            "
          >
            <el-radio-group v-model="createForm.broadbandLimitFlag">
              <el-radio
                v-for="(item, index) in linkLimt"
                :label="item.value"
                v-only-num
                :key="item.key + index"
                >{{ item.key }}
              </el-radio>
            </el-radio-group>
            <el-input
              v-if="createForm.broadbandLimitFlag"
              :placeholder="$t('common.pleaseEnter')"
              style="width: 176px; margin-left: 50px"
              v-model="createForm.broadbandLimit"
            >
              <template slot="append">Mbps</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="input-setting-group">
          <div class="setting-label">
            {{ $t("reliableCenter.configureDrIp") }}
          </div>
          <el-form
            ref="ipForm"
            class="ipForm"
            :model="ipForm"
            label-width="auto"
            v-if="createForm.site1 && createForm.site2"
          >
            <div class="left-ipSetting ip-setting-border">
              <div class="ip-setting-title">{{ createForm.site1Name }}</div>
              <el-form-item
                v-for="(item, index) in selectSite1Arr"
                :key="index"
                :label="item.nodeManageIp"
                :prop="`ip1Data-${index}`"
                :rules="[
                  {
                    required: true,
                    message: $t('reliableCenter.communicationIpAddress'),
                    trigger: 'blur',
                  },
                  {
                    trigger: 'blur',
                    message: $t('reliableCenter.enterNormalIp'),
                    validator: validate.validateIp,
                  },
                ]"
              >
                <el-input v-model="ipForm[`ip1Data-${index}`]"></el-input>
              </el-form-item>
            </div>
            <div class="icon-border">
              <i class="el-icon-arrow-left"></i>
              <i class="el-icon-minus"></i>
              <i class="el-icon-arrow-right"></i>
            </div>
            <div class="right-ipSetting ip-setting-border">
              <div class="ip-setting-title">{{ createForm.site2Name }}</div>
              <el-form-item
                v-for="(item, index) in selectSite2Arr"
                :key="index"
                :label="item.nodeManageIp"
                :prop="`ip2Data-${index}`"
                :rules="[
                  {
                    required: true,
                    message: $t('reliableCenter.communicationIpAddress'),
                    trigger: 'blur',
                  },
                  {
                    trigger: 'blur',
                    message: $t('reliableCenter.enterNormalIp'),
                    validator: validate.validateIp,
                  },
                ]"
              >
                <el-input v-model="ipForm[`ip2Data-${index}`]"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div v-else>{{ $t("reliableCenter.selectThePrimary") }}</div>
        </div>
      </div>
    </div>
    <div class="drawer-foot">
      <el-button type="primary" :loading="drawLoading" @click="handelSubmit">{{
        drawLoading
          ? $t("reliableCenter.linkDetection")
          : $t("externalCloud.vmOperate.sure")
      }}</el-button>
      <el-button @click="handleCloseEdit">{{
        $t("externalCloud.vmOperate.cancel")
      }}</el-button>
    </div>
  </el-drawer>
</template>

<script>
import mcTable from "@/components/MctablePro";
import validate from "@/utils/validate";
import {
  getSiteArr,
  bdrLinkDetail,
  editLinkSite,
} from "@/api/remoteDisasterRecovery";
export default {
  name: "editLinkBox",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    targetLink: {
      type: Object,
      default: {
        masterSiteName: "",
        slaveSiteName: "",
      },
    },
  },
  components: { mcTable },
  data() {
    return {
      drawerVisible: this.visible,
      selectSite1Arr: [],
      selectSite2Arr: [],
      validate: validate,
      tableData: [],
      rowkey: "clusterId",
      drawLoading: false,
      linkLimt: [
        {
          key: this.$t("reliableCenter.unlimited"),
          value: false,
        },
        {
          key: this.$t("reliableCenter.limited"),
          value: true,
        },
      ],
      selectData: [],
      createForm: {
        site1: "",
        site2: "",
        site1Name: "",
        site2Name: "",
        broadbandLimitFlag: false,
      },
      rulesTemplate: {
        site1: {
          required: true,
          message: this.$t("reliableCenter.site1Tips"),
          trigger: "blur",
        },
        site2: {
          required: true,
          message: this.$t("reliableCenter.site2Tips"),
          trigger: "blur",
        },
        broadbandLimitFlag: {
          required: true,
          message: this.$t("reliableCenter.linkBroadBand"),
          trigger: "blur",
        },
      },
      ipForm: {},
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        this.handelGetSiteList();
      }
    },
  },
  mounted() {
    // this.getClusterList();
  },
  methods: {
    intGetDetailData() {
      const params = { siteLinkId: this.targetLink.siteLinkId };
      bdrLinkDetail(params).then((res) => {
        const {
          siteLinkId,
          slaveSiteName,
          slaveSiteId,
          masterSiteId,
          masterSiteName,
          broadbandLimitFlag,
          broadbandLimit,
          masterLinkIpList,
          slaveLinkIpList,
        } = res;
        const createForm = {
          site1: masterSiteId,
          site2: slaveSiteId,
          site1Name: masterSiteName,
          site2Name: slaveSiteName,
          broadbandLimitFlag,
          siteLinkId,
          broadbandLimit,
        };
        this.$set(this, "createForm", createForm);
        const selectSite1Arr = [];
        const selectSite2Arr = [];
        const ipformData = {};
        masterLinkIpList.forEach((e, index) => {
          selectSite1Arr.push(e);
          ipformData[`ip1Data-${index}`] = e.siteLinkIp;
        });
        slaveLinkIpList.forEach((e, index) => {
          selectSite2Arr.push(e);
          ipformData[`ip2Data-${index}`] = e.siteLinkIp;
        });
        this.$set(this, "ipForm", ipformData);
        this.$set(this, "selectSite1Arr", selectSite1Arr);
        this.$set(this, "selectSite2Arr", selectSite2Arr);
        this.$forceUpdate();
      });
    },
    handelGetSiteList() {
      getSiteArr().then((res) => {
        const newSiteArr = res.map((val, index) => {
          res[index]["site1Disabled"] = false;
          res[index]["site2Disabled"] = false;
          return res[index];
        });
        this.$set(this, "selectData", newSiteArr);
        this.intGetDetailData();
      });
    },
    getClusterList() {
      this.drawLoading = true;
      getClusterList()
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.drawLoading = false;
        });
    },
    handleCloseEdit() {
      if (this.drawLoading) {
        this.$message.warning(this.$t("reliableCenter.dataCommit"));
        return;
      }
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    handlerSelectionChange(selection) {
      this.selectSiteArr = selection;
    },
    handelSubmit() {
      this.drawLoading = true;
      const masterLinkIpList = [];
      const slaveLinkIpList = [];
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          const {
            site1,
            site2,
            broadbandLimitFlag,
            broadbandLimit,
            siteLinkId,
          } = this.createForm;
          const params = {
            masterSiteId: site1,
            slaveSiteId: site2,
            broadbandLimitFlag,
            broadbandLimit,
            siteLinkId,
          };
          this.$refs.ipForm.validate((valid2) => {
            if (valid2) {
              for (const key in this.ipForm) {
                if (Object.hasOwnProperty.call(this.ipForm, key)) {
                  const element = this.ipForm[key];
                  const index = key.split("-")[1];
                  if (key.indexOf("ip1") === 0) {
                    masterLinkIpList.push({
                      nodeManageIp: this.selectSite1Arr[index]["nodeManageIp"],
                      siteLinkIp: element,
                    });
                  } else {
                    slaveLinkIpList.push({
                      nodeManageIp: this.selectSite2Arr[index]["nodeManageIp"],
                      siteLinkIp: element,
                    });
                  }
                }
              }
              params.masterLinkIpList = masterLinkIpList;
              params.slaveLinkIpList = slaveLinkIpList;

              editLinkSite(params)
                .then((res) => {
                  this.$message.success(this.$t("reliableCenter.linkEditSucc"));
                  if (res.checkStatus === "ERROR") {
                    let textHtml = "";
                    res.errorList.forEach((e) => {
                      textHtml += `<div> ${e} </div>`;
                    });
                    this.$notify({
                      title: this.$t("reliableCenter.linkDete"),
                      dangerouslyUseHTMLString: true,
                      message: textHtml,
                      customClass: "ownNotify",
                      type: "warning",
                    });
                  }
                  this.drawLoading = false;
                  this.handleCloseEdit();
                  this.$emit("freshTable");
                })
                .finally(() => {
                  this.drawLoading = false;
                });
            } else {
              this.drawLoading = false;
              return false;
            }
          });
        } else {
          this.drawLoading = false;
          return false;
        }
      });
    },
    changeSite1Select(e) {
      this.setSelectDisable(e, 2);
    },
    changeSite2Select(e) {
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
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.top-tips {
  border: 1px solid #40a9ff;
  padding: 10px 15px;
  border-radius: 5px;
  background: rgba(64, 169, 255, 0.098);
  margin-bottom: 20px;
  .el-icon-warning-outline {
    color: rgba(64, 169, 255, 1);
  }
}

.input-setting-group {
  display: flex;
  width: 610px;
  .setting-label {
    width: 96px;
  }
  .ipForm {
    flex: 1;
    border: 1px solid #e4e7ed;
    padding: 20px;
    display: flex;
    align-items: flex-start;
  }
  .ip-setting-title {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 700;
  }
  .ip-setting-border {
    flex: 0.5;
  }
  .icon-border {
    margin-right: 20px;
    align-self: center;
    & [class*="el-icon-"] {
      margin: 0;
    }
  }
}
.ip-setting-border::v-deep {
  .el-form-item {
    display: flex;
    flex-direction: column;
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .el-input {
      width: 170px;
    }
  }
}
</style>
