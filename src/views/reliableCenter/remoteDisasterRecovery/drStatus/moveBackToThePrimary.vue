<template>
  <el-drawer
    size="1100px"
    :title="$t('reliableCenter.revertToMainSite')"
    direction="rtl"
    custom-class=""
    :append-to-body="true"
    :visible="drawerVisible"
    :destroy-on-close="true"
    :before-close="handelClose"
  >
    <div class="drawer-content" v-loading="drawerLoading">
      <div class="drawer-body-content">
        <el-form
          ref="form"
          label-width="110px"
          label-position="left"
          :model="form"
        >
          <div class="top-pick">
            <div class="pick-content">
              <img style="width: 100%" src="@/assets/hnkylin/s2m.png" alt="" />
            </div>
            <p>
              {{ $t("reliableCenter.revertNote") }}

              <span class="red-text">{{
                $t("reliableCenter.revertNote1")
              }}</span>
              {{ $t("reliableCenter.revertNote2") }}
            </p>
          </div>

          <el-form-item
            :label="$t('reliableCenter.revertServer')"
            prop="machineName"
            required
          >
            <!-- planMachineId -->
            <el-input v-model="form.machineName" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer-foot">
        <el-button type="primary" @click="handelSubmit">{{
          $t("externalCloud.vmOperate.sure")
        }}</el-button>
        <el-button @click="handelClose">{{
          $t("externalCloud.vmOperate.cancel")
        }}</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { handelmoveBack } from "@/api/remoteDisasterRecovery";
export default {
  name: "disasterRecoveryDrill",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    rowData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      drawerLoading: false,
      form: {},
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      if (isvis) {
        const idArr = [];
        const nameArr = [];
        this.rowData.forEach((e) => {
          idArr.push(e.planMachineId);
          nameArr.push(e.machineName);
        });

        this.form.machineName = nameArr.join(",");
        this.form.planMachineIds = idArr.join(",");
      }
    },
  },
  methods: {
    handelClose() {
      this.$refs.form.resetFields(); //初始化数据
      Object.assign(this.$data, this.$options.data.call(this));
      this.$emit("update:visible", false);
    },
    //提交容灾演练
    handelSubmit() {
      const params = {
        planMachineIds: this.form.planMachineIds,
      };
      this.drawerLoading = true;
      handelmoveBack(params)
        .then((res) => {
          this.$message.success(this.$t("reliableCenter.revertSubmitted"));
          this.$emit("freshTable");
          this.drawerLoading = false;
          this.handelClose();
        })
        .finally(() => {
          this.drawerLoading = false;
        });
    },
    getNetCardList() {
      const idArr = this.form.netWorkArr.map((e) => e.id);
      return idArr;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.top-title {
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 15px;
}
.top-pick {
  width: 500px;
  height: 205px;
  background-color: rgba(245, 247, 250, 1);
  padding: 15px;
  margin-left: 100px;
  margin-bottom: 18px;
  .pick-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  img {
    width: 180px;
  }
  .red-text {
    color: #f56c6c;
  }
  p {
    font-size: 13px;
    margin-top: 20px;
  }
}
</style>
