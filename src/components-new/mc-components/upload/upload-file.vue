<template>
  <div>
    <div class="flex upload-file-tips">
      <span class="el-icon-warning" />{{ $t('mc-components.upload.uploader.tips') }}
    </div>
    <div class="upload-card">
      <uploader
        ref="uploader"
        :options="options"
        :auto-start="false"
        class="upload-file-content"
        @file-added="onFileAdded"
        @files-added="onFilesAdded"
        @file-success="onFileSuccess"
        @file-error="onFileError"
        @file-progress="onFileProgress"
        @files-submitted="onFilesSubmitted"
      >
        <uploader-drop v-show="showUploadBtn">
          <uploader-btn ref="uploader-btn" single />
          <uploader-btn ref="batch-uploader-btn" :single="false" />
        </uploader-drop>

        <uploader-list>
          <template slot-scope="list_props">
            <div :handleList="handleList(list_props)">
              <div v-for="file in list_props.fileList" :key="file.id" class="upload-card-item flex">
                <uploader-file
                  ref="uploaderFile"
                  :file="file"
                  class="upload-file"
                  :list="true"
                >
                  <template slot-scope="props">
                    <div class="flex upload-card-prop">
                      <div class="upload-card-content">
                        <div class="flex upload-card-downText">
                          <div class="upload-card-appName">
                            <!-- 名称 -->
                            <mc-overflow-tooltip :key="file.name">
                              {{ file.name }}
                            </mc-overflow-tooltip>
                          </div>
                          <!-- 上传完成时显示 -->
                          <div v-if="props.status!=='success'" class="upload-card-text flex">
                            <!-- 文件大小 -->
                            <span>{{ $t('mc-components.upload.size') }}:{{ size2Unit(file.size) }}</span>
                            <!-- 存储位置 -->
                            <span>{{ $t('mc-components.upload.storagePath') }}:
                              <mc-overflow-tooltip :key="file.location+new Date().getTime()" :disabled="!file.location">
                                {{ file.location }}
                              </mc-overflow-tooltip>
                            </span>
                            <!-- MD5 -->
                            <span>MD5:
                              <mc-overflow-tooltip :key="file.md5" :disabled="!file.md5" :content="file.md5">
                                {{ file.md5 }}
                              </mc-overflow-tooltip>
                            </span>
                          </div>
                          <!-- 其他状态时显示 -->
                          <div v-else class="upload-card-text flex">
                            <!-- 已上传/总大小 -->
                            <span>{{ $t('mc-components.upload.uploaded') }}:{{ props.status!='error'?(parseFloat(props.formatedSize)*props.file._prevProgress).toFixed(1):'--' }}/{{ props.formatedSize }}</span>
                            <!-- 上传速度 -->
                            <span class="upload-card-speed">{{ $t('mc-components.upload.speed') }}:{{ file.paused? 0: getSpeedFunc(file,props) }}</span>
                          </div>
                        </div>
                        <div class="flex" style="align-items:center">
                          <!-- 进度 -->
                          <el-progress
                            style="flex:1"
                            :percentage="getProgress(props)"
                            :show-text="false"
                            :color="exchangeStatus(props,file).color"
                          />
                          <span
                            class="upload-card-desc"
                          >{{ parseInt((props.file._prevUploadedSize/props.size)*100)+'%' }}</span>
                          <!-- 状态 -->
                          <span
                            class="upload-card-desc"
                            :style="{width:'120px',textAlign:'center',color:exchangeStatus(props,file).color}"
                          >{{ file.retryLoad?'':$t('mc-components.upload.uploader.'+exchangeStatus(props,file).status) }}
                          </span>
                        </div>
                        <div class="flex upload-card-downText" style="height:21px">
                          <!-- 文件类型，selectFile时自定义传入 -->
                          <div class="upload-card-appName" style="width:180px;color:#aaa">{{ file.typelabel }}</div>
                          <!-- 创建时间，由后端生成 -->
                          <div class="upload-card-text flex" style="color:#aaa">{{ file.createAt }}</div>
                        </div>
                      </div>

                      <div class="upload-card-btn">
                        <div v-if="['uploading','paused'].includes(props.status)">
                          <el-button
                            :type="file.isUploading()?'primary':'warning'"
                            :loading="file.pauseLoad||file.frontCalculating||file.calculating"
                            @click="pauseFile(file,file.isUploading())"
                          >{{ file.isUploading()?$t('mc-components.upload.pause'):$t('mc-components.upload.continue') }}</el-button>
                          <el-button
                            type="danger"
                            :loading="file.cancelLoad"
                            @click="handlerCancel(file,1)"
                          >{{ $t('common.cancel') }}</el-button>
                        </div>
                        <el-button
                          v-else-if="props.status=='waiting'"
                          type="danger"
                          :loading="file.cancelLoad"
                          @click="handlerCancel(file,1)"
                        >{{ $t('common.cancel') }}</el-button>
                        <div v-else-if="props.status=='error'">
                          <el-button
                            type="warning"
                            :loading="file.retryLoad"
                            @click="handlerRetry(file)"
                          >{{ $t('mc-components.upload.retry') }}</el-button>
                          <el-button
                            type="danger"
                            :loading="file.cancelLoad"
                            @click="handlerCancel(file,2)"
                          >{{ $t('common.delete') }}</el-button>
                        </div>
                        <div v-else-if="['success','calculating'].includes(props.status)">
                          <!-- 查看 -->
                          <el-button
                            type="primary"
                            :disabled="file.calculating"
                            @click="handlerView(file)"
                          >{{ $t('mc-components.upload.view') }}</el-button>
                          <el-button
                            type="danger"
                            :loading="file.cancelLoad||file.calculating"
                            @click="handlerCancel(file,2)"
                          >{{ $t('common.delete') }}</el-button>
                        </div>
                      </div>
                    </div>
                  </template>
                </uploader-file>
              </div>
            </div>
          </template>
        </uploader-list>
      </uploader>
    </div>
  </div>
