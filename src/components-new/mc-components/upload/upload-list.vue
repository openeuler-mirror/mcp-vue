<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" class="upload-list">
      <div class="upload-list-box">
        <div class="upload-list-box-title flex">
          <span>{{ $t('mc-components.upload.uploader.title') }}</span>
          <div class="el-icon-close" @click="handleClose" />
        </div>
        <upload-file ref="uploadFile" v-on="$listeners" />
      </div>
    </div>
  </transition>
</template>

<script>
import uploadFile from './upload-file.vue'
import { uploader } from './index.js'

export default {
  name: 'UploadList',
  components: {
    uploadFile
  },
  provide () {
    return {
      uploaderShow: () => {
        return this.show
      }
    }
  },
  data () {
    return {
      show: false
    }
  },
  created () {
    this.$on(['toggleUploader'], show => {
      this.show = show
    })
    this.$once('hook:beforeDestroy', () => {
      this.$off(['toggleUploader'])
    })
    this.$on(['startUploader'], uploaderFile => {
      this.$refs.uploadFile.startUploader(uploaderFile)
    })
    uploader.uploaderInit(this)
  },
  mounted () {
    this.keyDown()
    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    })
  },
  methods: {
    handleClose () {
      const uploaderInstance = this.$refs.uploadFile.$refs.uploader
      uploader.hideUploader(uploaderInstance)
    },
    beforeunloadHandler (e) {
      // 关闭页面/刷新页面触发
      // e.returnValue = true
    },
    keyDown () {
      document.onkeydown = function (e) {
        e = window.event || e
        var k = e.keyCode
        // 屏蔽 shift+F10菜单
        if ((e.shiftKey && k === 121) || (e.ctrlKey && k === 121)) {
          e.keyCode = 0
          e.returnValue = false
          e.stopPropagation()
          return false
        }
      }

      // 屏蔽右键菜单
      document.oncontextmenu = function (event) {
        if (window.event) {
          event = window.event
        }
        try {
          var the = event.srcElement
          if (!((the.tagName === 'INPUT' && the.type.toLowerCase() === 'text') || the.tagName === 'TEXTAREA')) {
            return false
          }
          return true
        } catch (e) {
          return false
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-list{
  user-select: none;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.5);
  z-index: 2000;

  &-box{
    display: block;
    width: 880px;
    background-color: #fff;
    border-radius:4px;
    margin: calc((100vh - 500px) / 2) auto;
    overflow: hidden;
    position: relative;

    &-title{
      padding: 20px;
      justify-content: space-between;

      >span{
        font-size: 18px;
        color: #303133;
      }

      .el-icon-close{
        cursor: pointer;
        color: #909399;
      }

      .el-icon-close:hover{
        color: #409EFF;
      }
    }
  }
}
</style>
