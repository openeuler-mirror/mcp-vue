<!--加载中仿进度条-->
<template>
  <el-dialog
    :title="$t(loadingTitle)"
    :visible="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="!isAll"
    width="600px"
    class="loading-animate"
    :class="isAll ? 'loading-all-animate' : ''"
    :top="top"
    :append-to-body="appendToBody"
    :before-close="handleClose"
    @close="handleClose"
  >
    <div class="content">
      <p v-if="isAll" class="title">{{ $t('loading.title') }}</p>
      <el-progress :text-inside="true" :stroke-width="15" :percentage="percent" status="success" />
      <p class="info">{{ tipsInfo }}</p>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
// @group 组件组合的封装 mc-components
//  加载中仿进度条
export default {
  // 动态加载中组件是否显示
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // 默认大概20s可以走完进度条
    time: {
      type: Number,
      default: 20
    },
    // 提示文字
    tipsInfo: {
      type: String,
      default: ''
    },
    // 弹窗类型，空表示一般弹窗，all 表示覆盖弹窗，此时不显示关闭按钮
    loadingType: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '15vh'
    },
    loadingTitle: {
      type: String,
      default: 'loading.title'
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      percent: 5,
      isAll: this.loadingType === 'all' // 是否属于覆盖弹窗
    }
  },
  created () {
    this.randomPercent()
  },
  methods: {
    handleClose () {
      this.$emit('update:show', false)
      this.$emit('close')
    },
    randomPercent () {
      const timer = setInterval((res) => {
        const percent = Math.round(Math.random() * (99 / this.time) + 1) // 每秒进度
        if (this.percent + percent >= 99) {
          clearInterval(timer)
          return
        }
        this.percent += percent
      }, 1000)
    },
    end () {
      this.percent = 100
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss">
.loading-animate {
  .el-progress-bar__outer {
    border: 1px #13ce66 solid;
  }
}

.loading-all-animate {
  .el-dialog__header,
  .el-dialog__footer {
    display: none;
  }
  .el-dialog {
    background: #efefef;
    box-shadow: none;
  }
}
</style>
<style lang="scss" scoped>
.loading-animate {
  .content {
    padding: 0 10%;
    .info {
      line-height: 1.5;
    }
  }
}
.loading-all-animate {
  .content {
    .title {
      font-size: 18px;
      text-align: center;
    }
  }
}
</style>
