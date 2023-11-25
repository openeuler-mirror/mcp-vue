<template>
  <div class="app-container imageupload">
    <div class="imageupload-title">
      <!-- 上传本地镜像文件到KCP云平台 -->
      {{ $t("imageMgr.imageupload") }}
    </div>
    <div class="imageupload-form template-box">
      <el-form
        ref="createDataForm"
        label-width="auto"
        :model="uploadFormData"
        :rules="rulesTemplate"
      >
        <!-- 选择镜像 -->
        <el-form-item
          :label="$t('imageMgr.fileName')"
          prop="fileName"
          class="input-with-select"
        >
          <el-input
            v-model="uploadFormData.fileName"
            qlinput-readonly
            readonly
            :placeholder="$t('imageMgr.fileNameplac')"
            clearable
          >
            <!-- //slot="suffix"重点 btnClearable事件，value有值就显示没有值就隐藏 -->
            <span
              slot="suffix"
              v-show="uploadFormData.fileName"
              @click="fileNameclear"
            >
              <i class="el-input__icon el-icon-circle-close"></i>
            </span>
            <template #append>
              <el-upload
                ref="upload"
                class="upload-demo"
                action=""
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :before-upload="handleUpload"
                :limit="limit"
                :show-file-list="false"
              >
                <el-button>
                  {{ $t("common.select") }}
                </el-button>
              </el-upload>
            </template>
          </el-input>
        </el-form-item>
        <!-- 镜像名称 -->
        <el-form-item :label="$t('imageMgr.imageName')" prop="imageName">
          <el-input
            v-model="uploadFormData.imageName"
            :placeholder="$t('imageMgr.imageNameplac')"
          />
        </el-form-item>
        <!-- 描述 -->
        <el-form-item :label="$t('imageMgr.imageRemark')" prop="imageRemark">
          <el-input
            type="textarea"
            :placeholder="$t('imageMgr.imageRemarkplac')"
            maxlength="400"
            show-word-limit
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="uploadFormData.imageRemark"
          />
        </el-form-item>
        <!-- 可用区 -->
        <el-form-item
          v-if="imageType == 'publicImage'"
          :label="$t('imageMgr.zoneName')"
          prop="zoneIds"
        >
          <el-select
            v-model="uploadFormData.zoneIds"
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
    <div class="imageupload-bottom">
      <el-button type="primary" @click="handleConfirm">
        <!-- 确认 -->
        {{ $t("common.confirmation") }}
      </el-button>

      <el-button @click="handleCancel">{{ $t("common.cancel") }}</el-button>
    </div>
  </div>
</template>

<script>
import { checkImageName } from "@/api/imageApi";
import { zoneList } from "@/api/vdcapi";
export default {
  name: "imageuploadHome",
  components: {},
  data() {
    return {
      // 最大允许上传个数
      limit: 1,
      zoneList: [],
      uploadFormData: {
        imageName: "", // 镜像名称
        imageRemark: "", // 镜像描述
        zoneIds: "", // 可用区id
        file: "", //
        fileName: "", // 镜像名称
      },

      rulesTemplate: {
        fileName: [
          {
            required: true,
            message: this.$t("imageMgr.fileNameplac"), // "请选择镜像文件",
            trigger: "blur",
          },
        ],
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
      clustertypeList: [],
      formValidate: {
        mirror_name: "",
        sys_type: 0,
        rule_type: "",
        file: null,
      },
      imageType: "",
    };
  },
  created() {
    this.imageType = this.$route.params.type;
    this.getzoneList();
  },
  methods: {
    fileNameclear() {
      this.uploadFormData.fileName = "";
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
    handleConfirm() {
      this.$refs.createDataForm.validate((valid) => {
        if (valid) {
          // 检查镜像名称是否已存在
          this.checkImageNamevalid();
        } else {
          return false;
        }
      });
    },
    checkImageNamevalid() {
      let params = {
        imageName: this.uploadFormData.imageName,
      };

      checkImageName(params)
        .then((res) => {
          this.$router.push({
            name: "imageuploading",
            params: {
              type: this.imageType,
              uploadFormData: this.uploadFormData,
            },
          });
        })
        .catch((err) => {
          console.error("err", err);
        });
    },

    handleCancel() {
      this.$refs.createDataForm.resetFields();
      this.$router.push({
        name: "imageMgr",
        params: {
          type: this.imageType,
          uploadFormData: this.uploadFormData,
        },
      });
    },
    openSelectModal() {},
    handlePreview() {},
    handleRemove() {},
    beforeRemove() {},
    handleUpload(file) {
      if (!file) return;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isLt2M = file.size / 1024 / 1024 / 1024 < 50;
      let uploadFileFormat = this.$t("imageMgr.uploadFileFormat"); // "上传文件只能是 .iso、.gvm格式!";
      let uploadFileSize = this.$t("imageMgr.uploadFileSize"); // "上传文件大小不能超过 50GB!";
      if (testmsg !== "iso" && testmsg !== "gvm") {
        this.$refs.upload.clearFiles();
        this.$message({
          message: uploadFileFormat,
          type: "warning",
        });
        return false;
      }
      if (!isLt2M) {
        this.$refs.upload.clearFiles();
        this.$message({
          message: uploadFileSize,
          type: "warning",
        });
        return false;
      }
      this.uploadFormData.fileName = file.name;
      this.uploadFormData.file = file;
      return false;
    },
  },
};
</script>
<style lang="scss" scoped>
.imageupload {
  padding: 0px;
  display: flex;

  flex-direction: column;
  .imageupload-title {
    margin: 15px 20px;
    font-size: 20px;
  }
  .imageupload-form {
    @include formStyle;
    flex: 1;
    overflow: auto;
    $input-width: 375px;
    flex-direction: column;
    .el-input,
    .el-select,
    .el-textarea {
      width: $input-width;
    }
  }
  .imageupload-bottom {
    width: 100%;
    height: 83px;
    border-top: 1px#d7d7d7 solid;
    display: flex;
    align-items: center;
    .el-button {
      margin-left: 20px;
    }
  }
}
</style>
<style lang="scss">
.imageupload {
  .upload-demo,
  .el-upload {
    width: 100%;
    height: 100%;
  }
}
</style>