</template>

<script>
/**
	 * uploadFile  文件上传
	 * @description 文件上传组件，用于选择应用，文件流分片断点续传。
	 * @tutorial https://github.com/simple-uploader/vue-uploader/blob/master/README_zh-CN.md
	 * @tutorial https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E9%85%8D%E7%BD%AE
	 */
import { uploader } from './index.js'
import { cloneDeep } from 'lodash'
import { size2Unit, volumeUnit } from '@/utils/unit.js'
import variables from '@/styles/variables.scss'
import mcOverflowTooltip from '@/components-new/mc-ui/tooltip/mc-overflow-tooltip.vue'
import SparkMD5 from 'spark-md5'
import MD5 from 'js-md5'
import { mcUploadFileFunc } from '@/api/mc-components/components.js'

// const fileTypes = ['rpm', 'rar', '7z', 'java-archive', 'msdownload', 'ms-dos-executable', 'zip', 'msi', 'jar', 'MSIX']

export default {
  components: { mcOverflowTooltip },
  inject: ['uploaderShow'],
  props: {
    params: {
      type: Object,
      default: () => ({
        appId: 0
      })
    },
    showUploadBtn: {
      type: Boolean,
      default: false
    },
    fileData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      fileList: [],
      fileAdded: false,
      variables: variables,
      options: {
        target: '', // 目标上传 URL
        chunkSize: 10 * 1024 * 1024, // 分块时按照该值来分
        forceChunkSize: true, // 是否强制所有的块都是小于等于 chunkSize 的值
        simultaneousUploads: 3, // 并发上传数
        maxChunkRetries: 1, // 最大自动失败重试上传次数
        chunkRetryInterval: 500, // 重试间隔
        // 其他额外的参数,可以是一个对象或者是一个函数
        query: (file, chunk) => {
          return {
            // 可以针对于每个file对象设置自定义的params
            ...file.uploaderRequest?.params
          }
        },
        generateUniqueIdentifier: () => {
          return null
        }, // 文件唯一标识
        // 服务器分片校验函数，实现断点续传和秒传
        checkChunkUploadedByResponse: (chunk, message) => {
          const _chunk = chunk
          return uploader.checkChunkUploadedByResponseFunc(_chunk, message)
        },
        allowDuplicateUploads: true, // 同一个文件多次上传
        successStatuses: [200],
        permanentErrors: [-1, 1],
        headers: {}
      },
      singleFile: true // 多文件
    }
  },
  computed: {
    show () {
      return this.uploaderShow()
    }
  },
  watch: {
    fileData: {
      immediate: true,
      deep: true,
      handler (val) {
        this.fileList = cloneDeep(val)
        for (const item of this.fileList) {
          this.$set(item, 'in_list', false)
        }
        this.$forceUpdate()
      }
    }
  },
  mounted () {
    // 设置uploader实例
    uploader.setInstantiation({
      uploader: this.$refs.uploader.uploader,
      uploaderBtn: this.$refs['uploader-btn'],
      batchUploaderBtn: this.$refs['batch-uploader-btn']
    })
  },
  methods: {
    size2Unit (val) {
      return size2Unit(val)
    },
    // 设置参数
    setUploaderProps (uploaderFile) {
      const { uploaderRequest } = uploaderFile
      const uploaderObj = uploader.getInstantiation('uploader')
      // 通过uploader实例修改参数
      uploaderObj.opts.target = uploaderRequest.url
      uploaderObj.opts.chunkSize = uploaderRequest.chunkSize
      uploaderObj.opts.headers = uploaderRequest.headers
      // 合并额外新增参数
      Object.assign(uploaderRequest.params, uploaderRequest.extraParams)
    },
    // 添加单一文件
    onFileAdded (file) {
      file.fileAdded = true
      this.fileAdded = true
    },
    // 添加批量文件
    onFilesAdded (files) {
      const checkFildsBol = uploader.checkFildsFunc(files)
      if (!checkFildsBol) {
        files.ingored = true
        files.fileAdded = false
        this.fileAdded = checkFildsBol
        return false
      }
      uploader.setInstantiation({ 'uploaderFile': files })
      files.forEach(file => {
        file.fileAdded = true
        this.fileAdded = true
        setTimeout(() => {
          uploader.setInstantiation({ 'uploaderFile': null })
          uploader.afterSelect(file)
        }, 50)
      })
    },
    // 添加完成
    onFilesSubmitted (files, fileList) {
      const uploaderFile = uploader.getInstantiation('uploaderFile')
      if (uploaderFile && this.fileAdded) {
        // 是否弹出上传弹窗
        !this.show && uploader.getUploaderProps('showAfterSelected') && uploader.showUploader()
        uploader.setInstantiation({ 'uploaderFile': null })
      }
    },
    setFileError (file) {
      file.status = 'error'
      file.error = true
    },
    // 兼容低版本的Firefox浏览器response数据
    trimFirefoxResponse (response, str) {
      if (response.includes(`<${str}>`) && `<${str}>`.length > 0) {
        return response.substring(response.indexOf(`<${str}>`) + `<${str}>`.length, response.indexOf(`</${str}>`))
      } else {
        return ''
      }
    },
    // 文件上传成功
    onFileSuccess (rootFile, file, message, chunk) {
      try {
        let res = {}
        try {
          res = JSON.parse(message)
        } catch (err) {
          res = {
            status: this.trimFirefoxResponse(message, 'status'),
            msg: this.trimFirefoxResponse(message, 'msg')
          }
        }
        if (file.isComplete() && String(res.status) === '200') {
          this.alertTips(this.$t('mc-components.upload.uploader.success.tips'), 'success')

          const json = res.data
          file.location = json.location
          if (json.md5) { // 小文件
            file.md5 = json.md5
            this.$set(file, 'status', 'success')
          } else {
            // 大文件,md5需要后台异步计算
            file.uploaderRequest.getMd5Value(file)
          }
        } else {
          this.setFileError(file)
          this.alertTips(res.msg, 'error')
        }
      } catch (error) {
        this.setFileError(file)
        this.alertTips(this.$t('mc-components.upload.uploader.error.tips'), 'error')
      }
    },
    // 文件上传出错
    onFileError (rootFile, file, message, chunk) {
      if (String(chunk.xhr.status) === '401') {
        this.alertTips(this.$t('mc-components.upload.uploader.auth.tips'), 'error')
        return false
      }
      this.pauseFile(file, true)
      this.alertTips(this.$t('mc-components.upload.uploader.fail.tips'), 'error')
    },

    onFileProgress (rootFile, file, chunk) {
      const { name: filename, size: totalSize } = file.file
      if (chunk.processedState?.res) {
        const res = JSON.parse(chunk.processedState.res)
        if (res.status !== 200) {
          this.fileAbortFunc(file)
          this.pauseFile(file, true)
          mcUploadFileFunc({ identifier: file.uniqueIdentifier, filename, totalSize }, file.uploaderRequest.props.url).then(({ chunkIdList }) => {
            if ([1, 2, 3].every(item => chunkIdList.includes(item))) {
              this.setFileError(file)
            } else {
              // 当重试从第一块上传并开启 并发上传3块时,插件会遗漏第一次并发上传的部分块,因此满足条件时取消重试功能,直接删除
              file.cancel && file.cancel()
            }
            this.alertTips(res.msg, 'error')
          }).catch(_ => {
            file.cancel && file.cancel()
          })
        }
      }
      // if (Number(chunkNumber) === 1) {
      //   // 在第一个分片的响应数据中赋值开始上传时间，时间数据从接口获取
      //   const res = JSON.parse(chunk.processedState.res)
      //   if (res.status === 200) {
      //     // code：200上传完成，201：分包上传成功，-1：上传错误
      //     res.data.code === 201 && this.$set(file, 'createAt', res.data.createAt)
      //   }
      // }
    },
    getProgress (props) {
      // parseInt((props.file._prevUploadedSize/props.size)*100)<0?0:parseInt((props.file._prevUploadedSize/props.size)*100)
      const progress = parseInt(props.progress * 100)
      return Math.min(Math.max(0, progress), 100)
    },
    handleList (val) {
      for (const file of val.fileList) {
        this.$set(file, 'retryLoad', false)
        this.$set(file, 'pauseLoad', false)
        this.$set(file, 'cancelLoad', false)
        for (const item of this.fileList) {
          if (String(file.uniqueIdentifier) === String(item.appId)) {
            Object.assign(file, item)
            item.in_list = true
            break
          }
        }
      }
    },
    // 单个暂停/继续上传
    pauseFile (file, type) {
      if (file.size - file._prevUploadedSize > 1048576) {
        file.pauseLoad = true
        if (type && file.pause) {
          this.$set(file, 'manualPaused', false)
          file.pause()
          file.status = 'paused'
        } else if (file.resume) {
          if (file.uniqueIdentifier) {
            file.resume()
            file.status = ''
          } else {
            const isLargeFile = file.size > 1024 * 1024 * 500
            file.uniqueIdentifierType = isLargeFile ? 0 : 1
            if (isLargeFile) {
              // 完整计算整个文件MD5值
              file.isAllMd5 = this.computeMD5(file, true, 1)
            }
            this.computeMD5(file, !isLargeFile).then(file => {
              file.uploaderRequest = { params: {} }
              file.uploaderRequest.params.md5 = file.uniqueIdentifierType ? file.md5 : ''
              file.resume()
              file.status = ''
            })
          }
        }
        setTimeout(() => {
          file.pauseLoad = false
          this.$forceUpdate()
        }, 800)
      }
    },
    // 开始上传
    startUploader (file) {
      const isLargeFile = file.size > 1024 * 1024 * 500
      file.uniqueIdentifierType = isLargeFile ? 0 : 1
      if (isLargeFile) {
        // 完整计算整个文件MD5值
        file.isAllMd5 = this.computeMD5(file, true, 1)
      }
      this.computeMD5(file, !isLargeFile).then(newfile => {
        this.setUploaderProps(newfile)
        this.handlerUpolad(newfile)
      })
    },
    handlerUpolad (file) {
      const _file = file
      if (_file) {
        _file.uploaderRequest.params.md5 = _file.uniqueIdentifierType ? file.md5 : ''
        _file.resume && _file.resume()
        uploader.setInstantiation({ 'uploaderFile': null })
      }
      // file && setTimeout(() => {
      //   file.uploaderRequest.params.md5 = file.uniqueIdentifierType ? file.md5 : ''
      //   file.resume && file.resume()
      //   uploader.setInstantiation({ 'uploaderFile': null })
      // }, 500)
    },
    // 重试上传
    handlerRetry (file) {
      const { fileId: fileIdName, uploadFileMd5Func } = file.uploaderRequest.props
      const isLargeFile = file.size > 1024 * 1024 * 500
      if (isLargeFile) {
        // 异步计算大文件的md5还未计算完成和请求，需要重新计算并请求
        if (typeof file.isAllMd5 !== 'string') {
          this.computeMD5(file, true, 1).then(({ file, md5 }) => {
            file.isAllMd5 = md5
            const fileId = file.uploaderRequest.params[fileIdName]
            uploadFileMd5Func({ fileId, clientMd5: md5 })
          })
        }
      }
      if (file.retry) {
        file.retryLoad = true
        file.resume && file.resume()
        file.retry && file.retry()
        setTimeout(() => {
          file.retryLoad = false
          file.status = ''
          this.$forceUpdate()
        }, 800)
      }
    },
    // 查看
    handlerView (file) {
      if (file.typelabel === this.$t('platformUpgrade.upload.UpgradePackage')) {
        sessionStorage.setItem('fileManagetabName', 'upgradeFile')
      }
      // 跳转到重构之后的文件管理
      sessionStorage.setItem('redirectUrl', '/systemPreserveUpgrade/fileManagement')
      top.location.href = process.env.VUE_APP_BASE_API + `/systemManagement/systemManagement?fileName=${file.name}`
    },
    // 取消上传：已经开始上传的并且在服务器有记录的请使用此方法
    handlerCancel (file, type) {
      if (!file.paused) {
        this.pauseFile(file, true)
        // 添加手动暂停标识
        this.$set(file, 'manualPaused', true)
      }
      this.confirmTips({
        title: this.$t('mc-components.upload.uploader.cancel' + type + '.title'),
        content: this.$t('mc-components.upload.uploader.cancel' + type + '.tips')
      }).then(res => {
        this.fileAbortFunc(file)
        file.cancelLoad = true
        if (type === 1) {
          // 取消
          this.cancelUploaded(file)
        } else {
          // 删除
          this.createLoading()
          file.cancelRequest.apiFun(
            {
              cancelParmas: { ...file.cancelRequest.params },
              requestParams: { ...file.uploaderRequest.params }
            }
          ).then(res => {
            this.cancelUploaded(file)
            this.alertTips(this.$t('mc-components.upload.uploader.cancel' + type + '.success'), 'success')
          }).finally(() => {
            this.hideLoading()
            setTimeout(() => {
              file.cancelLoad = false
              this.$forceUpdate()
            }, 800)
          })
        }
      }).catch(_ => {
        file.manualPaused && this.pauseFile(file, false)
      })
    },
    // 此方法从上传队列中移除未开始上传的文件，删除不了服务器记录
    removeFile (file) {
      uploader.getInstantiation('uploader').removeFile(file)
    },
    // 此方法从上传队列中移除已上传的文件，并停止后台上传任务，删除不了服务器记录
    cancelUploaded (file) {
      file.cancel && file.cancel()
    },
    exchangeStatus (props, file) {
      if (file.status) {
        props.status = file.status
      }
      if (props && props.status) {
        const val = this.getCOlorStatus(file, props)
        return { color: variables[val[0]], status: val[1] }
      }
      return { color: '#aaa', text: '' }
    },
    computeMD5 (file, isComCalc, type) {
      const fileReader = new FileReader()
      // const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 1024 * 1024 * 10
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      !type && this.$set(file, 'frontCalculating', true)
      this.$forceUpdate()
      loadNext()
      file.reader = fileReader
      return new Promise((resolve, reject) => {
        fileReader.onload = (e) => {
          spark.append(e.target.result)
          /*
            1.判断条件分文件大于500M，和小于500M
              大于500M的先计算前500M的MD5值，再异步进行第二步,计算整个文件MD5值
            2.异步再调用此方法为固定计算完整文件的MD5值
          */
          const judCon = isComCalc ? (currentChunk < chunks) : (currentChunk * chunkSize < 1024 * 1024 * 500)
          if (judCon) {
            currentChunk++
            loadNext()
          } else {
            const md5 = spark.end()
            if (type) {
              resolve({ file, md5 })
            } else {
              file.uniqueIdentifier = MD5(md5 + file.name + file.size)
              file.md5 = md5
              this.$set(file, 'frontCalculating', false)
              this.$set(file, 'paused', false)
              // md5计算完毕
              resolve(file)
            }
          }
        }
        fileReader.onerror = () => {
          this.alertTips(this.$t('mc-components.upload.uploader.reade.error', [file.name]), 'error')
          reject()
          /*
            普通读取出错直接删除
            大文件异步计算读取出错,不删除,可以重试
          */
          if (!isComCalc || !type) {
            file.cancel()
          }
        }
      })
      function loadNext () {
        const start = currentChunk * chunkSize
        const end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    // 如果处于md5计算状态，终止文件的读取过程
    fileAbortFunc (file) {
      if (file.frontCalculating && file.reader) {
        file.reader.abort()
      }
    },
    getCOlorStatus (file, props) {
      return [
        {
          key: file.frontCalculating, // 前端计算md5中
          value: ['colorSuccess', 'frontCalculation']
        },
        {
          key: file.calculating, // 后端校验md5中
          value: ['colorSuccess', 'calculating']
        },
        {
          key: props.status === 'paused',
          value: ['colorWarning', 'paused']
        },
        {
          key: file.isUploading(),
          value: ['colorPrimary', 'uploading']
        },
        {
          key: props.status === 'waiting',
          value: ['colorDisabled', 'waiting']
        },
        {
          key: props.status === 'success',
          value: ['colorSuccess', 'success']
        },
        {
          key: props.status === 'error',
          value: ['colorDanger', 'error']
        }
      ].find(({ key }) => key)?.value || ['colorWarning', 'paused']
    },
    getSpeedFunc (file, props) {
      if (!file.startSize) {
        file.startSize = file.sizeUploaded()
      }
      if (!file.uploadingTime) {
        file.uploadingTime = Date.now()
      }
      const nowDate = Date.now()
      // 1s更新一次上传速度
      if (nowDate - file.uploadingTime > 1000 && (file.sizeUploaded() - file.startSize > 0)) {
        const sizeUploaded = file.sizeUploaded()
        file.speed = volumeUnit(((sizeUploaded - file.startSize) / 1024) / ((nowDate - file.uploadingTime) / 1000), { tofix: 1 })
        file.uploadingTime = nowDate
        file.startSize = sizeUploaded
      }
      return Number(!(props.status === 'waiting' || !file.speed)) && file.speed + '/s'
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-file-content{
  .uploader-drop {
    padding: 0;
		width: 360px;
		height: 100px;
		background-color: #fff;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;

    &:hover {
      border-color: #409EFF;
    }
	}

  .uploader-btn {
		margin-right: 4px;
		width: 100%;
		height: 100%;
		border: none;
		padding: 0;
    text-align: center;

    &:hover {
      background-color: #fff !important;
    }

    .el-icon-upload {
      font-size: 67px;
      color: #C0C4CC;
      margin: 10px 0 6px;
      line-height: 50px;
    }
	}

  &__text {
    color: #606266;
    font-size: 14px;
    text-align: center;

    em {
      color: #409EFF;
      font-style: normal;
    }
	}

  .el-upload__tip{
    div{
      line-height: 20px;
    }

    p{
      text-indent: 2em;
      line-height: 20px;
    }
  }
}

.upload-file{
  width:100%;
  border:none;
  height:60px;

  &-tips{
    height: 40px;
    padding: 0 12px;
    border: solid 1px #eee;
    color: #E6A23C;
    font-size: 14px;
    align-items: center;

    >.el-icon-warning{
      margin-right: 10px;
    }
  }
}

.upload-card{
    width: 100%;
    height: 400px;
    padding-top: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 14px;
    color: #000;

    &-options{
      background-color: #fff;
      padding-bottom: 10px;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    &-item{
      width: 100%;
      margin-bottom: 20px;
    }

    ::v-deep .el-checkbox-group {
      font-size: inherit;
    }

    &-checkbox{
      margin-top: 20px;
      margin-right: 20px;

      ::v-deep .el-checkbox__label{
        display: none;
      }
    }

    &-prop{
      height:100%;
      padding-left: 20px;
    }

    &-content{
      flex: 1;
      width: 600px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }

    &-appName{
      width: 200px;
      height: 100%;
      display: inherit;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &-downText{
      width: 100%;
      justify-content: space-between;
      align-content: space-around;
      align-items: center;
      line-height: 1.2;
      .overflow-tooltip{
        text-align: left;
      }
    }

    &-text{
      width: 500px;
      justify-content: flex-end;

      >span{
        width: 150px;
        text-align: right;
        display: flex;
        justify-content: center;
        white-space: nowrap;
        padding-left: 25px;
      }
    }

    &-speed{
      margin-left: 10px;
      color: #aaa;
    }

    &-desc{
      width:50px;
      margin-left:20px;
      line-height:1.5
    }

    &-btn{
      width: 160px;
      height: 60px;
      margin-left: 20px;
      padding-top: 15px;
      line-height: 1;
    }
  }
</style>
