<template>
  <!-- imageDetail -->
  <div class="imageDetail-detail app-container">
    <div class="basicInfo basicInfo-border">
      <!-- 基本信息 -->
      <div class="basicInfo-title">基本信息</div>
      <div class="basicInfo-content">
        <!-- 镜像名称 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">镜像名称：</div>
          <div class="basicInfo-item-value">
            {{ imageDetailInfo.imageName }}
          </div>
        </div>
        <!-- 镜像描述 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">镜像描述：</div>
          <div class="basicInfo-item-value">
            {{ imageDetailInfo.imageRemark }}
          </div>
        </div>
        <!-- 镜像状态 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">镜像状态：</div>
          <div class="basicInfo-item-value">
            <imageStatus :status="imageDetailInfo.status"></imageStatus>
          </div>
        </div>
        <!-- 镜像类型 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">镜像类型：</div>
          <div class="basicInfo-item-value">
            {{ imageDetailInfo.typeDesc }}
          </div>
        </div>
        <!-- 镜像大小 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">镜像大小：</div>
          <div class="basicInfo-item-value">
            {{ imageDetailInfo.imageSize }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="imageDetailInfo.templateImageInfo"
      class="basicInfo basicInfo-border"
    >
      <div class="basicInfo-title">模板镜像详情</div>
      <div class="basicInfo-content">
        <!-- 操作系统 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">操作系统：</div>
          <div class="basicInfo-item-value">
            {{ templateImageInfo.osMachine }}
          </div>
        </div>
        <!-- 架构 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">架构：</div>
          <div class="basicInfo-item-value">
            {{ templateImageInfo.architecture }}
          </div>
        </div>

        <!-- 系统类型 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">系统类型：</div>
          <div class="basicInfo-item-value">
            {{ templateImageInfo.systemType }}
          </div>
        </div>
        <!-- cpu大小 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">cpu大小(核)：</div>
          <div class="basicInfo-item-value">
            {{ templateImageInfo.cpu }}
          </div>
        </div>
        <!-- 内存大小 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">内存大小(GB)：</div>
          <div class="basicInfo-item-value">
            {{ templateImageInfo.mem }}
          </div>
        </div>
        <!-- 磁盘信息 -->
        <div class="basicInfo-item">
          <div class="basicInfo-item-label">磁盘信息(GB)：</div>
          <div class="basicInfo-item-value">
            {{ templateImageInfo.disks }}
          </div>
        </div>
      </div>
    </div>
    <div class="tabeleInfo tabeleInfo-cluser">
      <mc-table
        ref="imageDetailtable"
        :data="tableData"
        :total="total"
        :short-height="60"
        :rowkey="rowkey"
      >
        <template v-for="(item, index) in columnArr">
          <!-- 状态 -->
          <el-table-column
            v-if="item.prop == 'status'"
            :key="index"
            :label="item.label"
            :width="item.width"
          >
            <template slot-scope="{ row }">
              {{ row.status }}
              <!-- <imageStatus :status="row.status"></imageStatus> -->
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :prop="item.prop"
            :key="item.prop + index"
            :label="item.label"
            :width="item.width"
            :sortable="item.sortable"
          >
            <template slot-scope="{ row }">
              <el-tooltip
                v-if="item.tooltipsFlag"
                effect="light"
                :content="row[item.prop] + ''"
                placement="top"
                :visible-arrow="true"
              >
                <span>{{ row[item.prop] }}</span>
              </el-tooltip>
              <span v-else>{{ row[item.prop] }}</span>
            </template>
          </el-table-column>
        </template>
      </mc-table>
    </div>
    <!-- 操作日志 -->
    <div class="tabeleInfo tabeleInfo-log">
      <imageOperateLog></imageOperateLog>
    </div>
  </div>
</template>

<script>
import { imageInfo } from "@/api/imageApi";
import mcTable from "@/components/MctablePro";
import imageStatus from "./imageStatus.vue";
import imageOperateLog from "./imageOperateLog";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  name: "imageDetail",
  components: {
    mcTable,
    imageStatus,
    imageOperateLog,
  },
  data() {
    return {
      imageId: this.$route.params.id,
      imageDetailInfo: {},
      templateImageInfo: {},
      tableData: [],
      rowkey: "imageClusterId",
      columnArr: [
        {
          label: "集群名称", // "集群名称",
          prop: "clusterName",
          width: "300px",
        },
        {
          label: "可用区名称", // "可用区名称",
          prop: "zoneName",
          width: "300px",
        },
        {
          label: "状态", // "状态",
          prop: "statusDesc",
          width: "200px",
        },
        {
          label: "镜像路径", // "镜像路径",
          prop: "mcImagePath",
          width: "500px",
          tooltipsFlag: true,
        },
        {
          label: "创建时间", // "创建时间",
          prop: "createTime",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
    };
  },
  created() {
    this.getvdcDetail();
  },
  methods: {
    getvdcDetail() {
      let pramas = {
        imageId: this.imageId,
      };
      imageInfo(pramas)
        .then((res) => {
          this.imageDetailInfo = res;
          this.imageDetailInfo.typeDesc = dictionary.getDesc(
            res.type,
            dictionary.imgtypeArr
          );
          this.templateImageInfo = this.imageDetailInfo.templateImageInfo;
          this.tableData = this.totableData(
            this.imageDetailInfo.imageClusterList
          );
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    totableData(list) {
      let { imageClusterStatus } = dictionary;
      list.forEach((element, index) => {
        let { status } = element;

        // 状态类型映射
        list[index].statusDesc = dictionary.getDesc(status, imageClusterStatus);
      });
      return list;
    },
  },
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.imageDetail-detail {
  display: unset;
  flex: 1;
  flex-direction: column;
  .basicInfo {
    margin: 0px 15px;
    margin-bottom: 20px;
    padding: 0px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .basicInfo-title {
      font-size: 20px;
      margin: 5px 0;
    }
    .basicInfo-content {
      @include nineStyle();
      width: 100%;

      .basicInfo-item {
        display: flex;
        flex-direction: row;
        line-height: 20px;
        font-size: 14px;
        .basicInfo-item-label {
          text-align: right;
        }
        .basicInfo-item-value {
        }
      }
      .basicInfo-content-info {
        border: 1px solid $borderColor;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .basicInfo-border {
    border-bottom: 1px solid $borderColor;
    padding-bottom: 10px;
  }
  .tabeleInfo {
    margin-top: 10px;
  }
  .tabeleInfo-cluser {
    height: 300px;
  }
  .tabeleInfo-log {
    height: 500px;
  }
}
</style>