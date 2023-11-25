<template>
  <div class="drawer-content">
    <div class="drawer-body-content">
      <div class="template-tipbox">
        <div class="template-tipbox-icon el-icon-warning"></div>
        <div class="template-tipbox-mag">
          <!-- 镜像中只包含选择云服务器的系统盘，为了避免镜像数据的不全面，请将云服务器的其他磁盘的重要数据迁移到系统盘中再来制作镜像！ -->
          {{ $t("imageMgr.makeImageMsg") }}
        </div>
      </div>
      <div class="template-box">
        <el-form
          ref="createDataForm"
          label-width="auto"
          :model="createDataFormData"
          :rules="rulesTemplate"
        >
          <!-- 镜像名称 -->
          <el-form-item :label="$t('imageMgr.imageName')" prop="imageName">
            <el-input
              v-model="createDataFormData.imageName"
              :placeholder="$t('imageMgr.imageNameplac')"
            />
          </el-form-item>
          <!-- 描述 -->
          <el-form-item :label="$t('imageMgr.imageRemark')" prop="imageRemark">
            <el-input
              type="textarea"
              :placeholder="$t('imageMgr.imageRemarkplac')"
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model="createDataFormData.imageRemark"
            />
          </el-form-item>
          <!-- 可用区 -->
          <el-form-item
            v-if="showzone"
            :label="$t('imageMgr.zoneName')"
            prop="zoneIds"
          >
            <el-select
              v-model="createDataFormData.zoneIds"
              multiple
              :placeholder="$t('imageMgr.zoneNameplac')"
            >
              <el-option
                v-for="(item, index) in zoneList"
                :key="'type' + index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <foot-btn
      class="drawer-foot"
      @confirm="handlerConfirm"
      @cancel="handlerCancel"
    />
  </div>
</template>
<script>
import footBtn from "@/components/Footbtn";
import { zoneList } from "@/api/vdcapi";
import { makeImage } from "@/api/imageApi";
export default {
  components: {
    footBtn,
  },
  props: {
    formOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      oriFormData: {
        selectUuid: "", // 选择云服务器uuid
        imageName: "", // 镜像名称
        imageRemark: "", // 镜像描述
        zoneIds: [], // 可用区
        selectMachineName: "", // 选择云服务器名称
      },
      createDataFormData: {},

      rulesTemplate: {
        imageName: [
          {
            required: true,
            message: this.$t("imageMgr.imageNameplac"), // "请输入镜像名称",
            trigger: "blur",
          },
        ],
        zoneIds: [
          {
            required: true,
            message: this.$t("imageMgr.zoneNameplac"), // "请选择可用区",
            trigger: "blur",
          },
        ],
      },

      zoneList: [],
      showzone: false,
    };
  },
  watch: {},
  created() {
    let info = JSON.parse(localStorage.getItem("userInfo"));
    let { topUser } = info;
    if (topUser) {
      this.showzone = true;
    } else {
      this.showzone = false;
    }
    this.getzoneList();
  },
  computed: {},
  mounted() {
    this.setPageData();
  },
  methods: {
    setPageData() {
      this.createDataFormData = JSON.parse(JSON.stringify(this.oriFormData));

      let { formData } = this.formOptions;
      this.createDataFormData = {
        selectUuid: formData.serverVmUuid, // 选择云服务器uuid
        selectMachineName: formData.aliasName, // 选择云服务器名称
        clusterId: formData.clusterId,
        imageId: "",
        imageName: "", // 镜像名称
        imageRemark: "", // 镜像描述
        zoneIds: [formData.zoneId], // 可用区id
      };
    },
    getzoneList() {
      let list = [];
      zoneList()
        .then((res) => {
          res.forEach((element) => {
            list.push({
              value: element.zoneId,
              label: element.name,
            });
          });
          this.zoneList = list;
        })
        .catch((err) => {
          this.alertTips(err);
        });
    },

    // 提交
    handlerConfirm() {
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          // 编辑信息
          this.commitEdit();
        } else {
          return false;
        }
      });
    },

    commitEdit() {
      let editData = {
        // imageId: this.createDataFormData.imageId, // 镜像id
        selectUuid: this.createDataFormData.selectUuid, // 选择云服务器uuid
        selectMachineName: this.createDataFormData.selectMachineName, // 选择云服务器名称
        selectClusterId: this.createDataFormData.clusterId,
        imageName: this.createDataFormData.imageName, // 镜像名称
        imageRemark: this.createDataFormData.imageRemark, // 镜像描述
        zoneIds: this.createDataFormData.zoneIds.toString(), // 镜像可用区
      };

      let makeImageSuccess = this.$t("imageMgr.makeImageSuccess"); // 编辑镜像成功!
      makeImage(editData)
        .then((res) => {
          this.alertTips(makeImageSuccess, "success");
          this.$parent.closeDrawer();
        })
        .catch((err) => {
          this.alertTips(err);
          this.$parent.closeDrawer();
        });
    },

    handlerCancel() {
      this.$parent.closeDrawer();
    },
    handleCloseCreate(done) {
      this.$parent.closeDrawer();
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.drawer-body-content {
  @include formStyle;
}

.template-tipbox {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  background-color: #fdf6ec;
  border-color: #faecd8;
  color: #e6a23c;
  padding: 20px;
  line-height: 20px;
  .template-tipbox-icon {
    width: 20px;
    margin-right: 15px;
    font-size: 20px;
  }
  .template-tipbox-mag {
    flex: 1;
  }
}
</style>
