<template>
  <!-- 私有镜像 -->
  <div class="privateImage">
    <!-- 头部菜单栏 -->
    <header-bar
      ref="headerBar"
      :spinBol="tableLoading"
      :selectData="selectTable"
      @refreshTable="refreshTable"
    />

    <mc-table
      ref="privateImageTable"
      :tableLoading="tableLoading"
      :data="tableData"
      :total="total"
      :pageSize="pageSize"
      :currentPage="pageNo"
      @selection-change="handlerSelectionChange"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
      :rowkey="rowkey"
      :selectionType="selectionType"
      style="margin-top: 20px"
    >
      <template v-for="(item, index) in columnArr">
        <!-- 操作 -->
        <el-table-column
          v-if="item.prop == 'operation'"
          fixed="right"
          :key="index"
          :label="item.label"
          :width="item.width"
          className="tableoperation"
        >
          <template slot-scope="{ row }">
            <el-link
              v-if="otherBtnShow('private_image', 'private_image_edit')"
              type="primary"
              @click="editInfo(row)"
            >
              {{ $t("common.modify") }}
            </el-link>
            <el-dropdown
              v-if="row.toggleList.length > 0"
              trigger="click"
              @visible-change="visibleChange"
            >
              <el-link type="primary" @click.stop="stoplinkclick">
                <!-- 更多 -->
                {{ $t("resourceMgr.servervmmore") }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-link>
              <el-dropdown-menu slot="dropdown">
                <template v-for="(item, index) in row.toggleList">
                  <el-dropdown-item :key="item.key + index" :command="item">
                    <el-link
                      v-if="item.show"
                      @click="downToggleCommand(item.key, row)"
                      :disabled="item.disabled"
                      :underline="false"
                    >
                      {{ item.label }}
                    </el-link>
                  </el-dropdown-item>
                </template>
                <el-dropdown-item v-if="toggleList.length == 0">
                  <el-link :underline="false">
                    {{ $t("common.noMoreOperations") }}
                  </el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- imageName -->
        <el-table-column
          v-else-if="item.prop == 'imageName'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <el-tooltip
              effect="light"
              :content="row[item.prop] + ''"
              placement="top"
              :visible-arrow="true"
            >
              <router-link
                :to="{
                  name: 'imageDetail',
                  params: { id: row.imageId, type: 'privateImage' },
                }"
              >
                <el-link type="primary">{{ row.imageName }}</el-link>
              </router-link>
              <!-- <span v-else>{{ row.name }}</span> -->
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          v-else-if="item.prop == 'status'"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="{ row }">
            <imageStatus :status="row.status" :rowstatus="row"></imageStatus>
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

    <!-- 创建/编辑 -->
    <createEditModal
      :options="modalOption"
      :visible.sync="showcreateEditModal"
    ></createEditModal>

    <!-- 转为公共镜像 -->
    <convertTopublicMirror
      :options="topublicmodalOption"
      :visible.sync="showtopublicModal"
    ></convertTopublicMirror>

    <!-- 转为共享镜像 -->
    <convertTosharedImage
      :options="tosharedmodalOption"
      :visible.sync="showtosharedModal"
    ></convertTosharedImage>
  </div>
</template>

