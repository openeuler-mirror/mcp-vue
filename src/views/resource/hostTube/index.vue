<template>
  <div class="app-container">
    <div class="header-box">
      <div class="header-left">
        <el-button @click="addHost">
          {{ $t("common.add") }}
        </el-button>
        <!-- 开机 -->
        <el-button
          :disabled="currentBtnShow('open_host')"
          @click="openManyHost"
        >
          {{ $t("resourceMgr.start_servervm") }}
        </el-button>
        <!-- 关机 -->
        <el-button
          :disabled="currentBtnShow('close_host')"
          @click="offManyHost"
        >
          {{ $t("resourceMgr.shutdown_servervm") }}
        </el-button>
        <!-- 删除 -->
        <el-button :disabled="currentBtnShow('del_host')" @click="delManyHost">
          {{ $t("resourceMgr.batchDelete") }}
        </el-button>
      </div>
      <div class="header-right">
        <utilsButton type="fresh" :spinBol="tableLoading" @refresh="refresh" />
      </div>
    </div>
    <mc-table
      ref="physicalClusterTable"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @current-change="handlePageChange"
      selectionType="multipleTable"
      @selection-change="handlerSelectionChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      v-loading="tableLoading"
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in tableColumns">
        <el-table-column
          v-if="item.prop == 'name'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-button @click="getRowDetail(row)" type="text">{{
              row.name
            }}</el-button>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'powerStatus'"
          :key="index + 'status'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <statuscell
              :status="row.powerStatus.toString()"
              type="string"
            ></statuscell>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-else-if="item.prop == 'operate'"
          :key="index + 'operate'"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <!--  ONLINE(在线) ERROR(异常) EXCEPTION(离线) -->
            <el-button
              v-if="row.powerStatus === 'ONLINE'"
              style="margin-right: 10px"
              @click="handelOffVm(row)"
              type="text"
            >
              {{ $t("resourceMgr.shutdown_servervm") }}
            </el-button>
            <el-button
              v-if="row.powerStatus === 'OFFLINE'"
              style="margin-right: 10px"
              @click="openVm(row)"
              type="text"
            >
              {{ $t("resourceMgr.start_servervm") }}</el-button
            >
            <el-dropdown trigger="click">
              <el-button type="text">
                <!-- 更多 -->
                {{ $t("resourceMgr.servervmmore") }}
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button @click="showEdit(row)" type="text">
                    {{ $t("common.modify") }}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    :disabled="row.powerStatus === 'ONLINE'"
                    @click="handelDel(row)"
                    type="text"
                  >
                    {{ $t("common.delete") }}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              v-if="item.tooltipsFlag"
              effect="light"
              :content="row[item.prop] || '-'"
              placement="top"
              :visible-arrow="true"
            >
              <span>{{ row[item.prop] }}</span>
            </el-tooltip>
            <span v-else>{{ row[item.prop] || "-" }}</span>
          </template>
        </el-table-column>
      </template>
    </mc-table>
    <detalPage :visible.sync="detailBol" :id="selectId" />
    <vmData
      :visible.sync="dialogVisible"
      :detailData="detailData"
      :modeltype="actionType"
      @fresh="refresh"
      @resetData="resetData"
    />
    <messageBox
      :dialogVisible.sync="dialogmessageVisible"
      :bodyTitle="bodyTitle"
      :bodyDes="bodyDes"
      :loading="messageBoxLoading"
      @hadnelSubmit="submitFnc"
      @hadnelCancel="
        dialogmessageVisible = false;
        messageBoxLoading = false;
      "
    />
  </div>
