<template>
  <div class="drawer-content">
    <div class="drawer-body-content-steps">
      <el-steps :active="activestep" class="kcp-steps">
        <!-- 基本信息 -->
        <el-step :title="$t('resourceMgr.zoneBaseInfo')"></el-step>
        <!-- 关联集群 -->
        <el-step :title="$t('resourceMgr.zoneCluster')"></el-step>
        <!-- 确认信息 -->
        <el-step :title="$t('resourceMgr.zoneConfirmInfo')"></el-step>
      </el-steps>
    </div>

    <!-- 基本信息 -->
    <div v-if="activestep == 0" class="drawer-body-content">
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 可用区名称 -->
          <el-form-item :label="$t('resourceMgr.zoneNameDesc')" prop="name">
            <el-input
              v-model="createDataFormData.name"
              :placeholder="
                $t('common.pleaseEnter') + $t('resourceMgr.zoneNameDesc')
              "
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="$t('common.nametooltip')"
              placement="top"
            >
              <div class="kcp-infoQues icon-infoQues"></div>
            </el-tooltip>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item :label="$t('resourceMgr.zoneRemark')" prop="remark">
            <el-input
              type="textarea"
              maxlength="400"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.remark"
            />
          </el-form-item>
          <!-- 资源类型 -->
          <el-form-item :label="$t('resourceMgr.zoneType')" prop="type">
            <el-select
              v-model="createDataFormData.type"
              :placeholder="
                $t('common.pleaseSelsect') + $t('resourceMgr.zoneType')
              "
              disabled
            >
              <el-option
                v-for="(item, index) in clustertypeList"
                :key="'type' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 关联集群 -->
    <div v-if="activestep == 1" class="drawer-body-content">
      <div
        v-if="otherBtnShow('cluster', 'create_cluster')"
        class="flex align-center"
      >
        <span> {{ $t("resourceMgr.zoneNoClusterTo") }}</span>
        <el-link type="primary" @click="toCreateCluser">
          {{ $t("resourceMgr.clusterAdd") }}
        </el-link>
      </div>
      <mc-table
        ref="bindClusterTable"
        :data="tableData"
        :total="total"
        :pageSize="pageSize"
        :currentPage="pageNo"
        :rowkey="rowkey"
        @selection-change="handlerSelectionChange"
        @row-click="rowSelect"
        :selectionType="selectionType"
        :defaultSelectedKeys="defaultSelectedKeys"
        style="margin-top: 20px"
      >
        <template v-for="(item, index) in tableColumns">
          <!-- name -->
          <!-- <el-table-column
            v-if="item.prop == 'name'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column> -->
          <!-- 状态 -->
          <el-table-column
            v-if="item.prop == 'status'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <statuscell :status="row.status"></statuscell>
            </template>
          </el-table-column>
          <!-- CPU分配比  -->
          <el-table-column
            v-else-if="item.prop == 'cpurate'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <mcAllocationratio
                :option="{
                  percentage: calculatePercentage(row.cpuUsed, row.cpuTotal),
                  unit: 'GB',
                  num: row.cpuUsed,
                  total: row.cpuTotal,
                }"
              ></mcAllocationratio>
            </template>
          </el-table-column>
          <!-- 内存分配比 -->
          <el-table-column
            v-else-if="item.prop == 'memoryrate'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <mcAllocationratio
                :option="{
                  percentage: calculatePercentage(row.memUsed, row.memTotal),
                  unit: 'GB',
                  num: row.memUsed,
                  total: row.memTotal,
                }"
              ></mcAllocationratio>
            </template>
          </el-table-column>
          <!-- 存储分配比 -->
          <el-table-column
            v-else-if="item.prop == 'storagerate'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              <mcAllocationratio
                :option="{
                  percentage: calculatePercentage(
                    row.storageUsed,
                    row.storageTotal
                  ),
                  unit: 'GB',
                  num: row.storageUsed,
                  total: row.storageTotal,
                }"
              ></mcAllocationratio>
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
                :content="row[item.prop] || '-' + ''"
                placement="top"
                :visible-arrow="true"
              >
                <span>{{ row[item.prop] || "-" }}</span>
              </el-tooltip>
              <span v-else>{{ row[item.prop] || "-" }}</span>
            </template>
          </el-table-column>
        </template>
      </mc-table>
    </div>
    <!-- 确认信息 -->
    <div v-if="activestep == 2" class="drawer-body-content">
      <div class="template-box flex">
        <div class="template-box-title">
          {{ $t("resourceMgr.zoneBaseInfo") }}
        </div>
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 可用区名称 -->
          <el-form-item :label="$t('resourceMgr.zoneNameDesc')">
            <span>{{ createDataFormData.name }}</span>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item :label="$t('resourceMgr.zoneRemark')">
            <span>{{ createDataFormData.remark }}</span>
          </el-form-item>
          <!-- 资源类型 -->
          <el-form-item :label="$t('resourceMgr.zoneType')">
            <span>{{ createDataFormData.type }}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="template-box flex">
        <div class="template-box-title">
          {{ $t("resourceMgr.zoneCluster") }}
        </div>
        <div class="template-box-content">
          <el-collapse v-model="activeName">
            <el-collapse-item
              v-for="(item, index) in selectTable"
              :key="'Store information' + index"
              :title="$t('resourceMgr.zoneClusterDesc') + (index + 1)"
              :name="index + 1"
            >
              <!-- 集群名称 -->
              <div>{{ $t("resourceMgr.clusterName") }}：{{ item.name }}</div>
              <!-- 集群URL -->
              <div>
                {{ $t("resourceMgr.clusterUrl") }}：{{ item.clusterUrl }}
              </div>
              <!-- 描述 -->
              <div>
                {{ $t("resourceMgr.clusterRemark") }}：{{ item.remark }}
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
    <div class="drawer-foot footBtn">
      <el-button
        v-if="activestep == 1 || activestep == 2"
        @click="handleConfirm(-1)"
      >
        <!-- 上一步 -->
        {{ $t("common.previous") }}
      </el-button>
      <el-button
        type="primary"
        v-if="activestep == 0 || activestep == 1"
        @click="handleConfirm(1)"
      >
        <!-- 下一步 -->
        {{ $t("common.nextStep") }}
      </el-button>
      <el-button
        type="primary"
        @click="handleConfirm(0)"
        v-if="activestep == 2"
      >
        <!-- 确认 -->
        {{ $t("common.confirmation") }}
      </el-button>

      <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
    </div>
  </div>
