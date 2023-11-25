<template>
  <!-- 设置磁盘信息 -->
  <div class="setDiskInfo-box">
    <div v-if="oridiskShowList.length === 0" class="disk-group-wrap">
      <!-- 磁盘 -->
      <el-form-item :label="$t('common.hard')">
        <!-- 该云服务器没有申请磁盘，请按需添加 -->
        <span>{{ $t("common.addhardMsg") }}</span>
        <i class="el-icon-circle-plus-outline" @click="addDiskItem" />
      </el-form-item>
    </div>
    <div v-else class="disk-group-wrap">
      <div v-for="(item, index) in oridiskShowList" :key="index">
        <el-form-item
          :label="
            $t('common.hard') + (oridiskShowList.length > 1 ? index + 1 : '')
          "
          prop="disk"
        >
          <el-input
            v-model="item.diskSize"
            v-if="item.type === 'custom'"
            v-only-num
          >
            <template slot="append">GB</template>
          </el-input>

          <el-input
            v-model="item.diskSize"
            v-if="item.type === 'original'"
            :disabled="item.applyModifyType == 'NONE'"
          >
            <template slot="append">GB</template>
          </el-input>
          <i
            class="el-icon-remove-outline"
            v-if="item.type === 'custom' || item.applyModifyType === 'DELETE'"
            @click="deleteDiskItem(item)"
          />
          <i
            v-show="index === oridiskShowList.length - 1"
            class="el-icon-circle-plus-outline"
            @click="addDiskItem"
          />

          <span v-if="item.applyModifyType === 'DELETE'" class="applyDelete">
            <!-- 申请删除 -->
            ({{ $t("common.applyDelete") }})
          </span>
          <span v-if="item.applyModifyType === 'MODIFY'" class="applyDelete">
            <!-- 原大小 -->
            ({{ $t("common.originalSize") }}:{{ item.oldDiskSize }}GB)
          </span>
        </el-form-item>
      </div>
    </div>
  </div>
</template>
<script>
import ReMessage from "@/utils/message";
export default {
  components: {},
  props: ["formData", "pageMode"],
  data() {
    return {
      // 磁盘列表
      oridiskList: [],
      oridiskShowList: [],
      cmtdiskList: [],
    };
  },

  created() {},
  mounted() {
    if (this.formData) {
      this.setPageDefaultData(this.formData);
    }
  },
  watch: {
    formData(val) {
      this.setPageDefaultData(val);
    },
  },
  // watch: {
  //   data: {
  //     handler: function (newValue, oldValue) {
  //       if (newValue) {
  //         this.$refs.elTable.clearSelection();
  //         this.tableData = newValue;
  //         this.toggleSelection();
  //         this.$nextTick(() => {
  //           this.calcTableHeight();
  //         });
  //       }
  //     },
  //     // 代表在wacth里声明了 立即先去执行handler方法
  //     immediate: false,
  //     deep: true,
  //   },
  // },
  methods: {
    setPageDefaultData(defaultData) {
      if (JSON.stringify(defaultData) == "{}") {
        return;
      } else {
        let { disks } = defaultData;
        // switch (this.pageMode) {
        //   case "TEMPADD": // 模板新增
        //     if (applyNum == 1) {
        //       this.showbingIpBox = true;
        //     }
        //     break;
        //   case "ISOADD": // ISO新增
        //     this.showbingIpBox = false;
        //     break;
        //   case "CHANGE": // 变更
        //     this.showbingIpBox = true;
        //     break;

        //   default:
        //     this.showbingIpBox = false;
        //     break;
        // }
        this.dealDiskListIndex(disks);
      }
    },
    dealDiskListIndex(oriList) {
      oriList.forEach((element, index) => {
        element.index = index;
      });
      this.oridiskList = JSON.parse(JSON.stringify(oriList));
      this.dealDiskList(this.oridiskList);
    },
    dealDiskList(oriList) {
      let list = [];
      let filtermodifyType = ["DELETE", "ADDDELETE"];
      oriList.forEach((element) => {
        let { modifyType } = element;
        if (filtermodifyType.indexOf(modifyType) == -1) {
          list.push(element);
        }
      });
      this.oridiskShowList = list;
    },
    // 添加
    addDiskItem() {
      let diskNumMaxMsg = this.$t("common.diskNumMaxMsg"); // "磁盘数目已达上限";
      if (this.oridiskShowList.length >= 4) {
        this.alertTips(diskNumMaxMsg);
        return false;
      }
      let index = this.oridiskList.length;
      let addDisk = {
        diskSize: 300,
        type: "custom",
        modifyType: "ADD",
        applyId: 0,
        id: 0,
        index: index,
      };
      this.oridiskList.push(addDisk);
      this.dealDiskList(this.oridiskList);
    },
    // 删除
    deleteDiskItem(item) {
      let { modifyType, applyId, index } = item;
      if (modifyType == "ADD" && applyId == 0) {
        this.oridiskList[index].modifyType = "ADDDELETE";
      } else {
        this.oridiskList[index].modifyType = "DELETE";
      }
      this.dealDiskList(this.oridiskList);
    },

    submitForm() {
      let flag = true;
      let diskNumMsg = this.$t("common.diskNumMsg"); // "磁盘大小不能为小于1的正整数";
      let diskNumSizeMsg = this.$t("common.diskNumSizeMsg"); // "磁盘大小不能为空";
      let diskNumMinMsg = this.$t("common.diskNumMinMsg"); // "至少添加一块磁盘";
      let disks = this.oridiskList;
      let diskList = [];
      for (let i = 0; i < disks.length; i++) {
        var disk = disks[i];
        let { modifyType, oldDiskSize, diskSize, type } = disks[i];
        if (modifyType !== "ADDDELETE") {
          if (isNaN(diskSize) && diskSize != 0) {
            diskSize = "";
          }
          if (type == "original" && this.pageMode == "CHANGE") {
            if (parseInt(oldDiskSize) > parseInt(diskSize)) {
              ReMessage.error("原有磁盘只能变大，不能变小");
              diskSize = oldDiskSize;
              flag = false;
              break;
            }
          }
          if (parseInt(diskSize) <= 0) {
            ReMessage.error(diskNumMsg);
            flag = false;
            break;
          }
          if (!diskSize) {
            ReMessage.error(diskNumSizeMsg);
            flag = false;
            break;
          }
          disk.diskCapacity = diskSize;
          diskList.push(disk);
        }
      }
      this.cmtdiskList = diskList;
      if (this.cmtdiskList.length < 1) {
        ReMessage.error(diskNumMinMsg);
        flag = false;
      }
      return flag;
    },
    resetForm() {
      // 磁盘列表
      this.oridiskList = [];
      this.oridiskShowList = [];
      this.cmtdiskList = [];
    },
  },
  beforeDestroy() {
    this.resetForm();
  },
};
</script>

<style lang="scss" scoped>
.setDiskInfo-box {
  .applyDelete {
    margin-left: 10px;
    font-size: 8px;
    color: rgb(226, 111, 17);
  }
}
</style>
