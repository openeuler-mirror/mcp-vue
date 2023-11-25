<template>
  <el-drawer
    size="300px"
    direction="btt"
    :modal="true"
    custom-class="taskcenterBox"
    :wrapper-closable="false"
    v-if="drawerVisible"
    :visible.sync="drawerVisible"
    :before-close="handleCloseCreate"
    :destroy-on-close="true"
  >
    <div slot="title" class="taskcenterBox-title">
      <div class="">
        <!-- 任务台 -->
        {{ $t("taskcenter.taskDesk") }}
      </div>
      <div class="taskcenterBox-operation">
        <div class="viewHistoricalTasks" @click="viewHistoricalTask">
          <!-- 查看历史任务 -->
          {{ $t("taskcenter.viewHistoricalTasks") }}
        </div>
        <div class="refreshTasks">
          <i
            class="el-icon-refresh setting-icon"
            :title="$t('common.refresh')"
            @click="refresh"
          />
        </div>
      </div>
    </div>
    <taskcenterBox
      ref="taskcenterBox"
      :formOptions="formOptions"
      @confirm="confirm"
    />
  </el-drawer>
</template>

<script>
import taskcenterBox from "./taskcenterBox.vue";
import bus from "@/utils/eventBus";
export default {
  components: {
    taskcenterBox,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      drawerVisible: this.visible,
      formOptions: this.options,
    };
  },
  watch: {
    visible(isvis) {
      this.drawerVisible = isvis;
      this.formOptions = this.options;
    },
  },
  methods: {
    handleCloseCreate() {
      this.$emit("update:visible", false);
      // this.$parent.renderTable();
    },
    confirm(rows) {
      this.$emit("confirm", rows);
    },
    refresh() {
      this.$refs.taskcenterBox.renderTable();
    },
    viewHistoricalTask() {
      bus.$emit("changeMenuNav", "monitor");
      this.$router.push({ name: "taskcenter", params: {} });
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss">
.taskcenterBox {
  > .el-drawer__header {
    height: 40px;
    background: inherit;
    background-color: rgba(64, 169, 255, 1);
    color: #fff;
    font-size: 16px;
    > .el-drawer__close-btn {
      padding: 0;
    }
  }

  .taskcenterBox-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .taskcenterBox-operation {
    display: flex;
    .refreshTasks,
    .viewHistoricalTasks {
      cursor: pointer;
    }
    .viewHistoricalTasks:hover {
      text-decoration: underline;
    }
    .setting-icon {
      margin: 0 15px;
    }
  }
}
</style>
