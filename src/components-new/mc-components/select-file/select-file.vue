<template>
  <div class="select-file">
    <div v-if="type==='image'" class="flex">
      <mc-image
        v-if="src"
        :disabled="disUse"
        :src="src"
        :show-delete="showDelete"
        @delet="handlerDelet"
      />
      <div>
        <mc-upload
          ref="mc-upload"
          :disabled="disUse"
          :accept="accept"
          :size="size"
          @select="handlerSelect"
        >
          <el-button :loading="loading" :disabled="disUse">{{ $t('mc-ui.upload.file.selectImage') }}</el-button>
        </mc-upload>
        <mc-tooltip
          v-if="tooltipContent"
          place="right"
          :content="tooltipContent"
        />
      </div>
    </div>

    <el-input
      v-if="type==='file'"
      v-model="src"
      :disabled="disUse"
      readonly
      :placeholder="placeholder"
      :style="inputStyle"
    >
      <template slot="append">
        <mc-upload :disabled="disUse" :accept="accept" :size="size" @select="handlerSelect">
          <el-button :loading="loading" :disabled="disUse">{{ $t('mc-ui.upload.file.selectFile') }}</el-button>
        </mc-upload>
      </template>
    </el-input>

  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import mcUpload from '@/components-new/mc-ui/upload/mc-upload.vue'
import mcTooltip from '@/components-new/mc-ui/tooltip/mc-tooltip.vue'
import mcImage from '@/components-new/mc-ui/image/mc-image.vue'
import uploadProps from '@/components-new/mc-ui/upload/props.js'

/**
  * @group 组件组合的封装 mc-components
  * 单张图片/单个文件的选择与展示
  * ！！! 多图片/多文件可参考本组件后请使用 mc-upload 组件定制
  * 示例：
  * [选图片]
  * <select-file
  *   v-model="xxx"
  *   show-delete
  *   :disabled="disabled"
  *   accept=".jpg"  // 默认无限制格式
  *   :size="10"  // 默认5MB
  *   :tooltip-content="这是提示，支持html"
  * />
  *
  * [选文件]
  * <select-file
  *   :disabled="disabled"
  *   :file="new Blob()"  // 可以使用v-model="new Blob()"
  *   type="file"
  *   accept=".bat,.sh"
  *   :size="0"  // 为0不限制大小
  *   @select="selectFile"
  * />
  */
export default {
  components: {
    mcUpload,
    mcTooltip,
    mcImage
  },
  mixins: [uploadProps],
  model: {
    prop: 'file',
    event: 'change'
  },
  props: {
    // 组件样式功能类型:image file
    type: {
      // `'image'` / `'file'`
      type: String,
      default: 'image'
    },
    // 文件流,可以直接使用v-model
    // file设置为空时请尽量赋值为new Blob():file = new Blob()
    file: {
      type: Blob,
      default: () => {
        return new Blob()
      }
    },
    // 显示删除图片按钮,仅type="image"生效
    showDelete: {
      type: Boolean,
      default: false
    },
    // 图片提示内容,仅type="image"生效
    tooltipContent: {
      type: String,
      default: ''
    },
    // 选择文件的placeholder,仅type="file"生效
    placeholder: {
      type: String,
      default: ''
    },
    // 选择文件的样式,仅type="file"生效
    inputStyle: {
      type: String,
      default: ''
    },
    // 等待动画，等待时会开启禁用
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      src: ''
    }
  },
  computed: {
    // 禁用
    disUse () {
      return this.loading || this.disabled
    }
  },
  watch: {
    file: {
      deep: true,
      immediate: true,
      handler (val) {
        // file = new Blob() 时也为空
        if (isEmpty(val)) {
          this.src = ''
        } else {
          this.setSrc(val)
        }
      }
    }
  },
  methods: {
    setSrc (file) {
      if (this.type === 'image' && file.type.includes('image')) {
        this.src = window.URL.createObjectURL(file)
      } else {
        this.src = file.name
      }
    },
    handlerSelect (file) {
      this.setSrc(file)
      this.handlerChange(file)
      // 选择文件时触发
      // @arg 返回file实体
      this.$emit('select', file)
    },
    handlerDelet (file) {
      this.src = ''
      this.$refs['mc-upload'].clearFiles()
      this.handlerChange(new Blob())
      // 删除文件时触发
      // @arg 返回file实体
      this.$emit('delet', file)
    },
    handlerChange (file) {
      // 内部方法,选择文件时触发,会被v-model绑定,无需调用
      this.$emit('change', file)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-file{
  display: inline-block;
  width: 100%;
}
</style>