</template>
<script>
import mcTable from "@/components/MctablePro";
import mcAllocationratio from "@/components/Mcallocationratio";
import { createZone, canBindCluster, modifyZone } from "@/api/zoneapi";
import statuscell from "../../components/statuscell/index.vue";
import transformat from "@/utils/transformat";
import validate from "@/utils/validate";
export default {
  components: { mcTable, mcAllocationratio, statuscell },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeName: [],
      clustertypeList: [{ value: "KSVD", label: "KSVD" }],
      oriFormData: {
        name: "", // 可用区名称
        remark: "", // 描述
        type: "KSVD",
        clusterIdList: [],
      },
      createDataFormData: {},
      rulesTemplate: {
        name: [
          {
            required: true,
            message:
              this.$t("resourceMgr.zoneNameDesc") + this.$t("common.notNull"),
            trigger: "blur",
          },
          {
            min: 2,
            max: 18,
            message:
              this.$t("resourceMgr.zoneNameDesc") +
              this.$t("common.nameLength"),
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: this.$t("common.nametooltip"), // "输入有误",
            validator: validate.validateCharZhEnNum,
          },
        ],
        type: [
          {
            required: true,
            message:
              this.$t("resourceMgr.zoneType") + this.$t("common.notNull"),
            trigger: "blur",
          },
        ],
      },
      activestep: 0,

      selectionType: "multipleTable",
      rowkey: "clusterId",
      columnArr: [
        // 集群名称
        {
          label: this.$t("resourceMgr.clusterName"),
          prop: "name",
          width: 150,
          tooltipsFlag: true,
        },
        // 集群状态
        {
          label: this.$t("resourceMgr.clusterStatus"),
          prop: "status",
          width: 100,
        },
        // 描述
        {
          label: this.$t("resourceMgr.clusterRemark"),
          prop: "remark",
          width: 150,
          tooltipsFlag: true,
        },
        // 可用区
        {
          label: this.$t("resourceMgr.zoneName"),
          prop: "zoneName",
          width: 150,
          tooltipsFlag: true,
        },
        // 集群URL
        {
          label: this.$t("resourceMgr.clusterUrl"),
          prop: "clusterUrl",
          width: 100,
          tooltipsFlag: true,
        },
        // 集群类型
        { label: this.$t("resourceMgr.clustertype"), prop: "type", width: 100 },
        // CPU利用率
        {
          label: this.$t("resourceMgr.clustercpurate"),
          prop: "cpurate",
          width: 230,
        },
        // 内存利用率
        {
          label: this.$t("resourceMgr.clustermemoryrate"),
          prop: "memoryrate",
          width: 230,
        },
        // 存储利用率
        {
          label: this.$t("resourceMgr.clusterstoragerate"),
          prop: "storagerate",
          width: 230,
        },
      ],
      tableColumns: [],
      tableData: [],
      selectTable: [],
      defaultSelectedKeys: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 1000,
    };
  },
  watch: {},
  created() {
    this.tableColumns = this.columnArr;
    this.activestep = 0;
    this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));
    let { editflag, formData } = this.formOptions;
    if (editflag) {
      // 编辑
      this.zoneId = formData.zoneId;
      this.createDataFormData.name = formData.name;
      this.createDataFormData.remark = formData.remark;
      this.createDataFormData.type = formData.type;
    } else {
      // 新增
      this.zoneId = 0;
    }
  },
  computed: {},
  methods: {
    toCreateCluser() {
      this.$router.push({
        name: "physicalCluster",
        params: { create: true },
      });
    },

    handlerSelectionChange(selection) {
      this.activeName = [];
      this.selectTable = selection;
      let clusterIdList = [];

      selection.forEach((element, index) => {
        clusterIdList.push(element.clusterId);
        this.activeName.push(index + 1);
      });
      this.createDataFormData.clusterIdList = clusterIdList;
      // this.defaultSelectedKeys = this.selectTable;
    },
    rowSelect(row) {},
    getpageClusterList() {
      this.$nextTick(() => {
        this.$showFullScreenLoading(".mc-table");
      });
      let pramas = {
        zoneId: this.zoneId,
      };
      canBindCluster(pramas)
        .then((res) => {
          this.tableData = res;
          let selectedlist = [];
          this.tableData.forEach((element) => {
            let { selected } = element;
            if (selected) {
              selectedlist.push(element);
            }
          });
          this.defaultSelectedKeys = selectedlist;
          // this.total = res.pageInfo.total;
          this.$hideFullScreenLoading();
        })
        .catch((err) => {
          this.alertTips(err);
          this.tableData = [];
          this.$hideFullScreenLoading();
        });
    },
    // 提交
    handleConfirm(step) {
      let { editflag } = this.formOptions;
      switch (step) {
        case 0: // 确认
          if (editflag) {
            // 编辑信息
            this.commitEdit();
          } else {
            // 新增信息
            this.commitCreate();
          }
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
    handleConfirmvalidate(step) {
      if (this.$refs.createDataForm) {
        this.$refs.createDataForm.validate((valid) => {
          if (valid) {
            this.activestep = this.activestep + step; // 新增用户信息
            this.getpageClusterList();
          } else {
            return false;
          }
        });
      } else {
        this.activestep = this.activestep + step;
      }
    },
    commitEdit() {
      let editOrgData = {
        zoneId: this.zoneId,
        name: this.createDataFormData.name, // 可用区名称
        remark: this.createDataFormData.remark,
        type: this.createDataFormData.type, // 资源类型
        clusterIdList: this.createDataFormData.clusterIdList,
      };
      modifyZone(editOrgData)
        .then((res) => {
          this.alertTips(this.$t("resourceMgr.zoneEditSuccess"), "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    commitCreate() {
      let createData = {
        name: this.createDataFormData.name, // 可用区名称
        remark: this.createDataFormData.remark,
        type: this.createDataFormData.type, // 资源类型
        clusterIdList: this.createDataFormData.clusterIdList,
      };
      createZone(createData)
        .then((res) => {
          this.alertTips(this.$t("resourceMgr.zoneAddSuccess"), "success");
          this.activestep = 0;
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    handleCancel() {
      this.activestep = 0;
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },

    calculatePercentage(num, total) {
      return transformat.getPercent(num, total);
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

.drawer-body-content-steps {
  padding: 20px 30px;
}
.drawer-body-content {
  @include formStyle;
  .template-box {
    .template-box-title {
      font-size: 16px;
      font-weight: bold;
      margin-right: 25px;
      line-height: 32px;
    }
    .template-box-content {
      flex: 1;
      margin-right: 25px;
    }
  }
}
.footBtn {
  border-top: 1px $borderColor dashed;
  .el-button {
    margin-right: 15px;
  }
}
.input-with-select {
  .el-input-group__prepend {
    .el-input {
      width: 100px;
    }
  }
  .el-input-group__append {
    padding: 0 5px;
    background-color: transparent;
    .el-input {
      width: 80px;
    }
    .el-input__inner {
      border: 0px;
      height: unset;
      line-height: unset;
    }
  }
}
</style>
