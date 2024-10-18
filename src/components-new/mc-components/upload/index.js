import Vue from 'vue'
import { merge, hasIn, omitBy } from 'lodash'
import vueSimpleUploader from 'vue-simple-uploader'
Vue.use(vueSimpleUploader)

/* uploader使用方法
1.注册组件
在全局的视图vue中引入upload-list.vue文件，注册到components中，在html中调用<upload-list @viewLinkTo="handlerLinkTo" />
全局的视图vue包括：layout.vue,headerBar.vue,App.vue等，只需要选其中一个即可
2.调用uploader
在相关业务页面引入本js文件
import { uploader } from '@/components-new/mc-components/upload'
然后调用挂载在uploader上的方法，建议在this.$nextTick中调用，除非能够保证页面已经渲染完成
如：
    this.$nextTick(() => {
      // 设置uploader默认参数（公共参数），这里设置了后面selectFile就可以不用设置
      uploader.setUploaderProps({
        cancelRequest: {
          apiFun: () => {},
          params: { id: 1 }
        },
        autoUpload: true, // 是否自动上传
        uploaderRequest: {
          url: 'http://192.5.7.10:8084/appshop/app-info/upload',
          params: {}, // 上传的额外参数
          headers: { // 上传的请求头
            'X-ACCESS-KYLINSEC-TOKEN': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc0FkbWluIjp0cnVlLCJ1c2VybmFtZSI6Im1jYWRtaW4xIn0.uwXhHQpv29PimTCUMlEkTC6KasbNFnBUnFKSuT_oUH4'
          }
        }
      })
    })
    // 选择文件
    uploader.selectFile({
      cancelRequest: {
        apiFun: () => {},
        params: { appid: 132132 }，可以设置单独的参数
      },
      uploaderRequest: {
        params: {
          uniqueIdentifier: 24,
          appId: 24
        }, // 上传的额外参数
        viewLinkTo: '4564654654'
      },
      typelabel: '黄金镜像',
      autoUpload: false, // 是否自动上传，会覆盖setUploaderProps设置的默认值
      showAfterSelected: true
    })
 */

// 默认值
const defaultProps = {
  cancelRequest: {
    apiFun: '', // 取消上传接口，用于通知服务器取消上传
    params: {} // 请求参数
  },
  uploaderRequest: {
    url: '', // 上传请求路径，每个业务每条上传记录的上传路径都有可能不一样
    chunkSize: '',
    params: { // 请求参数
    },
    headers: {}, // 请求头
    viewLinkTo: '' // 上传完成后的查看按钮跳转地址
  },
  typelabel: '', // 文件类型label
  autoUpload: false, // 选择文件后是否立刻上传
  showAfterSelected: true // 选择文件后是否弹出上传弹窗,
}

const uploaderProps = merge({}, defaultProps)
// 选择文件时，保存参数
let selectFileProps = {}
const instantiate = {
  uploader: null, // uploader实例
  uploaderBtn: null, // uploaderBtn上传按钮实例
  uploaderFile: '', // 将要上传的文件实例，与原生的file不一样,
  batchUploaderBtn: null // 批量上传按钮实例
}

// 合并，将其他对象的属性赋值到objects[0]中
const mergeFun = (objects = [], arg = {}, sources = []) => {
  // 使用omitBy过滤非uploaderProps中的参数
  merge(...objects, omitBy(arg, (val, key) => {
    return !hasIn(uploaderProps, key)
  }), ...sources)
}

const uploader = new Vue()

// 初始化uploader
uploader.uploaderInit = (comp) => {
  // 弹窗显示方法
  uploader.showUploader = (callback) => {
    comp.$emit('toggleUploader', true)
    callback && callback()
  }

  // 弹窗隐藏方法
  uploader.hideUploader = (uploaderInstance) => {
    selectFileProps = {}
    // 是否刷新列表
    const freshListBol = uploaderProps.uploaderRequest.extraParams && uploaderProps.uploaderRequest.extraParams.freshListBol
    if (freshListBol) {
      uploader.freshFileList(uploaderInstance)
    }
    comp.$emit('toggleUploader', false)
  }
  uploader.freshFileList = (uploaderInstance) => {
    const fileList = uploaderInstance.files
    fileList.forEach(file => {
      // 删除文件需要异步进行
      setTimeout(() => {
        file.cancel()
        uploader.getInstantiation('uploader').removeFile(file)
      }, 500)
    })
  }
  // 设置uploaderProps参数方法，设置默认值，调用startUploader与selectFile时没有设置的参数会使用默认值
  uploader.setUploaderProps = ({ ...args } = {}) => {
    mergeFun([uploaderProps], args)
    mergeFun([defaultProps], args)
    args.callback && args.callback()
  }

  // 开始上传方法，参数是selectFile返回的uploaderFile实例
  uploader.startUploader = (uploaderFile) => {
    if (uploaderFile) {
      // startUploader还要强制开启自动上传autoUpload
      merge(uploaderFile, { autoUpload: true })
      comp.$emit('startUploader', uploaderFile)
    } else {
      throw new Error('startUploader方法的参数必须是selectFile方法返回的uploaderFile实例')
    }
  }
}

// 获取uploaderProps参数方法
uploader.getUploaderProps = (key) => {
  return key ? uploaderProps[key] : uploaderProps
}

// 设置实例化的uploader对象
uploader.setInstantiation = ({ ...args } = {}) => {
  Object.assign(instantiate, args)
}

// 获取实例化的uploader对象
uploader.getInstantiation = (key) => {
  return key ? instantiate[key] : instantiate
}

// 选择文件方法，用来打开选择文件弹窗
// 参数与uploaderProps相同，此外还有confirm, cancel回调事件
uploader.selectFile = ({ ...args } = {}) => {
  selectFileProps = {}
  const { singleFile } = uploaderProps.uploaderRequest.props
  uploaderProps.showAfterSelected = args.showAfterSelected ?? defaultProps.showAfterSelected
  // 通过传参singleFile设置是否多选，默认单选
  const targetBtn = singleFile ? instantiate.uploaderBtn : instantiate.batchUploaderBtn
  // 设置可选文件类型之后，再触发点击事件
  targetBtn.$refs.btn.querySelector('input').setAttribute('accept', args.accept)
  targetBtn.$emit('click', defaultProps)
  targetBtn.$el.click()
  merge(selectFileProps, { ...args })

  // 需要等待onFileAdded事件执行完毕之后再开始上传
  // 原生有回调方法
  // const timer = setInterval(() => {

  // }, 100)
}
uploader.afterSelect = (uploaderFile) => {
  const _uploaderFile = uploaderFile
  if (_uploaderFile?.fileAdded) {
    const { confirm, cancel } = selectFileProps
    if (_uploaderFile) {
      // 设置uploader参数
      const props = {}
      mergeFun([props, uploaderProps], selectFileProps)
      merge(_uploaderFile, props)
      // 选择了文件
      confirm && confirm(_uploaderFile)
      // 是否自动上传
      _uploaderFile.autoUpload && uploader.startUploader(_uploaderFile)
    } else {
      // 没有选文件
      cancel && cancel()
    }
  }
}
export {
  uploader
}
