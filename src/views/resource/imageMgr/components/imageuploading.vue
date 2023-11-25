<template>
  <div class="app-container imageuploading">
    <div class="imageuploading-title">
      <!-- 上传本地镜像文件到KCP云平台 -->
      {{ $t("imageMgr.imageupload") }}
    </div>
    <div class="imageuploading-box">
      <div class="imageuploading-box-icon">
        <div class="el-icon-folder-opened"></div>
      </div>
      <div class="imageuploading-box-main">
        <div>
          <!-- 正在上传文件： -->
          {{ $t("imageMgr.uploadingFile") }}： {{ flieList.name }}，
          <!-- 请不要关闭此页面  -->
          {{ $t("imageMgr.notCloseThisPage") }}
        </div>
        <div class="imageuploading-progress">
          <el-progress
            :stroke-width="10"
            :percentage="flieList.upload_status"
            :show-text="false"
            color="#67C23A"
          ></el-progress>
          <div class="imageuploading-progress-text">
            {{ flieList.upload_status + "%" }}
          </div>
        </div>
        <div>
          <span>
            <!-- 文件总大小 -->
            {{ $t("imageMgr.filetatalSize") }}
            ：{{ flieList.size }}，
          </span>
          <span>
            <!-- 已上传 -->
            {{ $t("imageMgr.uploaded") }}： {{ flieList.loaded }}，
          </span>
          <span>
            <!-- 上传速度 -->
            {{ $t("imageMgr.uploadSpeed") }}： {{ flieList.speed }}，
          </span>
          <span>
            <!-- 已花费时间 -->
            {{ $t("imageMgr.timeSpent") }}： {{ flieList.time_spent }}，
          </span>
          <span>
            <!-- 预计剩余时间 -->
            {{ $t("imageMgr.timeRemaining") }}：
            {{ flieList.time_remaining }}
          </span>
        </div>
        <div class="imageuploading-btn">
          <el-button @click="handleCancel">
            <!-- 取消上传 -->
            {{ $t("imageMgr.cancelUpload") }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import transformat from "@/utils/transformat";
import { uploadImage } from "@/api/imageApi";
import axios from "axios";
export default {
  name: "imageuploadingHome",
  components: {},
  data() {
    return {
      loadingStatus: false,
      uploadStatus: false,
      flieList: {
        name: "", // 名称
        upload_status: 0, // 上传进度
        size: 0, // 大小
        loaded: 0, // 已经上传
        time_spent: "", // 已花费时间
        time_remaining: "", // 预计剩余时间
        speed: "",
      },
      source: null, //取消上传
      uploadFormData: {},
    };
  },
  created() {},
  mounted() {
    let { params } = this.$route;
    this.uploadFormData = params.uploadFormData;
    this.upload();
  },
  methods: {
    handleConfirm() {
      let { params } = this.$route;
      this.$router.push({
        name: "imageupload",
        query: { type: params.type },
        params: { type: params.type },
      });
    },
    handleCancel() {
      this.axiosCancel();
      this.$router.push({
        name: "imageupload",
        query: { type: params.type },
        params: { type: params.type },
      });
    },
    axiosCancel() {
      let that = this;
      this.flieList = {
        name: "", // 名称
        upload_status: 0, // 上传进度
        size: 0, // 大小
        loaded: 0, // 已经上传
        time_spent: "", // 已花费时间
        time_remaining: "", // 预计剩余时间
        speed: "",
      };
      if (that.source) {
        //我先判断soucre是否存在，因为如果我打开弹框不作任何操作，点击取消按钮没有这一层判断的话，that.source.cancel('取消上传');会报错。
        that.source.cancel("取消上传"); //"取消上传"这几个字，会在上面catch()的error中输出的，可以console看一下。
      }
    },
    //
    upload() {
      // this.loadingStatus = true;
      // this.uploadStatus = true;
      let that = this;
      let cancelToken = axios.CancelToken; //Axios使我修改axios原型链了。
      that.source = cancelToken.source();

      let file = this.uploadFormData.file;
      this.flieList.name = file.name;
      // 计算文件大小
      this.flieList.size = transformat.transFileSize(file.size);
      const formData = new FormData();
      formData.append("imageName", this.uploadFormData.imageName);
      formData.append("imageRemark", this.uploadFormData.imageRemark);
      formData.append("zoneIds", this.uploadFormData.zoneIds.toString());
      formData.append("file", this.uploadFormData.file);
      let t0 = new Date(); // 文件开始上传时间
      uploadImage(formData, this.source.token, (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        this.flieList.upload_status = transformat.keepTwoDecimal(
          percentCompleted * 0.99,
          2
        );
        let t1 = new Date(); // 已上传文件大小时间

        // 计算出当前上传为多少kb/s
        let time_spent = (t1 - t0) / 1000;
        let s = Math.round(progressEvent.loaded / 1024 / time_spent);
        if (s > 1024) {
          this.flieList.speed = (s / 1024).toFixed(2) + "M/s";
        } else {
          this.flieList.speed = s + "kb/s";
        }
        this.flieList.loaded = transformat.transFileSize(progressEvent.loaded);
        // 计算已花费时间
        this.flieList.time_spent = transformat.formatterData(t1 - t0) || "-";
        // 计算剩余时间
        let remaining = progressEvent.total - progressEvent.loaded;

        let t2 = remaining / 1024 / s;
        let time_remaining = t2 * 1000;

        this.flieList.time_remaining =
          transformat.formatterData(time_remaining) || "-";
      })
        .then((res) => {
          this.flieList.upload_status = 100;
          this.alertTips("镜像文件上传成功，正在分发镜像到各个集群", "success");
          this.$router.push({
            name: "imageMgr",
          });
        })
        .catch(function (error) {
          that.axiosCancel();
          if (axios.isCancel(error)) {
            //主要是这里
            that.alertTips("取消上传镜像操作成功", "success");
          }
          that.$router.push({
            name: "imageupload",
          });
        });
    },
  },
  beforeDestroy() {
    this.axiosCancel();
    // this.$router.push({
    //   name: "imageMgr",
    // });
  },
};
</script>
<style lang="scss">
.imageuploading-progress {
  .el-progress {
    width: 90%;
  }
}
</style>
<style lang="scss" scoped>
.imageuploading {
  padding: 0px;
  display: flex;

  flex-direction: column;
  .imageuploading-title {
    margin: 15px 20px;
    font-size: 20px;
  }
  .imageuploading-box {
    width: 100%;
    display: flex;
    .imageuploading-box-icon {
      width: 200px;
      height: 200px;
      margin: 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 100px;
      color: #409eff;
    }
    .imageuploading-box-main {
      width: 900px;
      height: 200px;
      .imageuploading-progress {
        width: 100%;
        margin: 20px 0;
        display: flex;
        align-items: center;
        .imageuploading-progress-text {
          margin-left: 20px;
        }
      }
      .imageuploading-btn {
        margin-top: 25px;
      }
    }
  }
}
</style>
