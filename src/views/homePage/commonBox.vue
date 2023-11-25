<template>
  <!-- commonBox -->
  <div class="commonBox">
    <div class="vdcListBox-item-top">
      <div class="icon-out">
        <div class="icon-in"></div>
      </div>
      <div class="vdcListBox-item-title">{{ title }}</div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "vdcListBox",
  props: ["title"],
  components: {},
  computed: {},
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.commonBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  font-size: 14px;
  .vdcListBox-item-top {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    .vdcListBox-item-title {
      margin-left: 10px;
      font-weight: bold;
    }
  }
  .vdcListBox-item-bottom {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  .icon-out {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: $msgInfo;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-in {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #fff;
    }
  }
}
</style>