</template>
<script>
import utilsButton from "@/components/utilsButton";
import mcTable from "@/components/MctablePro";
import validate from "@/utils/validate";
import statuscell from "@/components/statuscell";
import messageBox from "@/components/messageBox";
import detalPage from "./detalPage";
import vmData from "./vmData";
import {
  bareMetalcreate,
  bareMetalupdate,
  bareMetallist,
  bareMetaldetail,
  bareMetalpowerOn,
  bareMetalpowerOff,
  bareMetaldelete,
  monitorinfo,
} from "@/api/vMwareMgr";
export default {
  name: "",
  components: {
    utilsButton,
    mcTable,
    statuscell,
    messageBox,
    detalPage,
    vmData,
  },
  props: {},
  data() {
    const validateCheckPwd = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error(this.$t("common.login.confirmPwdErr")));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      selectedData: [],
      total: 0,
      pageNo: 1,
      dialogVisible: false,
      dialogmessageVisible: false,
      bodyTitle: "",
      detailBol: false,
      bodyDes: "",
      actionType: "create",
      tableLoading: false,
      messageBoxLoading: false,
      selectId: 0,
      pageSize: 20,
      rowkey: "id",
      sureFncName: "",
      submitData: {},
      detailData: {},
      tableColumns: [
        {
          label: this.$t("common.name"),
          prop: "name",
        },
        {
          label: this.$t("common.status"),
          prop: "powerStatus",
        },
        {
          label: this.$t("common.desc"),
          prop: "remark",
        },

        {
          label: this.$t("resourceMgr.BMC_IPaddress"),
          prop: "bmcIp",
        },
        {
          label: this.$t("common.createTime"),
          prop: "createTime",
          width: "230px",
        },
        {
          label: this.$t("common.operation"),
          prop: "operate",
          width: "230px",
        },
      ],
      form: {},
      rules: {
        // 原主机管理IP密码
        hostIp: [
          {
            required: true,
            message: this.$t("resourceMgr.hostIpCantNull"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("workOrder.ipSet.ipWran"),
            validator: validate.validateIp,
          },
        ],
        rootPwd: [
          {
            required: true,
            message: this.$t("resourceMgr.rootPasswordCantNull"),
            trigger: "blur",
          },
        ],
        bmcIp: [
          {
            required: true,
            message: this.$t("resourceMgr.bmcIpCantNull"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("workOrder.ipSet.ipWran"),
            validator: validate.validateIp,
          },
        ],
        bmcName: [
          {
            required: true,
            message: this.$t("resourceMgr.bmcAccountCantNull"),
            trigger: "blur",
          },
        ],
        // 密码
        password: [
          {
            required: true,
            message: this.$t("common.passwordCantNull"),
            trigger: "blur",
          },
        ],
        confirmPwd: [
          {
            required: true,
            message: this.$t("common.login.pwdMsg"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.login.confirmPwdMsg"),
            validator: validateCheckPwd,
          },
        ],
      },
    };
  },
  watch: {},
  computed: {},

  mounted() {
    this.getTableData();
  },
  methods: {
    refresh() {
      this.pageNo = 1;
      this.pageSize = 20;
      this.getTableData();
    },
    getTableData() {
      let pramas = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      this.tableLoading = true;
      bareMetallist(pramas)
        .then((res) => {
          this.tableData = res.list;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    resetData() {
      this.detailData = {};
      this.actionType = "";
    },
    addHost() {
      this.detailData = {};
      this.$set(this, "actionType", "create");
      this.dialogVisible = true;
    },
    handleClose() {
      this.form = {};
      this.dialogVisible = false;
      this.$refs.form.resetFields();
    },
    currentBtnShow(type) {
      let disabled = this.selectedData.length === 0;
      if (disabled) return disabled;
      let arrItemArr = [];
      switch (type) {
        case "open_host":
          arrItemArr = this.selectedData.filter(
            (res) => res.powerStatus === "ONLINE" || res.powerStatus === "ERROR"
          );
          disabled = arrItemArr.length > 0;
          return disabled;
        case "close_host":
          arrItemArr = this.selectedData.filter(
            (res) => res.powerStatus !== "ONLINE"
          );
          disabled = arrItemArr.length > 0;
          return disabled;
        case "del_host":
          arrItemArr = this.selectedData.filter(
            (res) => res.powerStatus === "ONLINE"
          );
          disabled = arrItemArr.length > 0;
          return disabled;
      }
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.getTableData();
    },
    showEdit(row) {
      bareMetaldetail({ bareMetalId: row.bareMetalId }).then((res) => {
        this.dialogVisible = true;
        this.detailData = res;
        this.actionType = "edit";
      });
    },

    openVm(row) {
      bareMetalpowerOn({ bareMetalIds: [row.bareMetalId] }).then((res) => {
        this.$message.success(
          `${row.name}${this.$t("resourceMgr.startServerVm")}`
        );
        this.refresh();
      });
    },
    handelDel(row) {
      this.bodyTitle = `${this.$t("common.sureDel")}“${row.name}”？`;
      this.bodyDes = this.$t("common.delTips");
      this.dialogmessageVisible = true;
      this.sureFncName = "del";
      this.submitData = {
        bareMetalIds: [row.bareMetalId],
      };
    },
    delManyHost() {
      if (this.selectedData.length === 1) {
        this.handelDel(this.selectedData[0]);
      } else {
        const nameArr = this.selectedData.map((res) => res.name);
        this.bodyTitle = `${this.$t("common.delLotSure")}“${nameArr.join(
          ","
        )}”？`;
        this.bodyDes = this.$t("common.delTips");
        this.dialogmessageVisible = true;
        this.sureFncName = "del";
        this.submitData = {
          bareMetalIds: idArr,
        };
      }
    },
    openManyHost() {
      const idArr = this.selectedData.map((res) => res.bareMetalId);
      bareMetalpowerOn({ bareMetalIds: idArr }).then((res) => {
        this.$message.success(this.$t("resourceMgr.batchstartSucc"));
        this.refresh();
      });
    },

    handelOffVm(row) {
      this.bodyTitle = this.$t("resourceMgr.shutdownTips", {
        name: row.name,
      });
      this.dialogmessageVisible = true;
      this.sureFncName = "off";
      this.submitData = {
        bareMetalIds: [row.bareMetalId],
      };
    },
    offManyHost() {
      const nameArr = this.selectedData.map((res) => res.name);
      const idArr = this.selectedData.map((res) => res.bareMetalId);
      this.bodyTitle = this.$t("resourceMgr.shutdownManyTips", {
        name: nameArr.join(","),
      });
      this.dialogmessageVisible = true;
      this.sureFncName = "off";
      this.submitData = {
        bareMetalIds: idArr,
      };
    },
    submitFnc() {
      this.messageBoxLoading = true;
      this.sureFncName === "del" ? this.submitDel() : this.offVm();
    },
    submitDel() {
      bareMetaldelete(this.submitData)
        .then((res) => {
          this.$message.success(this.$t("resourceMgr.deleteSuccess"));
          this.dialogmessageVisible = false;
          this.refresh();
        })
        .finally(() => {
          this.messageBoxLoading = false;
        });
    },
    offVm(row) {
      bareMetalpowerOff(this.submitData)
        .then((res) => {
          this.$message.success(this.$t("common.closeSessionSuccess"));
          this.dialogmessageVisible = false;
          this.refresh();
        })
        .finally(() => {
          this.messageBoxLoading = false;
        });
    },
    getRowDetail(row) {
      this.selectId = row.bareMetalId;
      this.detailBol = true;
    }, // 表格勾选
    handlerSelectionChange(selection) {
      this.selectedData = selection;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.header-box {
  @include headerBarStyle;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