<script>
import mcTable from "@/components/MctablePro";
import headerBar from "./header.vue";
import imageStatus from "../components/imageStatus.vue";
import createEditModal from "./editImage/createEditModal.vue";
import convertTopublicMirror from "../components/convertTopublicMirror/createEditModal.vue";
import convertTosharedImage from "../components/convertTosharedImage/createEditModal.vue";
import {
  pageImage,
  syncImage,
  deleteImage,
  imageDownload,
} from "@/api/imageApi";
import dictionary from "@/assets/common/dataDictionary/dictionary";
export default {
  name: "privateImage",
  components: {
    headerBar,
    mcTable,
    createEditModal,
    convertTopublicMirror,
    convertTosharedImage,
    imageStatus,
  },
  data() {
    return {
      rowkey: "imageId",
      tableLoading: false,
      selectionType: "multipleTable",
      columnArr: [
        {
          label: this.$t("imageMgr.imageName"), // "名称",
          prop: "imageName",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: this.$t("imageMgr.status"), // "状态",
          prop: "status",
          width: "100px",
        },
        {
          label: this.$t("imageMgr.imageRemark"), //"描述",
          prop: "imageRemark",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: this.$t("imageMgr.imageSize"), //  "容量",
          prop: "imageSize",
          width: "100px",
        },
        {
          label: this.$t("imageMgr.typeDesc"), //  "镜像类型",
          prop: "typeDesc",
          width: "100px",
        },
        {
          label: this.$t("imageMgr.orgNameDesc"), //  "所属组织",
          prop: "orgName",
          width: "200px",
        },
        {
          label: this.$t("imageMgr.createUser"), // "创建者",
          prop: "createUser",
          width: "200px",
        },
        {
          label: this.$t("imageMgr.imageFromDesc"), //  "来源",
          prop: "imageFromDesc",
          width: "200px",
        },
        {
          label: this.$t("imageMgr.zoneName"), //  "可用区",
          prop: "zoneName",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: this.$t("imageMgr.createTime"), //  "创建时间",
          prop: "createTime",
          width: "200px",
          tooltipsFlag: true,
        },
        {
          label: this.$t("common.operation"), // "操作",
          prop: "operation",
          width: "200px",
        },
      ],
      tableData: [],
      total: 0,
      // 分页数1开始
      pageNo: 1,
      // 每页数量
      pageSize: 20,
      searchKey: "",
      toggleList: [
        // {
        //   key: "topublicMirror",
        //   label: "转为公共镜像", //"转为公共镜像",
        //   disabled: false,
        //   show: true,
        // },
        {
          key: "tosharedImage",
          label: this.$t("imageMgr.tosharedImage"), //"转为共享镜像",
          disabled: false,
          show: true,
        },
        {
          key: "imageDownload",
          label: this.$t("imageMgr.imageDownload"), // "导出镜像",
          disabled: true,
          show: true,
        },
        {
          key: "syncImage",
          label: this.$t("imageMgr.syncImage"), // "同步镜像",
          disabled: false,
          show: true,
        },
        {
          key: "deleteImage",
          label: this.$t("imageMgr.deleteImage"), // "删除",
          disabled: true,
          show: true,
        },
      ],
      // 模态框配置
      showcreateEditModal: false,
      modalOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },

      showtopublicModal: false,
      topublicmodalOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },

      showtosharedModal: false,
      tosharedmodalOption: {
        title: "",
        editflag: "",
        formData: "", // 表单数据
      },
      selectTable: [],
    };
  },
  created() {
    // this.renderTable();
  },
  mounted() {
    this.renderTable();
  },
  methods: {
    // 刷新表格
    refreshTable() {
      this.renderTable();
    },
    handlePageChange(page) {
      this.pageNo = +page;
      this.renderTable();
    },
    handleSizeChange(pageSize) {
      this.pageNo = 1;
      this.pageSize = pageSize;
      this.renderTable();
    },
    // 搜索内容
    changeSearchKey(val) {
      this.searchKey = val;
    },
    renderTable() {
      this.tableLoading = true;
      // 枚举: PUBLIC,SHARE,PRIVATE
      // 枚举备注: PUBLIC( "公共镜像"), SHARE("共享镜像"), PRIVATE("私有镜像"),
      let params = {
        visibleType: "PRIVATE",
        pageSize: this.pageSize, //	string	非必须 分页数量
        pageNo: this.pageNo, // 非必须 页面
        searchKey: this.searchKey, // 搜索内容
      };
      pageImage(params)
        .then((res) => {
          this.tableData = this.totableData(res.list);
          this.total = res.pageInfo.total;
        })
        .catch((err) => {
          this.tableData = [];
          this.total = 0;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    totableData(list) {
      let toggleList = JSON.parse(JSON.stringify(this.toggleList));
      list.forEach((element, index) => {
        let { imageFrom, type, status } = element;
        // 来源映射
        list[index].imageFromDesc = dictionary.getDesc(
          imageFrom,
          dictionary.imageFromArr
        );
        // 镜像类型映射
        list[index].typeDesc = dictionary.getDesc(type, dictionary.imgtypeArr);
        let newtoggleList = [];
        toggleList.forEach((toggleListelement, toggleListi) => {
          let { key } = toggleListelement;

          toggleList[toggleListi].disabled = true;
          toggleList[toggleListi].show = false;
          switch (key) {
            case "tosharedImage": // 转为共享镜像
              toggleList[toggleListi].disabled = false;
              toggleList[toggleListi].show = this.otherBtnShow(
                "private_image",
                "private_image_to_share"
              );

              break;
            case "imageDownload":
              toggleList[toggleListi].disabled = false;
              toggleList[toggleListi].show = this.otherBtnShow(
                "private_image",
                "private_image_download"
              );

              break;
            case "syncImage":
              if (status == "ERROR") {
                toggleList[toggleListi].disabled = false;
              }
              toggleList[toggleListi].show = this.otherBtnShow(
                "private_image",
                "private_image_sync"
              );

              break;
            case "deleteImage":
              let statusArr = ["ERROR", "NORMAL"];
              if (statusArr.indexOf(status) > -1) {
                toggleList[toggleListi].disabled = false;
                list[index].deleteImageDisabled = false;
              } else {
                list[index].deleteImageDisabled = true;
              }
              toggleList[toggleListi].show = this.otherBtnShow(
                "private_image",
                "private_image_delete"
              );

              break;

            default:
              toggleList[toggleListi].disabled = true;
              toggleList[toggleListi].show = false;
              break;
          }
          if (toggleList[toggleListi].show) {
            newtoggleList.push(toggleList[toggleListi]);
          }
        });
        list[index].toggleList = JSON.parse(JSON.stringify(newtoggleList));
      });
      return list;
    },
    editInfo(row) {
      this.modalOption.title = this.$t("imageMgr.editImage"); // "编辑镜像";

      this.modalOption.formData = row;
      this.showcreateEditModal = true;
    },
    stoplinkclick() {},
    visibleChange() {},
    downToggleCommand(key, row) {
      switch (key) {
        case "topublicMirror": // 转为公共镜像
          this.topublicmodalOption.title = this.$t("imageMgr.topublicMirror"); // "转为公共镜像";

          this.topublicmodalOption.formData = row;
          this.showtopublicModal = true;
          break;

        case "tosharedImage": // 转为共享镜像
          this.tosharedmodalOption.title = this.$t("imageMgr.tosharedImage"); // "转为共享镜像";

          this.tosharedmodalOption.formData = row;
          this.showtosharedModal = true;
          break;
        case "imageDownload": // 导出镜像
          this.imageDownload(row);
          break;
        case "syncImage": // 同步镜像
          this.setsyncImage(row);
          break;
        case "deleteImage": // 删除镜像
          this.setdeleteImage(row);
          break;

        default:
          break;
      }
    },
    imageDownload(row) {
      let params = {
        imageId: row.imageId, // 镜像id
      };
      imageDownload(params)
        .then((res) => {
          window.open(res.mcDownLoadUrl, "_self");
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    setsyncImage(row) {
      let params = {
        imageId: row.imageId, // 镜像id
      };
      let successMsg = this.$t("imageMgr.syncImageSuccess"); // "同步镜像成功";
      syncImage(params)
        .then((res) => {
          this.alertTips(successMsg, "success");
          this.refreshTable();
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },
    setdeleteImage(row) {
      let deleteConfirm = this.$t("imageMgr.deleteConfirm"); // 确定删除该镜像?
      let deleteSuccess = this.$t("imageMgr.deleteSuccess"); // "删除镜像成功!"
      this.$confirm(deleteConfirm, this.$t("common.tips"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning",
      })
        .then(() => {
          let params = {
            imageId: row.imageId, // 镜像id
          };
          deleteImage(params)
            .then((res) => {
              this.alertTips(deleteSuccess, "success");
              this.refreshTable();
            })
            .catch((err) => {
              this.alertTips(err);
            });
        })
        .catch(() => {
          this.alertTips(this.$t("common.canceled"), "info");
        });
    },
    handlerSelectionChange(selection) {
      this.selectTable = selection;
    },
  },
};
</script>
<style lang="scss" scoped>
.privateImage {
  display: flex;
  flex-direction: column;
  flex: 1;
  .tableoperation {
    .cell {
      display: inline-flex;
      align-items: center;
      .el-link,
      .el-dropdown {
        height: 100%;
        margin-right: 15px;
      }
    }
  }
}
</style>
