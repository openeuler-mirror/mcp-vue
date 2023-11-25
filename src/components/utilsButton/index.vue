<template>
  <div class="btn-content">
    <el-button v-if="type === 'fresh'" @click="refresh">
      <i
        :class="['el-icon-refresh', getAnimate]"
        :title="$t('common.refresh')"
      />
    </el-button>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    type: {
      type: String,
      default: "",
    },
    spinBol: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      animateSpinBol: false,
    };
  },
  watch: {
    spinBol(newSpinBol) {
      this.animateSpinBol = newSpinBol;
    },
  },
  computed: {
    getAnimate() {
      return this.animateSpinBol ? "icon" : "";
    },
  },
  created() {},
  methods: {
    refresh() {
      if (this.animateSpinBol) return;
      this.$emit("refresh");
    },
  },
};
</script>
<style lang="scss" scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
::v-deep.icon {
  animation: spin 2s linear infinite;
}
</style>
